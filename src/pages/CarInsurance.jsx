import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import FormField from '../components/forms/FormField';
import ImageUpload from '../components/forms/ImageUpload';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  nieNumber: z.string().min(1, 'NIE number is required'),
  dateOfCarLicense: z.string().min(1, 'Date of car license is required'),
  nationalityOfCarLicense: z.string().min(1, 'Nationality of car license is required'),
  address: z.string().min(1, 'Address is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  telephone: z.string().min(1, 'Telephone is required'),
  carMake: z.string().min(1, 'Car make is required'),
  carModel: z.string().min(1, 'Car model is required'),
  year: z.number().min(1990, 'Year must be after 1990'),
  registration: z.string().min(1, 'Registration number is required'),
  horsepower: z.number().min(1, 'Horsepower must be positive').optional(),
  engineSize: z.number().min(1, 'Engine size must be positive').optional(),
  transmissionType: z.enum(['Manual', 'Automatic', 'Hybrid', 'Full Electric'], {
    errorMap: () => ({ message: 'Transmission type is required' }),
  }).optional(),
  logbookImage: z.instanceof(File).optional(),
  currentCompany: z.string().min(1, 'Current company is required'),
  currentPremium: z.number().min(0, 'Premium must be positive'),
  currentCover: z.string().min(1, 'Current cover is required'),
});

export default function CarInsurance() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [useLogbookImage, setUseLogbookImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const logbookImage = watch('logbookImage');
  useEffect(() => {
    return () => {
      if (logbookImage) {
        URL.revokeObjectURL(URL.createObjectURL(logbookImage));
      }
    };
  }, [logbookImage]);

  const handleNext = async () => {
    const fieldsToValidate = {
      1: ['fullName', 'dateOfBirth', 'nationality', 'nieNumber', 'dateOfCarLicense', 'nationalityOfCarLicense', 'address', 'postcode', 'email', 'telephone'],
      2: useLogbookImage ? ['logbookImage'] : ['carMake', 'carModel', 'year', 'registration', 'horsepower', 'engineSize', 'transmissionType'],
      3: ['currentCompany', 'currentPremium', 'currentCover'],
    }[step];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const handlePrevious = () => setStep(step - 1);

  const onSubmit = async (data) => {
    const response = await fetch('https://formspree.io/f/xjgzokzw', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      toast.success('Quote submitted successfully!');
    } else {
      toast.error('Failed to submit quote.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Compare and Save on Your Car Insurance
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Go Back to Home</span>
            </Button>
          </div>
          <p className="text-gray-600 text-sm">
            Fill in the details below to get the best quotes from top providers.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex justify-between mb-8">
                {[
                  { step: 1, label: 'Personal Details' },
                  { step: 2, label: 'Car Details' },
                  { step: 3, label: 'Current Insurance' },
                  { step: 4, label: 'Review & Submit' },
                ].map(({ step: s, label }) => (
                  <div key={s} className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        s <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {s}
                    </div>
                    <span className={`text-xs mt-1 ${
                      s <= step ? 'text-primary font-medium' : 'text-gray-400'
                    }`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-1 bg-gray-200 rounded-full mb-8">
                <div
                  className="h-1 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Personal Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Full Name"
                        id="fullName"
                        placeholder="Enter your full name"
                        error={errors.fullName?.message}
                        {...register('fullName')}
                      />
                      <FormField
                        label="Date of Birth"
                        id="dateOfBirth"
                        type="date"
                        error={errors.dateOfBirth?.message}
                        {...register('dateOfBirth')}
                      />
                      <FormField
                        label="Nationality"
                        id="nationality"
                        placeholder="e.g., Spanish"
                        error={errors.nationality?.message}
                        {...register('nationality')}
                      />
                      <FormField
                        label="NIE Number"
                        id="nieNumber"
                        placeholder="e.g., X1234567A"
                        error={errors.nieNumber?.message}
                        {...register('nieNumber')}
                      />
                      <FormField
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="e.g., john@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                      <FormField
                        label="Telephone"
                        id="telephone"
                        type="tel"
                        placeholder="+34 123 456 789"
                        error={errors.telephone?.message}
                        {...register('telephone')}
                      />
                      <FormField
                        label="Date of Car License"
                        id="dateOfCarLicense"
                        type="date"
                        error={errors.dateOfCarLicense?.message}
                        {...register('dateOfCarLicense')}
                      />
                      <FormField
                        label="Nationality of Car License"
                        id="nationalityOfCarLicense"
                        placeholder="e.g., Spanish"
                        error={errors.nationalityOfCarLicense?.message}
                        {...register('nationalityOfCarLicense')}
                      />
                      <FormField
                        label="Address"
                        id="address"
                        placeholder="Enter your address"
                        error={errors.address?.message}
                        {...register('address')}
                        className="md:col-span-2"
                      />
                      <FormField
                        label="Postcode"
                        id="postcode"
                        placeholder="e.g., 28001"
                        error={errors.postcode?.message}
                        {...register('postcode')}
                        className="md:col-span-2"
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Car Details
                    </h2>
                    <div className="mb-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useLogbookImage}
                          onChange={(e) => setUseLogbookImage(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-gray-600">
                          I don't know my car details, I'll upload a logbook image
                        </span>
                      </label>
                    </div>

                    {!useLogbookImage ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Car Make"
                          id="carMake"
                          placeholder="e.g., Toyota"
                          error={errors.carMake?.message}
                          {...register('carMake')}
                        />
                        <FormField
                          label="Car Model"
                          id="carModel"
                          placeholder="e.g., Corolla"
                          error={errors.carModel?.message}
                          {...register('carModel')}
                        />
                        <FormField
                          label="Year"
                          id="year"
                          type="number"
                          placeholder="e.g., 2020"
                          error={errors.year?.message}
                          {...register('year', { valueAsNumber: true })}
                        />
                        <FormField
                          label="Registration Number"
                          id="registration"
                          placeholder="e.g., 1234ABC"
                          error={errors.registration?.message}
                          {...register('registration')}
                        />
                        <FormField
                          label="Horsepower (CV)"
                          id="horsepower"
                          type="number"
                          placeholder="e.g., 150"
                          error={errors.horsepower?.message}
                          {...register('horsepower', { valueAsNumber: true })}
                        />
                        <FormField
                          label="Engine Size (cc)"
                          id="engineSize"
                          type="number"
                          placeholder="e.g., 2000"
                          error={errors.engineSize?.message}
                          {...register('engineSize', { valueAsNumber: true })}
                        />
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transmission Type
                          </label>
                          <select
                            id="transmissionType"
                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            {...register('transmissionType')}
                          >
                            <option value="">Select transmission type</option>
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Full Electric">Full Electric</option>
                          </select>
                          {errors.transmissionType && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.transmissionType.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <ImageUpload
                          onImageSelect={(file) => setValue('logbookImage', file)}
                          onImageRemove={() => setValue('logbookImage', undefined)}
                          imagePreview={logbookImage ? URL.createObjectURL(logbookImage) : ''}
                          label="Upload Logbook Image"
                          hint="Upload your car logbook (V5C certificate)"
                        />
                      </div>
                    )}
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Current Insurance
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        label="Current Insurance Company"
                        id="currentCompany"
                        placeholder="e.g., Allianz, Mapfre, AXA"
                        error={errors.currentCompany?.message}
                        {...register('currentCompany')}
                      />
                      <FormField
                        label="Current Premium (€)"
                        id="currentPremium"
                        type="number"
                        placeholder="e.g., 500"
                        error={errors.currentPremium?.message}
                        {...register('currentPremium', { valueAsNumber: true })}
                      />
                      <FormField
                        label="Current Cover"
                        id="currentCover"
                        placeholder="e.g., Third-Party, Comprehensive"
                        error={errors.currentCover?.message}
                        {...register('currentCover')}
                      />
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Review & Submit
                    </h2>
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Details</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{getValues('fullName')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="font-medium">{getValues('dateOfBirth')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Nationality</p>
                            <p className="font-medium">{getValues('nationality')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">NIE Number</p>
                            <p className="font-medium">{getValues('nieNumber')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{getValues('address')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Postcode</p>
                            <p className="font-medium">{getValues('postcode')}</p>
                          </div>
                        </div>

                        {!useLogbookImage ? (
                          <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-900 mb-2">Car Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Car Make</p>
                                <p className="font-medium">{getValues('carMake')}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Car Model</p>
                                <p className="font-medium">{getValues('carModel')}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Year</p>
                                <p className="font-medium">{getValues('year')}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Registration</p>
                                <p className="font-medium">{getValues('registration')}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Horsepower</p>
                                <p className="font-medium">{getValues('horsepower') || 'N/A'} CV</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Engine Size</p>
                                <p className="font-medium">{getValues('engineSize') || 'N/A'} cc</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Transmission</p>
                                <p className="font-medium">{getValues('transmissionType') || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-900 mb-2">Car Details</h4>
                            <p className="text-sm text-gray-500">Logbook Image</p>
                            <p className="font-medium">
                              {logbookImage ? 'Uploaded (will be reviewed)' : 'Not uploaded'}
                            </p>
                          </div>
                        )}

                        <div className="mt-6">
                          <h4 className="text-md font-medium text-gray-900 mb-2">Current Insurance</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Company</p>
                              <p className="font-medium">{getValues('currentCompany')}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Premium</p>
                              <p className="font-medium">{getValues('currentPremium')} €</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Cover</p>
                              <p className="font-medium">{getValues('currentCover')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
  {step > 1 && (
    <Button
      onClick={handlePrevious}
      type="button"
      variant="outline"
      className="w-full sm:w-auto"
    >
      <ChevronLeft className="w-5 h-5 mr-2" />
      Back
    </Button>
  )}
  {step < 4 ? (
    <Button
      onClick={handleNext}
      type="button"
      className="w-full sm:w-auto ml-auto"
    >
      Next
      <ChevronRight className="w-5 h-5 ml-2" />
    </Button>
  ) : (
    <Button
      type="submit"
      disabled={isSubmitting}
      loading={isSubmitting}
      className="w-full sm:w-auto ml-auto bg-primary hover:bg-primary/90"
    >
      {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
    </Button>
  )}
</div>
               
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
