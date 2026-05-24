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
import React from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
    validateDateFormat(
      dateOfBirth,
      setDateOfBirth,
      'dateOfBirth',
      t('form.errors.dateFormat')
    );
  };

  const handleDateOfCarLicenseBlur = () => {
    validateDateFormat(
      dateOfCarLicense,
      setDateOfCarLicense,
      'dateOfCarLicense',
      t('form.errors.dateFormat')
    );
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
    else toast.error(t('form.errors.fillAllFields'));
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
      toast.error(t('form.errors.submitFailed'));
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setDateOfBirth('');
    setDateOfCarLicense('');
    setSubmitSuccess(false);
    Object.keys(getValues()).forEach(key => setValue(key, ''));
  };

  const steps = [
    { number: 1, label: t('form.steps.personalDetails') },
    { number: 2, label: t('form.steps.carDetails') },
    { number: 3, label: t('form.steps.currentInsurance') },
    { number: 4, label: t('form.steps.reviewSubmit') },
  ];

  // Success page
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
                {t('success.title')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('success.message')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="large" onClick={() => navigate('/')}>
                  {t('success.backToHome')}
                </Button>
                <Button variant="outline" size="large" onClick={handleStartOver}>
                  {t('success.startNewQuote')}
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
          {/* Header */}
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
              {t('form.backToHome')}
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('form.title')}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t('form.subtitle')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Progress steps */}
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
                {/* Step 1: Personal Details */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {t('form.personalDetails.title')}
                    </h2>
                    <p className="text-gray-600 mb-8">
                      {t('form.personalDetails.subtitle')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label={t('form.personalDetails.fullName')}
                        id="fullName"
                        placeholder={t('form.personalDetails.fullNamePlaceholder')}
                        error={errors.fullName?.message}
                        {...register('fullName')}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('form.personalDetails.dateOfBirth')}
                        </label>
                        <input
                          id="dateOfBirth"
                          type="text"
                          inputMode="numeric"
                          placeholder={t('form.datePlaceholder')}
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
                        label={t('form.personalDetails.nationality')}
                        id="nationality"
                        placeholder={t('form.personalDetails.nationalityPlaceholder')}
                        error={errors.nationality?.message}
                        {...register('nationality')}
                      />
                      <FormField
                        label={t('form.personalDetails.nieNumber')}
                        id="nieNumber"
                        placeholder={t('form.personalDetails.nieNumberPlaceholder')}
                        error={errors.nieNumber?.message}
                        {...register('nieNumber')}
                      />
                      <FormField
                        label={t('form.personalDetails.email')}
                        id="email"
                        type="email"
                        placeholder={t('form.personalDetails.emailPlaceholder')}
                        error={errors.email?.message}
                        {...register('email')}
                      />
                      <FormField
                        label={t('form.personalDetails.telephone')}
                        id="telephone"
                        type="tel"
                        placeholder={t('form.personalDetails.telephonePlaceholder')}
                        error={errors.telephone?.message}
                        {...register('telephone')}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('form.personalDetails.dateOfCarLicense')}
                        </label>
                        <input
                          id="dateOfCarLicense"
                          type="text"
                          inputMode="numeric"
                          placeholder={t('form.datePlaceholder')}
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
                        label={t('form.personalDetails.nationalityOfCarLicense')}
                        id="nationalityOfCarLicense"
                        placeholder={t('form.personalDetails.nationalityOfCarLicensePlaceholder')}
                        error={errors.nationalityOfCarLicense?.message}
                        {...register('nationalityOfCarLicense')}
                      />
                      <FormField
                        label={t('form.personalDetails.address')}
                        id="address"
                        placeholder={t('form.personalDetails.addressPlaceholder')}
                        error={errors.address?.message}
                        {...register('address')}
                        className="md:col-span-2"
                      />
                      <FormField
                        label={t('form.personalDetails.postcode')}
                        id="postcode"
                        placeholder={t('form.personalDetails.postcodePlaceholder')}
                        error={errors.postcode?.message}
                        {...register('postcode')}
                        className="md:col-span-2"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Car Details */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {t('form.carDetails.title')}
                    </h2>
                    <p className="text-gray-600 mb-8">
                      {t('form.carDetails.subtitle')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label={t('form.carDetails.carMake')}
                        id="carMake"
                        placeholder={t('form.carDetails.carMakePlaceholder')}
                        error={errors.carMake?.message}
                        {...register('carMake')}
                      />
                      <FormField
                        label={t('form.carDetails.carModel')}
                        id="carModel"
                        placeholder={t('form.carDetails.carModelPlaceholder')}
                        error={errors.carModel?.message}
                        {...register('carModel')}
                      />
                      <FormField
                        label={t('form.carDetails.year')}
                        id="year"
                        type="number"
                        placeholder={t('form.carDetails.yearPlaceholder')}
                        error={errors.year?.message}
                        {...register('year', { valueAsNumber: true })}
                      />
                      <FormField
                        label={t('form.carDetails.registration')}
                        id="registration"
                        placeholder={t('form.carDetails.registrationPlaceholder')}
                        error={errors.registration?.message}
                        {...register('registration')}
                      />
                      <FormField
                        label={t('form.carDetails.horsepower')}
                        id="horsepower"
                        type="number"
                        placeholder={t('form.carDetails.horsepowerPlaceholder')}
                        error={errors.horsepower?.message}
                        {...register('horsepower', { valueAsNumber: true })}
                      />
                      <FormField
                        label={t('form.carDetails.engineSize')}
                        id="engineSize"
                        type="number"
                        placeholder={t('form.carDetails.engineSizePlaceholder')}
                        error={errors.engineSize?.message}
                        {...register('engineSize', { valueAsNumber: true })}
                      />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('form.carDetails.transmissionType')}
                        </label>
                        <select
                          id="transmissionType"
                          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          {...register('transmissionType')}
                        >
                          <option value="">{t('form.carDetails.selectTransmission')}</option>
                          <option value="Manual">{t('form.carDetails.manual')}</option>
                          <option value="Automatic">{t('form.carDetails.automatic')}</option>
                          <option value="Hybrid">{t('form.carDetails.hybrid')}</option>
                          <option value="Full Electric">{t('form.carDetails.fullElectric')}</option>
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

                {/* Step 3: Current Insurance */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {t('form.currentInsurance.title')}
                    </h2>
                    <p className="text-gray-600 mb-8">
                      {t('form.currentInsurance.subtitle')}
                    </p>
                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        label={t('form.currentInsurance.currentCompany')}
                        id="currentCompany"
                        placeholder={t('form.currentInsurance.currentCompanyPlaceholder')}
                        error={errors.currentCompany?.message}
                        {...register('currentCompany')}
                      />
                      <FormField
                        label={t('form.currentInsurance.currentPremium')}
                        id="currentPremium"
                        type="number"
                        placeholder={t('form.currentInsurance.currentPremiumPlaceholder')}
                        error={errors.currentPremium?.message}
                        {...register('currentPremium', { valueAsNumber: true })}
                      />
                      <FormField
                        label={t('form.currentInsurance.currentCover')}
                        id="currentCover"
                        placeholder={t('form.currentInsurance.currentCoverPlaceholder')}
                        error={errors.currentCover?.message}
                        {...register('currentCover')}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review & Submit */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {t('form.reviewSubmit.title')}
                    </h2>
                    <p className="text-gray-600 mb-8">
                      {t('form.reviewSubmit.subtitle')}
                    </p>

                    <div className="space-y-6">
                      {/* Personal Details Review */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {t('form.reviewSubmit.personalDetails')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">{t('form.personalDetails.fullName')}</div>
                            <div className="font-medium">{getValues('fullName')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.personalDetails.dateOfBirth')}</div>
                            <div className="font-medium">{getValues('dateOfBirth')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.personalDetails.nationality')}</div>
                            <div className="font-medium">{getValues('nationality')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.personalDetails.nieNumber')}</div>
                            <div className="font-medium">{getValues('nieNumber')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.personalDetails.address')}</div>
                            <div className="font-medium">{getValues('address')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.personalDetails.postcode')}</div>
                            <div className="font-medium">{getValues('postcode')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.personalDetails.email')}</div>
                            <div className="font-medium">{getValues('email')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.personalDetails.telephone')}</div>
                            <div className="font-medium">{getValues('telephone')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.personalDetails.dateOfCarLicense')}</div>
                            <div className="font-medium">{getValues('dateOfCarLicense')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.personalDetails.nationalityOfCarLicense')}</div>
                            <div className="font-medium">{getValues('nationalityOfCarLicense')}</div>
                          </div>
                        </div>
                      </div>

                      {/* Car Details Review */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {t('form.reviewSubmit.carDetails')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">{t('form.carDetails.carMake')}</div>
                            <div className="font-medium">{getValues('carMake')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.carDetails.carModel')}</div>
                            <div className="font-medium">{getValues('carModel')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.carDetails.year')}</div>
                            <div className="font-medium">{getValues('year')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.carDetails.registration')}</div>
                            <div className="font-medium">{getValues('registration')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.carDetails.horsepower')}</div>
                            <div className="font-medium">{getValues('horsepower')} CV</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.carDetails.engineSize')}</div>
                            <div className="font-medium">{getValues('engineSize')} cc</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.carDetails.transmissionType')}</div>
                            <div className="font-medium">{getValues('transmissionType')}</div>
                          </div>
                        </div>
                      </div>

                      {/* Current Insurance Review */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {t('form.reviewSubmit.currentInsurance')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">{t('form.currentInsurance.currentCompany')}</div>
                            <div className="font-medium">{getValues('currentCompany')}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">{t('form.currentInsurance.currentPremium')}</div>
                            <div className="font-medium">€{getValues('currentPremium')}</div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-gray-500">{t('form.currentInsurance.currentCover')}</div>
                            <div className="font-medium">{getValues('currentCover')}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-3" />
                        <span className="text-green-700">
                          {t('form.reviewSubmit.privacyNotice')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </form>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                {step > 1 && (
                  <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    leftIcon={<ChevronLeft className="w-5 h-5" />}
                  >
                    {t('form.navigation.back')}
                  </Button>
                )}
                {step < 4 ? (
                  <Button
                    onClick={handleNext}
                    loading={isSubmitting}
                    rightIcon={<ChevronRight className="w-5 h-5" />}
                  >
                    {step === 3 ? t('form.navigation.review') : t('form.navigation.next')}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    form="car-insurance-form"
                    loading={isSubmitting}
                    rightIcon={<ChevronRight className="w-5 h-5" />}
                  >
                    {t('form.navigation.submit')}
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
