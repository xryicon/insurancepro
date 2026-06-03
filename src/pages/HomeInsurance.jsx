import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import FormField from '../components/forms/FormField';
import { supabase } from '../lib/supabase';
import {
  propertyTypeOptions,
  insuranceProviders,
  nationalityOptions,
  getYearOptions,
  NIE_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX
} from '../data/constants';

// Date formatting helper
const formatDateInput = (value) => {
  const v = value.replace(/\D/g, '');
  if (v.length <= 2) return v;
  if (v.length <= 4) return `${v.substring(0, 2)}/${v.substring(2)}`;
  if (v.length <= 6) return `${v.substring(0, 2)}/${v.substring(2, 4)}/${v.substring(4)}`;
  return `${v.substring(0, 2)}/${v.substring(2, 4)}/${v.substring(4, 8)}`;
};

const residenceUsageOptions = [
  { value: 'main', label: 'Main residence' },
  { value: 'second', label: 'Second residence' },
  { value: 'rented', label: 'Rented residence' },
  { value: 'other', label: 'Other' },
];

export default function HomeInsurance() {
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

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Please enter date as DD/MM/YYYY';
    } else {
      const [day, month, year] = formData.dateOfBirth.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        newErrors.dateOfBirth = 'Please enter a valid date';
      }
    }

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
    const { error } = await supabase.from('leads').insert([
      {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        address: formData.address,

        lead_type: 'home',
        status: 'new',
        source: 'home_insurance_form',

        data: {
          nationality: formData.nationality,
          date_of_birth: formData.dateOfBirth,
          nie_number: formData.nieNumber,
          postal_code: formData.postalCode,

          property_type: formData.propertyType,
          living_size: formData.livingSize ? parseInt(formData.livingSize) : null,
          outside_size: formData.outsideSize ? parseInt(formData.outsideSize) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,

          construction_year: formData.constructionYear,
          refurbished_year: formData.refurbishedYear,

          residence_usage: formData.residenceUsage,
          contents_value: formData.contentsValue ? parseFloat(formData.contentsValue) : null,

          google_maps_link: formData.googleMapsLink,
          catastro_number: formData.catastroNumber,
          special_items: formData.specialItems,

          current_provider: formData.currentProvider,
          current_premium: formData.currentPremium ? parseFloat(formData.currentPremium) : null
        }
      }
    ]);

    if (error) {
      console.error(error);
      throw error;
    }

    setSubmitSuccess(true);
    toast.success('Home insurance quote submitted!');
  } catch (error) {
    console.error('Supabase error:', error);
    toast.error('There was an error submitting your quote request.');
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
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white">
        <Card className="p-10 bg-slate-900 border-slate-800 text-center max-w-2xl">
          <Check className="w-10 h-10 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl mb-4">Quote Request Submitted!</h2>
          <p className="text-slate-400 mb-8">
            Thank you for your request. Our team will review your information and get back to you with the best home insurance quotes within 24 hours.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/')}>Back to Home</Button>
            <Button variant="ghost" onClick={() => navigate('/quote')}>Start New Quote</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-[#0a0f1c] text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <button onClick={() => navigate('/')} className="mb-6 flex items-center text-slate-400">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {/* Progress bar */}
          <div className="mb-10 relative">
            <div className="h-1 bg-slate-800 rounded">
              <div
                className="h-1 bg-indigo-500 transition-all"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-4">
              {steps.map((s) => (
                <div key={s.number} className="text-center">
                  <div className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center ${step >= s.number ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                    {s.number}
                  </div>
                  <div className="text-xs mt-1 text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-slate-900 border-slate-800 p-8">
            {step === 4 ? (
              <form id="form" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-6 text-slate-300">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-white font-medium mb-3">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><span className="text-slate-500">Full Name:</span> {formData.fullName}</div>
                      <div><span className="text-slate-500">Email:</span> {formData.email}</div>
                      <div><span className="text-slate-500">Nationality:</span> {formData.nationality}</div>
                      <div><span className="text-slate-500">Phone:</span> {formData.phone || 'Not provided'}</div>
                      <div><span className="text-slate-500">NIE Number:</span> {formData.nieNumber}</div>
                      <div><span className="text-slate-500">Date of Birth:</span> {formData.dateOfBirth}</div>
                      <div><span className="text-slate-500">Address:</span> {formData.address}</div>
                      <div><span className="text-slate-500">Postal Code:</span> {formData.postalCode}</div>
                    </div>
                  </div>

                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-white font-medium mb-3">Property Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><span className="text-slate-500">Property Type:</span> {formData.propertyType}</div>
                      <div><span className="text-slate-500">Living Size:</span> {formData.livingSize} m²</div>
                      {formData.outsideSize && <div><span className="text-slate-500">Outside Size:</span> {formData.outsideSize} m²</div>}
                      <div><span className="text-slate-500">Bedrooms:</span> {formData.bedrooms}</div>
                      <div><span className="text-slate-500">Bathrooms:</span> {formData.bathrooms}</div>
                      <div><span className="text-slate-500">Construction Year:</span> {formData.constructionYear}</div>
                      {formData.refurbishedYear && <div><span className="text-slate-500">Refurbished Year:</span> {formData.refurbishedYear}</div>}
                      <div className="md:col-span-2"><span className="text-slate-500">Residence Usage:</span> {formData.residenceUsage === 'main' ? 'Main residence' : formData.residenceUsage === 'second' ? 'Second residence' : formData.residenceUsage === 'rented' ? 'Rented residence' : 'Other'}</div>
                      <div><span className="text-slate-500">Contents Value:</span> €{formData.contentsValue}</div>
                      {formData.googleMapsLink && <div className="md:col-span-2"><span className="text-slate-500">Google Maps Link:</span> <a href={formData.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">View on Maps</a></div>}
                      {formData.catastroNumber && <div className="md:col-span-2"><span className="text-slate-500">Catastro Number:</span> {formData.catastroNumber}</div>}
                      {formData.specialItems && <div className="md:col-span-2"><span className="text-slate-500">Special Items:</span> {formData.specialItems}</div>}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">Current Insurance</h3>
                    <div className="grid gap-4">
                      <div><span className="text-slate-500">Current Provider:</span> {formData.currentProvider}</div>
                      <div><span className="text-slate-500">Current Annual Premium:</span> €{formData.currentPremium}</div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-6 text-white">
                  {/* STEP 1: Personal Information */}
                  {step === 1 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                      <FormField type="select" name="nationality" label="Nationality" value={formData.nationality} onChange={handleChange} options={nationalityOptions} error={errors.nationality} />

                      {/* Date of Birth Field - UPDATED */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-white">Date of Birth</label>
                        <input
                          type="text"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={(e) => {
                            const formatted = formatDateInput(e.target.value);
                            setFormData(prev => ({ ...prev, dateOfBirth: formatted }));
                            if (errors.dateOfBirth) {
                              setErrors(prev => ({ ...prev, dateOfBirth: '' }));
                            }
                          }}
                          placeholder="DD/MM/YYYY"
                          maxLength={10}
                          className={`w-full px-3 py-2 bg-slate-800 border ${errors.dateOfBirth ? 'border-red-500' : 'border-slate-700'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.dateOfBirth && <p className="text-red-400 text-sm">{errors.dateOfBirth}</p>}
                      </div>

                      <FormField name="nieNumber" label="NIE Number" value={formData.nieNumber} onChange={handleChange} error={errors.nieNumber} placeholder="X1234567A" />
                      <FormField name="address" label="Property Address" value={formData.address} onChange={handleChange} error={errors.address} />
                      <FormField name="postalCode" label="Postal Code" value={formData.postalCode} onChange={handleChange} error={errors.postalCode} />
                      <FormField type="email" name="email" label="Email Address" value={formData.email} onChange={handleChange} error={errors.email} />
                      <FormField type="tel" name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} error={errors.phone} />
                    </div>
                  )}

                  {/* STEP 2: Property Details */}
                  {step === 2 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField type="select" name="propertyType" label="Property Type" value={formData.propertyType} onChange={handleChange} options={propertyTypeOptions} error={errors.propertyType} />
                      <div />
                      <FormField type="number" name="livingSize" label="Living Size (m²)" value={formData.livingSize} onChange={handleChange} error={errors.livingSize} />
                      <FormField type="number" name="outsideSize" label="Outside Size (m²)" value={formData.outsideSize} onChange={handleChange} hint="Garage, Carport, Casita" />
                      <FormField type="number" name="bedrooms" label="Number of Bedrooms" value={formData.bedrooms} onChange={handleChange} error={errors.bedrooms} />
                      <FormField type="number" name="bathrooms" label="Number of Bathrooms" value={formData.bathrooms} onChange={handleChange} error={errors.bathrooms} />
                      <FormField type="select" name="constructionYear" label="Construction Year" value={formData.constructionYear} onChange={handleChange} options={yearOptions.map(year => ({ value: year, label: year }))} error={errors.constructionYear} />
                      <FormField type="select" name="refurbishedYear" label="Refurbished Year" value={formData.refurbishedYear} onChange={handleChange} options={[{ value: '', label: 'Not refurbished' }, ...yearOptions.map(year => ({ value: year, label: year }))]} />
                      <FormField type="select" name="residenceUsage" label="Residence Usage" value={formData.residenceUsage} onChange={handleChange} options={residenceUsageOptions} error={errors.residenceUsage} className="md:col-span-2" />
                      <FormField type="number" name="contentsValue" label="Contents Value (€)" value={formData.contentsValue} onChange={handleChange} error={errors.contentsValue} hint="Estimated value of your belongings" />
                      <FormField type="url" name="googleMapsLink" label="Google Maps Link (Optional)" value={formData.googleMapsLink} onChange={handleChange} className="md:col-span-2" />
                      <FormField name="catastroNumber" label="Catastro Number (Optional)" value={formData.catastroNumber} onChange={handleChange} className="md:col-span-2" />
                      <FormField type="textarea" name="specialItems" label="Special Items to Insure (Optional)" value={formData.specialItems} onChange={handleChange} className="md:col-span-2" hint="List any high-value items that need additional coverage" />
                    </div>
                  )}

                  {/* STEP 3: Current Insurance */}
                  {step === 3 && (
                    <div className="grid gap-6">
                      <FormField name="currentProvider" label="Write your current provider" value={formData.currentProvider} onChange={handleChange} error={errors.currentProvider} className="md:col-span-2" />
                      <FormField type="number" name="currentPremium" label="Current Annual Premium (€)" value={formData.currentPremium} onChange={handleChange} error={errors.currentPremium} className="md:col-span-2" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-8 border-t border-slate-800 pt-6">
                  {step > 1 && (
                    <Button type="button" variant="ghost" onClick={handlePrevious}>
                      <ChevronLeft /> Back
                    </Button>
                  )}
                  {step < 4 ? (
                    <Button type="button" onClick={handleNext}>
                      Next <ChevronRight />
                    </Button>
                  ) : null}
                </div>
              </>
            )}

            <div className="flex justify-between mt-8 border-t border-slate-800 pt-6">
              {step === 4 && (
                <Button type="button" variant="ghost" onClick={handlePrevious}>
                  <ChevronLeft /> Back to Edit
                </Button>
              )}
              {step === 4 && (
                <Button type="submit" form="form" loading={isSubmitting} onClick={handleSubmit}>
                  Submit Quote Request
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}