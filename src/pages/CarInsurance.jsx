import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Car, User, Mail, Phone, Calendar, MapPin, Shield, ArrowLeft,
  Check, ChevronLeft, ChevronRight
} from 'lucide-react';
import  Button  from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import FormField from '../components/forms/FormField';
import ImageUpload from '../components/forms/ImageUpload';
import {
  brandOptions,
  transmissionOptions,
  fuelTypeOptions,
  coverageTypeOptions,
  insuranceProviders,
  nationalityOptions,
  getYearOptions,
  NIE_REGEX,
  PHONE_REGEX,
  REGISTRATION_REGEX,
  EMAIL_REGEX
} from '../data/constants';

const CarInsurance = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', nationality: '', licenseDate: '', licenseNationality: '',
    dateOfBirth: '', nieNumber: '', address: '', email: '', phone: '',
    registrationNumber: '', brand: '', model: '', year: '', engineSize: '',
    horsepower: '', transmission: '', fuelType: '', logbookImage: null,
    logbookPreview: '', currentProvider: '', coverageType: '', currentPremium: '',
  });

  const [errors, setErrors] = useState({});
  const [availableModels, setAvailableModels] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    setYearOptions(getYearOptions());
  }, []);

  useEffect(() => {
    if (formData.brand) {
      setAvailableModels(brandOptions[formData.brand] || []);
      setFormData(prev => ({ ...prev, model: '' }));
    } else {
      setAvailableModels([]);
    }
  }, [formData.brand]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleImageSelect = useCallback((file, preview) => {
    setFormData(prev => ({ ...prev, logbookImage: file, logbookPreview: preview }));
  }, []);

  const handleImageRemove = useCallback(() => {
    setFormData(prev => ({ ...prev, logbookImage: null, logbookPreview: '' }));
  }, []);

  const validatePersonalInfo = useCallback(() => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.licenseDate) newErrors.licenseDate = 'License date is required';
    if (!formData.licenseNationality) newErrors.licenseNationality = 'License nationality is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.nieNumber.trim()) {
      newErrors.nieNumber = 'NIE number is required';
    } else if (!NIE_REGEX.test(formData.nieNumber)) {
      newErrors.nieNumber = 'Please enter a valid NIE number (e.g., X1234567A)';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.phone && !PHONE_REGEX.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Spanish phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateVehicleDetails = useCallback(() => {
    const newErrors = {};
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    } else if (!REGISTRATION_REGEX.test(formData.registrationNumber)) {
      newErrors.registrationNumber = 'Please enter a valid registration number (e.g., 1234ABC)';
    }
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateCurrentInsurance = useCallback(() => {
    const newErrors = {};
    if (!formData.currentProvider) newErrors.currentProvider = 'Current provider is required';
    if (!formData.coverageType) newErrors.coverageType = 'Coverage type is required';
    if (!formData.currentPremium) {
      newErrors.currentPremium = 'Current premium is required';
    } else if (isNaN(formData.currentPremium)) {
      newErrors.currentPremium = 'Premium must be a number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNext = useCallback(() => {
    switch (step) {
      case 1:
        if (validatePersonalInfo()) setStep(2);
        break;
      case 2:
        if (validateVehicleDetails()) setStep(3);
        break;
      case 3:
        if (validateCurrentInsurance()) setStep(4);
        break;
      default:
        break;
    }
  }, [step, validatePersonalInfo, validateVehicleDetails, validateCurrentInsurance]);

  const handlePrevious = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const handleStartOver = useCallback(() => {
    setFormData({
      fullName: '', nationality: '', licenseDate: '', licenseNationality: '',
      dateOfBirth: '', nieNumber: '', address: '', email: '', phone: '',
      registrationNumber: '', brand: '', model: '', year: '', engineSize: '',
      horsepower: '', transmission: '', fuelType: '', logbookImage: null,
      logbookPreview: '', currentProvider: '', coverageType: '', currentPremium: '',
    });
    setErrors({});
    setStep(1);
    setSubmitSuccess(false);
  }, []);

  const steps = [
    { number: 1, label: 'Personal Info' },
    { number: 2, label: 'Vehicle Details' },
    { number: 3, label: 'Current Insurance' },
    { number: 4, label: 'Review & Submit' },
  ];

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
                and get back to you with the best insurance quotes within 24 hours.
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
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
                Compare and save up to 40% on your car insurance
              </p>
            </div>
          </div>
        </motion.div>

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
                        ? 'bg-blue-600 text-white'
                        : step === s.number
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                  </div>
                  <div className="ml-3">
                    <div
                      className={`text-sm font-medium transition-colors duration-300 ${
                        step >= s.number ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                      step > s.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    style={{ minWidth: '40px' }}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-8">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Personal Information
                </h2>
                <p className="text-gray-600 mb-8">
                  Please provide your personal details for accurate quotes
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    type="text"
                    name="fullName"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    error={errors.fullName}
                    icon={<User className="w-5 h-5 text-gray-400" />}
                  />
                  <FormField
                    type="select"
                    name="nationality"
                    label="Nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    options={nationalityOptions}
                    placeholder="Select nationality"
                    required
                    error={errors.nationality}
                    icon={<MapPin className="w-5 h-5 text-gray-400" />}
                  />
                  <FormField
                    type="date"
                    name="licenseDate"
                    label="Driver License Date"
                    value={formData.licenseDate}
                    onChange={handleChange}
                    required
                    error={errors.licenseDate}
                    icon={<Calendar className="w-5 h-5 text-gray-400" />}
                  />
                  <FormField
                    type="select"
                    name="licenseNationality"
                    label="License Nationality"
                    value={formData.licenseNationality}
                    onChange={handleChange}
                    options={nationalityOptions}
                    placeholder="Select nationality"
                    required
                    error={errors.licenseNationality}
                    icon={<Shield className="w-5 h-5 text-gray-400" />}
                  />
                  <FormField
                    type="date"
                    name="dateOfBirth"
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    error={errors.dateOfBirth}
                    icon={<Calendar className="w-5 h-5 text-gray-400" />}
                  />
                  <FormField
                    type="text"
                    name="nieNumber"
                    label="NIE Number"
                    value={formData.nieNumber}
                    onChange={handleChange}
                    placeholder="X1234567A"
                    required
                    error={errors.nieNumber}
                    hint="Spanish NIE format"
                  />
                  <FormField
                    type="text"
                    name="address"
                    label="Address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Calle Gran Vía, 123, Madrid"
                    required
                    error={errors.address}
                    className="md:col-span-2"
                    icon={<MapPin className="w-5 h-5 text-gray-400" />}
                  />
                  <FormField
                    type="email"
                    name="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    error={errors.email}
                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                  />
                  <FormField
                    type="tel"
                    name="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+34 600 000 000"
                    error={errors.phone}
                    hint="Spanish phone number"
                    icon={<Phone className="w-5 h-5 text-gray-400" />}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Vehicle Details
                </h2>
                <p className="text-gray-600 mb-8">
                  Tell us about your vehicle for accurate quotes
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    type="text"
                    name="registrationNumber"
                    label="Registration Number"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="1234ABC"
                    required
                    error={errors.registrationNumber}
                    hint="New Spanish format"
                    icon={<Car className="w-5 h-5 text-gray-400" />}
                  />
                  <FormField
                    type="select"
                    name="brand"
                    label="Brand"
                    value={formData.brand}
                    onChange={handleChange}
                    options={Object.keys(brandOptions).map(brand => ({ value: brand, label: brand }))}
                    placeholder="Select brand"
                    required
                    error={errors.brand}
                  />
                  <FormField
                    type="select"
                    name="model"
                    label="Model"
                    value={formData.model}
                    onChange={handleChange}
                    options={availableModels.map(model => ({ value: model, label: model }))}
                    placeholder="Select model"
                    required
                    error={errors.model}
                    disabled={!formData.brand}
                  />
                  <FormField
                    type="select"
                    name="year"
                    label="Year"
                    value={formData.year}
                    onChange={handleChange}
                    options={yearOptions.map(year => ({ value: year, label: year }))}
                    placeholder="Select year"
                    required
                    error={errors.year}
                  />
                  <FormField
                    type="number"
                    name="engineSize"
                    label="Engine Size (cc)"
                    value={formData.engineSize}
                    onChange={handleChange}
                    placeholder="1600"
                    error={errors.engineSize}
                  />
                  <FormField
                    type="number"
                    name="horsepower"
                    label="Horsepower (HP)"
                    value={formData.horsepower}
                    onChange={handleChange}
                    placeholder="120"
                    error={errors.horsepower}
                  />
                  <FormField
                    type="select"
                    name="transmission"
                    label="Transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    options={transmissionOptions}
                    placeholder="Select transmission"
                  />
                  <FormField
                    type="select"
                    name="fuelType"
                    label="Fuel Type"
                    value={formData.fuelType}
                    onChange={handleChange}
                    options={fuelTypeOptions}
                    placeholder="Select fuel type"
                  />
                  <div className="md:col-span-2">
                    <ImageUpload
                      label="Upload Vehicle Registration"
                      onImageSelect={handleImageSelect}
                      onImageRemove={handleImageRemove}
                      imagePreview={formData.logbookPreview}
                      hint="Upload a photo of your vehicle registration document"
                    />
                  </div>
                </div>
              </motion.div>
            )}

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
                  Provide details about your current insurance policy
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    type="select"
                    name="currentProvider"
                    label="Current Insurance Provider"
                    value={formData.currentProvider}
                    onChange={handleChange}
                    options={insuranceProviders}
                    placeholder="Select provider"
                    required
                    error={errors.currentProvider}
                  />
                  <FormField
                    type="select"
                    name="coverageType"
                    label="Coverage Type"
                    value={formData.coverageType}
                    onChange={handleChange}
                    options={coverageTypeOptions}
                    placeholder="Select coverage"
                    required
                    error={errors.coverageType}
                  />
                  <FormField
                    type="text"
                    name="currentPremium"
                    label="Current Premium (€)"
                    value={formData.currentPremium}
                    onChange={handleChange}
                    placeholder="500"
                    required
                    error={errors.currentPremium}
                  />
                </div>
              </motion.div>
            )}

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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{formData.fullName}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{formData.phone || 'Not provided'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{formData.address}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Registration Number</p>
                        <p className="font-medium">{formData.registrationNumber}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Brand & Model</p>
                        <p className="font-medium">{formData.brand} {formData.model}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Year</p>
                        <p className="font-medium">{formData.year}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Fuel Type</p>
                        <p className="font-medium">{formData.fuelType}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Insurance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Provider</p>
                        <p className="font-medium">{formData.currentProvider}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Coverage Type</p>
                        <p className="font-medium">{formData.coverageType}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Current Premium</p>
                        <p className="font-medium">{formData.currentPremium} €</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
                  <Button variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
              {step > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>
              )}
              {step < 4 ? (
                <Button onClick={handleNext} className="ml-auto">
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              ) : null}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CarInsurance;
