import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Home, User, Mail, Phone, Calendar, MapPin, Shield, ArrowLeft,
  Check, ChevronLeft, ChevronRight, Building, Bed, Bath, Ruler
} from 'lucide-react';
import  Button  from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import FormField from '../components/forms/FormField';
import ImageUpload from '../components/forms/ImageUpload';
import {
  propertyTypeOptions,
  securityFeatures,
  insuranceProviders,
  coverageTypeOptions,
  nationalityOptions,
  getYearOptions,
  NIE_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX
} from '../data/constants';

const HomeInsurance = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', nationality: '', dateOfBirth: '', nieNumber: '', address: '',
    email: '', phone: '', propertyType: '', propertySize: '', bedrooms: '',
    bathrooms: '', constructionYear: '', securityFeatures: [], propertyImages: [],
    propertyImagePreviews: [], currentProvider: '', coverageType: '', currentPremium: '',
    isPrimaryResidence: true, hasMortgage: false, specialItems: '',
  });

  const [errors, setErrors] = useState({});
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    setYearOptions(getYearOptions());
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleSecurityFeatureChange = useCallback((feature) => {
    setFormData(prev => {
      const currentFeatures = prev.securityFeatures || [];
      const newFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter(f => f !== feature)
        : [...currentFeatures, feature];
      return { ...prev, securityFeatures: newFeatures };
    });
  }, []);

  const handleImageSelect = useCallback((file, preview) => {
    setFormData(prev => ({
      ...prev,
      propertyImages: [...prev.propertyImages, file],
      propertyImagePreviews: [...prev.propertyImagePreviews, preview]
    }));
  }, []);

  const handleImageRemove = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      propertyImages: prev.propertyImages.filter((_, i) => i !== index),
      propertyImagePreviews: prev.propertyImagePreviews.filter((_, i) => i !== index)
    }));
  }, []);

  const validatePersonalInfo = useCallback(() => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
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

  const validatePropertyDetails = useCallback(() => {
    const newErrors = {};
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.propertySize) {
      newErrors.propertySize = 'Property size is required';
    } else if (isNaN(formData.propertySize) || parseInt(formData.propertySize) <= 0) {
      newErrors.propertySize = 'Please enter a valid property size';
    }
    if (!formData.bedrooms) {
      newErrors.bedrooms = 'Number of bedrooms is required';
    } else if (isNaN(formData.bedrooms) || parseInt(formData.bedrooms) <= 0) {
      newErrors.bedrooms = 'Please enter a valid number';
    }
    if (!formData.bathrooms) {
      newErrors.bathrooms = 'Number of bathrooms is required';
    } else if (isNaN(formData.bathrooms) || parseInt(formData.bathrooms) <= 0) {
      newErrors.bathrooms = 'Please enter a valid number';
    }
    if (!formData.constructionYear) newErrors.constructionYear = 'Construction year is required';
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
        if (validatePropertyDetails()) setStep(3);
        break;
      case 3:
        if (validateCurrentInsurance()) setStep(4);
        break;
      default:
        break;
    }
  }, [step, validatePersonalInfo, validatePropertyDetails, validateCurrentInsurance]);

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
      fullName: '', nationality: '', dateOfBirth: '', nieNumber: '', address: '',
      email: '', phone: '', propertyType: '', propertySize: '', bedrooms: '',
      bathrooms: '', constructionYear: '', securityFeatures: [], propertyImages: [],
      propertyImagePreviews: [], currentProvider: '', coverageType: '', currentPremium: '',
      isPrimaryResidence: true, hasMortgage: false, specialItems: '',
    });
    setErrors({});
    setStep(1);
    setSubmitSuccess(false);
  }, []);

  const steps = [
    { number: 1, label: 'Personal Info' },
    { number: 2, label: 'Property Details' },
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
                and get back to you with the best home insurance quotes within 24 hours.
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
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Home Insurance Quote
              </h1>
              <p className="text-gray-600 mt-1">
                Compare and save up to 35% on your home insurance
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
                  />
                  <FormField
                    type="date"
                    name="dateOfBirth"
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    error={errors.dateOfBirth}
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
                    label="Property Address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Calle Gran Vía, 123, Madrid"
                    required
                    error={errors.address}
                    className="md:col-span-2"
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
                  Property Details
                </h2>
                <p className="text-gray-600 mb-8">
                  Tell us about your property for accurate quotes
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    type="select"
                    name="propertyType"
                    label="Property Type"
                    value={formData.propertyType}
                    onChange={handleChange}
                    options={propertyTypeOptions}
                    placeholder="Select property type"
                    required
                    error={errors.propertyType}
                  />
                  <FormField
                    type="number"
                    name="propertySize"
                    label="Property Size (m²)"
                    value={formData.propertySize}
                    onChange={handleChange}
                    placeholder="120"
                    required
                    error={errors.propertySize}
                  />
                  <FormField
                    type="number"
                    name="bedrooms"
                    label="Number of Bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="3"
                    required
                    error={errors.bedrooms}
                  />
                  <FormField
                    type="number"
                    name="bathrooms"
                    label="Number of Bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="2"
                    required
                    error={errors.bathrooms}
                  />
                  <FormField
                    type="select"
                    name="constructionYear"
                    label="Construction Year"
                    value={formData.constructionYear}
                    onChange={handleChange}
                    options={yearOptions.map(year => ({ value: year, label: year }))}
                    placeholder="Select year"
                    required
                    error={errors.constructionYear}
                  />
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Features
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {securityFeatures.map((feature) => (
                          <label
                            key={feature.value}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.securityFeatures?.includes(feature.value) || false}
                              onChange={() => handleSecurityFeatureChange(feature.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">{feature.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isPrimaryResidence"
                          checked={formData.isPrimaryResidence}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Primary Residence</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="hasMortgage"
                          checked={formData.hasMortgage}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Has Mortgage</span>
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload
                      label="Upload Property Photos"
                      onImageSelect={handleImageSelect}
                      onImageRemove={() => handleImageRemove(formData.propertyImagePreviews.length - 1)}
                      imagePreview={formData.propertyImagePreviews[0]}
                      hint="Upload photos of your property (max 5MB per image)"
                    />
                    {formData.propertyImagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.propertyImagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Property ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => handleImageRemove(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormField
                    type="textarea"
                    name="specialItems"
                    label="Special Items to Insure"
                    value={formData.specialItems}
                    onChange={handleChange}
                    placeholder="Jewelry, art, electronics, etc."
                    className="md:col-span-2"
                    hint="List any high-value items that need additional coverage"
                  />
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
                  Information about your current coverage helps us find better deals
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    type="select"
                    name="currentProvider"
                    label="Current Provider"
                    value={formData.currentProvider}
                    onChange={handleChange}
                    options={insuranceProviders.map(provider => ({ value: provider.value, label: provider.label }))}
                    placeholder="Select your current provider"
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
                    placeholder="Select coverage type"
                    required
                    error={errors.coverageType}
                  />
                  <FormField
                    type="number"
                    name="currentPremium"
                    label="Current Annual Premium (€)"
                    value={formData.currentPremium}
                    onChange={handleChange}
                    placeholder="300"
                    required
                    error={errors.currentPremium}
                    className="md:col-span-2"
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
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><div className="text-gray-500">Full Name</div><div className="font-medium">{formData.fullName}</div></div>
                      <div><div className="text-gray-500">Email</div><div className="font-medium">{formData.email}</div></div>
                      <div><div className="text-gray-500">Nationality</div><div className="font-medium">{formData.nationality}</div></div>
                      <div><div className="text-gray-500">Phone</div><div className="font-medium">{formData.phone || 'Not provided'}</div></div>
                      <div><div className="text-gray-500">NIE Number</div><div className="font-medium">{formData.nieNumber}</div></div>
                      <div><div className="text-gray-500">Address</div><div className="font-medium">{formData.address}</div></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><div className="text-gray-500">Property Type</div><div className="font-medium">{formData.propertyType}</div></div>
                      <div><div className="text-gray-500">Property Size</div><div className="font-medium">{formData.propertySize} m²</div></div>
                      <div><div className="text-gray-500">Bedrooms</div><div className="font-medium">{formData.bedrooms}</div></div>
                      <div><div className="text-gray-500">Bathrooms</div><div className="font-medium">{formData.bathrooms}</div></div>
                      <div><div className="text-gray-500">Construction Year</div><div className="font-medium">{formData.constructionYear}</div></div>
                      <div><div className="text-gray-500">Primary Residence</div><div className="font-medium">{formData.isPrimaryResidence ? 'Yes' : 'No'}</div></div>
                      {formData.securityFeatures?.length > 0 && (
                        <div className="md:col-span-2">
                          <div className="text-gray-500">Security Features</div>
                          <div className="font-medium">{formData.securityFeatures.join(', ')}</div>
                        </div>
                      )}
                      {formData.specialItems && (
                        <div className="md:col-span-2">
                          <div className="text-gray-500">Special Items</div>
                          <div className="font-medium">{formData.specialItems}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Insurance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><div className="text-gray-500">Current Provider</div><div className="font-medium">{formData.currentProvider}</div></div>
                      <div><div className="text-gray-500">Coverage Type</div><div className="font-medium">{formData.coverageType}</div></div>
                      <div className="md:col-span-2"><div className="text-gray-500">Current Annual Premium</div><div className="font-medium">€{formData.currentPremium}</div></div>
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
                  onClick={handleSubmit}
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
  );
};

export default HomeInsurance;
