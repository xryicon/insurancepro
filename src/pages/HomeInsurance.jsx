import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Home, User, Mail, Phone, Calendar, MapPin, Shield, ArrowLeft,
  Check, ChevronLeft, ChevronRight, Building, Bed, Bath, Ruler
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import FormField from '../components/forms/FormField';
import {
  propertyTypeOptions,
  insuranceProviders,
  nationalityOptions,
  getYearOptions,
  NIE_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX
} from '../data/constants';

// Dropdown options
const residenceUsageOptions = [
  { value: 'main', label: 'Main residence' },
  { value: 'second', label: 'Second residence' },
  { value: 'rented', label: 'Rented residence' },
  { value: 'other', label: 'Other' },
];

const HomeInsurance = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', nationality: '', dateOfBirth: '', nieNumber: '', address: '', postalCode: '',
    email: '', phone: '', propertyType: '', livingSize: '', outsideSize: '', bedrooms: '',
    bathrooms: '', constructionYear: '', refurbishedYear: '', residenceUsage: '',
    contentsValue: '', googleMapsLink: '', catastroNumber: '',
    currentProvider: '', currentPremium: '',
    specialItems: '',
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
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
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
    if (!formData.livingSize) {
      newErrors.livingSize = 'Living size is required';
    } else if (isNaN(formData.livingSize) || parseInt(formData.livingSize) <= 0) {
      newErrors.livingSize = 'Please enter a valid living size';
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
    if (!formData.residenceUsage) newErrors.residenceUsage = 'Residence usage is required';
    if (!formData.contentsValue) {
      newErrors.contentsValue = 'Contents value is required';
    } else if (isNaN(formData.contentsValue) || parseInt(formData.contentsValue) <= 0) {
      newErrors.contentsValue = 'Please enter a valid amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateCurrentInsurance = useCallback(() => {
    const newErrors = {};
    if (!formData.currentProvider) newErrors.currentProvider = 'Current provider is required';
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
      const response = await fetch('https://formspree.io/f/xdajdegr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const handleStartOver = useCallback(() => {
    setFormData({
      fullName: '', nationality: '', dateOfBirth: '', nieNumber: '', address: '', postalCode: '',
      email: '', phone: '', propertyType: '', livingSize: '', outsideSize: '', bedrooms: '',
      bathrooms: '', constructionYear: '', refurbishedYear: '', residenceUsage: '',
      contentsValue: '', googleMapsLink: '', catastroNumber: '',
      currentProvider: '', currentPremium: '',
      specialItems: '',
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
        {/* Header section */}
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
            {/* STEP 1: Personal Information */}
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
                  
                  {/* DROPDOWN: Nationality */}
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
                    placeholder="Calle Gran Vía, 123"
                    required
                    error={errors.address}
                  />
                  <FormField
                    type="text"
                    name="postalCode"
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="28001"
                    required
                    error={errors.postalCode}
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

            {/* STEP 2: Property Details */}
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
                  {/* DROPDOWN: Property Type */}
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

                  <div />

                  <FormField
                    type="number"
                    name="livingSize"
                    label="Living Size (m²)"
                    value={formData.livingSize}
                    onChange={handleChange}
                    placeholder="120"
                    required
                    error={errors.livingSize}
                  />

                  <FormField
                    type="number"
                    name="outsideSize"
                    label="Outside Size (m²) (Optional)"
                    value={formData.outsideSize}
                    onChange={handleChange}
                    placeholder="50"
                    hint="Garage, Carport, Casita"
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

                  {/* DROPDOWN: Construction Year */}
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

                  {/* DROPDOWN: Refurbished Year */}
                  <FormField
                    type="select"
                    name="refurbishedYear"
                    label="Refurbished Year (Optional)"
                    value={formData.refurbishedYear}
                    onChange={handleChange}
                    options={[{ value: '', label: 'Not refurbished' }, ...yearOptions.map(year => ({ value: year, label: year }))]}
                    placeholder="Select year"
                  />

                  {/* DROPDOWN: Residence Usage */}
                  <FormField
                    type="select"
                    name="residenceUsage"
                    label="Residence Usage"
                    value={formData.residenceUsage}
                    onChange={handleChange}
                    options={residenceUsageOptions}
                    required
                    error={errors.residenceUsage}
                    className="md:col-span-2"
                  />

                  <FormField
                    type="number"
                    name="contentsValue"
                    label="Contents Value (€)"
                    value={formData.contentsValue}
                    onChange={handleChange}
                    placeholder="50000"
                    required
                    error={errors.contentsValue}
                    hint="Estimated value of your belongings"
                  />

                  {/* OPTIONAL: Google Maps Link */}
                  <FormField
                    type="url"
                    name="googleMapsLink"
                    label="Google Maps Link (Optional)"
                    value={formData.googleMapsLink}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/..."
                    className="md:col-span-2"
                  />

                  {/* OPTIONAL: Catastro Number */}
                  <FormField
                    type="text"
                    name="catastroNumber"
                    label="Catastro Number (Optional)"
                    value={formData.catastroNumber}
                    onChange={handleChange}
                    placeholder="123456789012345678AA"
                    className="md:col-span-2"
                  />

                  {/* OPTIONAL: Special Items */}
                  <FormField
                    type="textarea"
                    name="specialItems"
                    label="Special Items to Insure (Optional)"
                    value={formData.specialItems}
                    onChange={handleChange}
                    placeholder="Jewelry, art, electronics, etc."
                    className="md:col-span-2"
                    hint="List any high-value items that need additional coverage"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 3: Current Insurance */}
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
                    type="text"
                    name="currentProvider"
                    label="Write your current provider"
                    value={formData.currentProvider}
                    onChange={handleChange}
                    placeholder="e.g., Allianz, Mapfre, etc."
                    required
                    error={errors.currentProvider}
                    className="md:col-span-2"
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

            {/* STEP 4: Review & Submit */}
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
                  {/* Personal Information Review */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><div className="text-gray-500">Full Name</div><div className="font-medium">{formData.fullName}</div></div>
                      <div><div className="text-gray-500">Email</div><div className="font-medium">{formData.email}</div></div>
                      <div><div className="text-gray-500">Nationality</div><div className="font-medium">{formData.nationality}</div></div>
                      <div><div className="text-gray-500">Phone</div><div className="font-medium">{formData.phone || 'Not provided'}</div></div>
                      <div><div className="text-gray-500">NIE Number</div><div className="font-medium">{formData.nieNumber}</div></div>
                      <div><div className="text-gray-500">Address</div><div className="font-medium">{formData.address}</div></div>
                      <div><div className="text-gray-500">Postal Code</div><div className="font-medium">{formData.postalCode}</div></div>
                    </div>
                  </div>

                  {/* Property Details Review */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><div className="text-gray-500">Property Type</div><div className="font-medium">{formData.propertyType}</div></div>
                      <div><div className="text-gray-500">Living Size</div><div className="font-medium">{formData.livingSize} m²</div></div>
                      {formData.outsideSize && (
                        <div><div className="text-gray-500">Outside Size</div><div className="font-medium">{formData.outsideSize} m²</div></div>
                      )}
                      <div><div className="text-gray-500">Bedrooms</div><div className="font-medium">{formData.bedrooms}</div></div>
                      <div><div className="text-gray-500">Bathrooms</div><div className="font-medium">{formData.bathrooms}</div></div>
                      <div><div className="text-gray-500">Construction Year</div><div className="font-medium">{formData.constructionYear}</div></div>
                      {formData.refurbishedYear && (
                        <div><div className="text-gray-500">Refurbished Year</div><div className="font-medium">{formData.refurbishedYear}</div></div>
                      )}
                      <div className="md:col-span-2">
                        <div className="text-gray-500">Residence Usage</div>
                        <div className="font-medium">
                          {formData.residenceUsage === 'main' ? 'Main residence' :
                           formData.residenceUsage === 'second' ? 'Second residence' :
                           formData.residenceUsage === 'rented' ? 'Rented residence' : 'Other'}
                        </div>
                      </div>
                      <div><div className="text-gray-500">Contents Value</div><div className="font-medium">€{formData.contentsValue}</div></div>
                      {formData.googleMapsLink && (
                        <div className="md:col-span-2">
                          <div className="text-gray-500">Google Maps Link (Optional)</div>
                          <div className="font-medium">
                            <a href={formData.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View on Maps</a>
                          </div>
                        </div>
                      )}
                      {formData.catastroNumber && (
                        <div className="md:col-span-2">
                          <div className="text-gray-500">Catastro Number (Optional)</div>
                          <div className="font-medium">{formData.catastroNumber}</div>
                        </div>
                      )}
                      {formData.specialItems && (
                        <div className="md:col-span-2">
                          <div className="text-gray-500">Special Items (Optional)</div>
                          <div className="font-medium">{formData.specialItems}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Current Insurance Review */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Insurance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><div className="text-gray-500">Current Provider</div><div className="font-medium">{formData.currentProvider}</div></div>
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

            {/* Navigation buttons */}
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
