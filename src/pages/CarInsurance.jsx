import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import FormField from '../components/forms/FormField';
import { useNavigate } from 'react-router-dom';

// Zod schema for form validation
const schema = z.object({
  // Personal Details
  fullName: z.string().min(1, 'Full name is required'),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in DD/MM/YYYY format'),
  nationality: z.string().min(1, 'Nationality is required'),
  nieNumber: z.string().min(1, 'NIE number is required'),
  dateOfCarLicense: z.string()
    .min(1, 'Date of car license is required')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in DD/MM/YYYY format'),
  nationalityOfCarLicense: z.string().min(1, 'Nationality of car license is required'),
  address: z.string().min(1, 'Address is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  telephone: z.string().min(1, 'Telephone is required'),

  // Car Details
  carMake: z.string().min(1, 'Car make is required'),
  carModel: z.string().min(1, 'Car model is required'),
  year: z.number().min(1990, 'Year must be after 1990'),
  registration: z.string().min(1, 'Registration number is required'),
  horsepower: z.number().min(1, 'Horsepower must be positive'),
  engineSize: z.number().min(1, 'Engine size must be positive'),
  transmissionType: z.enum(['Manual', 'Automatic', 'Hybrid', 'Full Electric'], {
    errorMap: () => ({ message: 'Transmission type is required' }),
  }),

  // Current Insurance
  currentCompany: z.string().min(1, 'Current company is required'),
  currentPremium: z.number().min(0, 'Premium must be positive'),
  currentCover: z.string().min(1, 'Current cover is required'),
});

export default function CarInsurance() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfCarLicense, setDateOfCarLicense] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Auto-format date as DD/MM/YYYY
  const formatDate = useCallback((value) => {
    // Remove all non-digit characters
    let cleanedValue = value.replace(/\D/g, '');

    // Limit to 8 digits (DDMMYYYY)
    cleanedValue = cleanedValue.slice(0, 8);

    // Add slashes automatically
    let formattedValue = '';
    if (cleanedValue.length > 0) {
      formattedValue = cleanedValue.slice(0, 2);
    }
    if (cleanedValue.length > 2) {
      formattedValue += '/' + cleanedValue.slice(2, 4);
    }
    if (cleanedValue.length > 4) {
      formattedValue += '/' + cleanedValue.slice(4, 8);
    }

    return formattedValue;
  }, []);

  // Handle changes for Date of Birth
  const handleDateOfBirthChange = (e) => {
    const formattedValue = formatDate(e.target.value);
    setDateOfBirth(formattedValue);
    setValue('dateOfBirth', formattedValue, { shouldValidate: true });
  };

  // Handle changes for Date of Car License
  const handleDateOfCarLicenseChange = (e) => {
    const formattedValue = formatDate(e.target.value);
    setDateOfCarLicense(formattedValue);
    setValue('dateOfCarLicense', formattedValue, { shouldValidate: true });
  };

  // Prevent Enter key from submitting the form in step 4
  const handleKeyDown = useCallback((e) => {
    if (step === 4 && e.key === 'Enter') {
      e.preventDefault();
    }
  }, [step]);

  const handleNext = async (e) => {
    if (e) e.preventDefault();

    const fieldsToValidate = {
      1: ['fullName', 'dateOfBirth', 'nationality', 'nieNumber', 'dateOfCarLicense', 'nationalityOfCarLicense', 'address', 'postcode', 'email', 'telephone'],
      2: ['carMake', 'carModel', 'year', 'registration', 'horsepower', 'engineSize', 'transmissionType'],
      3: ['currentCompany', 'currentPremium', 'currentCover'],
    }[step];

    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (isValid) {
      setStep(step + 1);
    } else {
      toast.error('Please fill in all required fields correctly.');
    }
  };

  const handlePrevious = () => setStep(step - 1);

  const onSubmit = async (data) => {
    const response = await fetch('https://formspree.io/f/xjgzokzw', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      toast.success('Quote submitted successfully!');

      // Show a toast with options to compare home insurance
      toast(
        <div className="flex flex-col items-center gap-4">
          <p className="text-center font-medium">
            Would you like to compare home insurance and save up to 35%?
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                toast.dismiss();
                navigate('/home-insurance');
              }}
              className="bg-primary hover:bg-primary/90 text-sm px-4 py-2"
            >
              Yes, Compare Home Insurance
            </Button>
            <Button
              onClick={() => {
                toast.dismiss();
                navigate('/');
              }}
              variant="outline"
              className="text-sm px-4 py-2"
            >
              No, Go Home
            </Button>
          </div>
        </div>,
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: false,
        }
      );
    } else {
      toast.error('Failed to submit quote.');
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
                {/* Progress Steps */}
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
                      <span
                        className={`text-xs mt-1 ${
                          s <= step ? 'text-primary font-medium' : 'text-gray-400'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-200 rounded-full mb-8">
                  <div
                    className="h-1 bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(step / 4) * 100}%` }}
                  ></div>
                </div>

                {/* Form Steps */}
                <form
                  id="car-insurance-form"
                  onSubmit={handleSubmit(onSubmit)}
                  onKeyDown={handleKeyDown}
                  className="space-y-6"
                >
                  {/* Step 1: Personal Details */}
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
                        {/* Date of Birth Field with Auto-Formatting */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <input
                            id="dateOfBirth"
                            type="text"
                            inputMode="numeric"
                            placeholder="DD/MM/YYYY"
                            value={dateOfBirth}
                            onChange={handleDateOfBirthChange}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.dateOfBirth && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.dateOfBirth.message}
                            </p>
                          )}
                        </div>
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
                        {/* Date of Car License Field with Auto-Formatting */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Car License
                          </label>
                          <input
                            id="dateOfCarLicense"
                            type="text"
                            inputMode="numeric"
                            placeholder="DD/MM/YYYY"
                            value={dateOfCarLicense}
                            onChange={handleDateOfCarLicenseChange}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                              errors.dateOfCarLicense ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.dateOfCarLicense && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.dateOfCarLicense.message}
                            </p>
                          )}
                        </div>
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

                  {/* Step 2: Car Details */}
                  {step === 2 && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Car Details
                      </h2>
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
                    </>
                  )}

                  {/* Step 3: Current Insurance */}
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

                  {/* Step 4: Review & Submit */}
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
                                <p className="font-medium">{getValues('horsepower')} CV</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Engine Size</p>
                                <p className="font-medium">{getValues('engineSize')} cc</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Transmission</p>
                                <p className="font-medium">{getValues('transmissionType')}</p>
                              </div>
                            </div>
                          </div>

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
                </form>

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
                      form="car-insurance-form"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      className="w-full sm:w-auto ml-auto bg-primary hover:bg-primary/90"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
