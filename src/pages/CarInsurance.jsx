import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import FormField from '../components/forms/FormField';
import { useNavigate } from 'react-router-dom';

// Zod schema (unchanged)
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
  horsepower: z.number().min(1, 'Horsepower must be positive'),
  engineSize: z.number().min(1, 'Engine size must be positive'),
  transmissionType: z.enum(['Manual', 'Automatic', 'Hybrid', 'Full Electric'], {
    errorMap: () => ({ message: 'Transmission type is required' }),
  }),
  currentCompany: z.string().min(1, 'Current company is required'),
  currentPremium: z.number().min(0, 'Premium must be positive'),
  currentCover: z.string().min(1, 'Current cover is required'),
});

export default function CarInsurance() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfCarLicense, setDateOfCarLicense] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  // Auto-format date as DD/MM/YYYY (unchanged)
  const formatDate = useCallback((value, setState, fieldName) => {
    let cleanedValue = value.replace(/\D/g, '');
    cleanedValue = cleanedValue.slice(0, 8);
    let formattedValue = '';
    if (cleanedValue.length > 0) formattedValue = cleanedValue.slice(0, 2);
    if (cleanedValue.length > 2) formattedValue += '/' + cleanedValue.slice(2, 4);
    if (cleanedValue.length > 4) formattedValue += '/' + cleanedValue.slice(4, 8);
    setState(formattedValue);
    setValue(fieldName, formattedValue, { shouldValidate: true });
    return formattedValue;
  }, [setValue]);

  const handleDateOfBirthChange = (e) => {
    formatDate(e.target.value, setDateOfBirth, 'dateOfBirth');
  };

  const handleDateOfCarLicenseChange = (e) => {
    formatDate(e.target.value, setDateOfCarLicense, 'dateOfCarLicense');
  };

  const validateDateFormat = (value, setState, fieldName, errorMessage) => {
    if (value.length === 10 && !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      toast.error(errorMessage);
      setState('');
      setValue(fieldName, '', { shouldValidate: true });
    }
  };

  const handleDateOfBirthBlur = () => {
    validateDateFormat(dateOfBirth, setDateOfBirth, 'dateOfBirth', 'Date of birth must be in DD/MM/YYYY format');
  };

  const handleDateOfCarLicenseBlur = () => {
    validateDateFormat(dateOfCarLicense, setDateOfCarLicense, 'dateOfCarLicense', 'Date of car license must be in DD/MM/YYYY format');
  };

  const handleKeyDown = useCallback((e) => {
    if (step === 4 && e.key === 'Enter') e.preventDefault();
  }, [step]);

  const handleNext = async (e) => {
    if (e) e.preventDefault();
    const fieldsToValidate = {
      1: ['fullName', 'dateOfBirth', 'nationality', 'nieNumber', 'dateOfCarLicense', 'nationalityOfCarLicense', 'address', 'postcode', 'email', 'telephone'],
      2: ['carMake', 'carModel', 'year', 'registration', 'horsepower', 'engineSize', 'transmissionType'],
      3: ['currentCompany', 'currentPremium', 'currentCover'],
    }[step];
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (isValid) setStep(step + 1);
    else toast.error('Please fill in all required fields correctly.');
  };

  const handlePrevious = () => setStep(step - 1);

  const onSubmit = async (data) => {
    const response = await fetch('https://formspree.io/f/xjgzokzw', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      setSubmitSuccess(true);
    } else {
      toast.error('Failed to submit quote.');
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setDateOfBirth('');
    setDateOfCarLicense('');
    setSubmitSuccess(false);
    // Reset form fields (optional)
    Object.keys(getValues()).forEach(key => setValue(key, ''));
  };

  const steps = [
    { number: 1, label: 'Personal Details' },
    { number: 2, label: 'Car Details' },
    { number: 3, label: 'Current Insurance' },
    { number: 4, label: 'Review & Submit' },
  ];

  // Success page (new, matching Home Insurance)
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quote Request Submitted!
              </h2>
              <p className="text-gray-600 mb-8">
                Thank you for your request. Our team will review your information
                and get back to you with the best car insurance quotes within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="large" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
                <Button variant="outline" size="large" onClick={handleStartOver}>
                  Start New Quote
                </Button>
              </div>
            </motion.div>
          </Card>
        </div>
      </div>
    );
  }

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header section (updated to match Home Insurance) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-green-600 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Car Insurance Quote
                </h1>
                <p className="text-gray-600 mt-1">
                  Compare and save on your car insurance
                </p>
              </div>
            </div>
          </motion.div>

          {/* Progress steps (updated to match Home Insurance) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <React.Fragment key={s.number}>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        step > s.number
                          ? 'bg-green-600 text-white'
                          : step === s.number
                          ? 'bg-green-600 text-white ring-4 ring-green-100'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                    </div>
                    <div className="ml-3">
                      <div
                        className={`text-sm font-medium transition-colors duration-300 ${
                          step >= s.number ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {s.label}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                        step > s.number ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                      style={{ minWidth: '40px' }}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* Main form content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8">
              <form
                id="car-insurance-form"
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={handleKeyDown}
                className="space-y-6"
              >
                {/* Step 1: Personal Details (updated animations and layout) */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Personal Details
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Please provide your personal details for accurate quotes
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Full Name"
                        id="fullName"
                        placeholder="Enter your full name"
                        error={errors.fullName?.message}
                        {...register('fullName')}
                      />
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
                          onBlur={handleDateOfBirthBlur}
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
                          onBlur={handleDateOfCarLicenseBlur}
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
                  </motion.div>
                )}

                {/* Step 2: Car Details (updated animations and layout) */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Car Details
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Tell us about your car for accurate quotes
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </motion.div>
                )}

                {/* Step 3: Current Insurance (updated animations and layout) */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Current Insurance
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Information about your current coverage helps us find better deals
                    </p>
                    <div className="grid grid-cols-1 gap-6">
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
                  </motion.div>
                )}

                {/* Step 4: Review & Submit (updated to match Home Insurance) */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Review & Submit
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Please review your information before submitting
                    </p>

                    <div className="space-y-6">
                      {/* Personal Details Review */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Full Name</div>
                            <div className="font-medium">{getValues('fullName')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Date of Birth</div>
                            <div className="font-medium">{getValues('dateOfBirth')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Nationality</div>
                            <div className="font-medium">{getValues('nationality')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">NIE Number</div>
                            <div className="font-medium">{getValues('nieNumber')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Address</div>
                            <div className="font-medium">{getValues('address')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Postcode</div>
                            <div className="font-medium">{getValues('postcode')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Email</div>
                            <div className="font-medium">{getValues('email')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Telephone</div>
                            <div className="font-medium">{getValues('telephone')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Date of Car License</div>
                            <div className="font-medium">{getValues('dateOfCarLicense')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Nationality of Car License</div>
                            <div className="font-medium">{getValues('nationalityOfCarLicense')}</div>
                          </div>
                        </div>
                      </div>

                      {/* Car Details Review */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Car Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Car Make</div>
                            <div className="font-medium">{getValues('carMake')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Car Model</div>
                            <div className="font-medium">{getValues('carModel')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Year</div>
                            <div className="font-medium">{getValues('year')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Registration</div>
                            <div className="font-medium">{getValues('registration')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Horsepower</div>
                            <div className="font-medium">{getValues('horsepower')} CV</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Engine Size</div>
                            <div className="font-medium">{getValues('engineSize')} cc</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Transmission</div>
                            <div className="font-medium">{getValues('transmissionType')}</div>
                          </div>
                        </div>
                      </div>

                      {/* Current Insurance Review */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Insurance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Company</div>
                            <div className="font-medium">{getValues('currentCompany')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Premium</div>
                            <div className="font-medium">€{getValues('currentPremium')}</div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-gray-500">Cover</div>
                            <div className="font-medium">{getValues('currentCover')}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-3" />
                        <span className="text-green-700">
                          Your information is secure and will only be used to provide you with insurance quotes.
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </form>

              {/* Navigation buttons (updated to match Home Insurance) */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                {step > 1 && (
                  <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    leftIcon={<ChevronLeft className="w-5 h-5" />}
                  >
                    Back
                  </Button>
                )}
                {step < 4 ? (
                  <Button
                    onClick={handleNext}
                    loading={isSubmitting}
                    rightIcon={<ChevronRight className="w-5 h-5" />}
                  >
                    {step === 3 ? 'Review' : 'Next'}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    form="car-insurance-form"
                    loading={isSubmitting}
                    rightIcon={<ChevronRight className="w-5 h-5" />}
                  >
                    Submit Quote Request
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
