import { useState, useEffect } from 'react';
import { Car, Home, Shield, Check, Star, Mail, Camera, X, Euro, Upload } from 'lucide-react';

// ============ TRANSLATIONS ============
const enTranslations = {
  carInsurance: 'Car Insurance', houseInsurance: 'House Insurance',
  compareAndSave: 'Compare and Save on Insurance',
  compareCarInsurance: 'Compare car insurance from top providers and save up to 40%',
  compareHouseInsurance: 'Compare home insurance from top providers and save up to 35%',
  getStarted: 'Get Started', personalInfo: 'Personal Information', vehicleDetails: 'Vehicle Details',
  fullName: 'Full Name', nationality: 'Nationality', licenseDate: 'Driver License Date',
  licenseNationality: 'License Nationality', dateOfBirth: 'Date of Birth', nieNumber: 'NIE Number',
  address: 'Address', email: 'Email Address', phone: 'Telephone Number',
  registrationNumber: 'Registration Number', brand: 'Brand', model: 'Model', year: 'Year',
  engineSizeCC: 'Engine Size (cc)', horsepowerHP: 'Horsepower (HP)',
  transmission: 'Transmission', fuelType: 'Fuel Type',
  uploadLogbook: 'Upload Vehicle Registration',
  uploadLogbookHint: 'Upload a photo of your vehicle registration document if you do not know the details',
  currentInsurance: 'Current Insurance', currentProvider: 'Current insurance provider',
  selectProvider: 'Select your provider', coverageType: 'Coverage type', selectCoverage: 'Select coverage',
  currentPremium: 'Current annual premium', back: 'Back',
  required: 'This field is required', invalidEmail: 'Please enter a valid email address', select: 'Select...'
};

// ============ CONSTANTS ============
const transmissionOptions = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' }
];
const fuelTypeOptions = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Full Electric' }
];
const nationalityOptions = ['Spanish', 'British', 'Dutch', 'German', 'French', 'Belgian', 'Portuguese', 'Italian', 'Other EU', 'Non-EU'];
const insuranceProviders = ['Achmea', 'Allianz', 'ASR', 'Centraal Beheer', 'DELA', 'FBTO', 'Generali', 'Interpolis', 'Mapfre', 'AXA'];

// ============ COMPONENTS ============
function ImageUpload({ label, onImageSelect, onImageRemove, imagePreview }) {
  const [error, setError] = useState('');
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) { setError('Please select an image file'); return; }
    const reader = new FileReader();
    reader.onload = () => { onImageSelect(file, reader.result); setError(''); };
    reader.readAsDataURL(file);
  };
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <Upload className="w-8 h-8 text-gray-400 mb-1" />
          <span className="text-xs text-gray-500">Upload</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        {imagePreview && (
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
            <button onClick={onImageRemove} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SmartSelect({ label, value, onChange, options, otherValue, onOtherChange, required = false, error = '' }) {
  const [showOther, setShowOther] = useState(value === 'other');
  useEffect(() => { setShowOther(value === 'other'); }, [value]);
  const handleChange = (e) => {
    const val = e.target.value; onChange(val); setShowOther(val === 'other');
    if (val !== 'other') onOtherChange('');
  };
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
      <select value={value} onChange={handleChange} className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}>
        <option value="">{label || 'Select...'}</option>
        {Object.entries(options).map(([key, lbl]) => <option key={key} value={key}>{lbl}</option>)}
        <option value="other">Other</option>
      </select>
      {showOther && <input type="text" value={otherValue} onChange={(e) => onOtherChange(e.target.value)} placeholder="Specify" className="mt-2 w-full p-2 border border-gray-300 rounded-md" />}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ============ LANDING PAGE ============
function LandingPage({ onSelect }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full py-4 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex justify-end">
          <a href="mailto:info@insurancepro.es" className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
            <Mail className="w-4 h-4" /> info@insurancepro.es
          </a>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" /> Trusted by 10,000+ customers in Spain
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Save Money on Your Insurance</h1>
        </div>
        <div className="flex justify-center gap-8 flex-wrap mb-12">
          <div className="flex items-center gap-2 text-gray-500"><Check className="w-5 h-5 text-green-500" /><span className="text-sm">100% Secure</span></div>
          <div className="flex items-center gap-2 text-gray-500"><Star className="w-5 h-5 text-yellow-500" /><span className="text-sm">4.9/5 Rating</span></div>
          <div className="flex items-center gap-2 text-gray-500"><Shield className="w-5 h-5 text-blue-500" /><span className="text-sm">Trusted Partner</span></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <button onClick={() => onSelect('car')} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md group">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-100"><Car className="w-8 h-8 text-blue-600" /></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Car Insurance</h2>
              <p className="text-gray-600 mb-6">Compare and save up to 40%</p>
              <span className="text-blue-600 font-medium">Get a free quote →</span>
            </div>
          </button>
          <button onClick={() => onSelect('house')} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md group">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-100"><Home className="w-8 h-8 text-green-600" /></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">House Insurance</h2>
              <p className="text-gray-600 mb-6">Compare and save up to 35%</p>
              <span className="text-green-600 font-medium">Get a free quote →</span>
            </div>
          </button>
        </div>
      </main>
      <footer className="py-8 px-6 border-t border-gray-200 bg-white text-center text-sm text-gray-500">
        © 2026 InsurancePro. All rights reserved.
      </footer>
    </div>
  );
}

// ============ CAR INSURANCE FORM ============
function CarInsuranceForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    fullName: '', nationality: '', licenseDate: '', licenseNationality: '',
    dateOfBirth: '', nieNumber: '', address: '', email: '', phone: '',
    registrationNumber: '', brand: '', model: '', year: '',
    engineSize: '', horsepower: '', transmission: '', fuelType: '',
    logbookImage: null, logbookPreview: ''
  });
  const [errors, setErrors] = useState({});
  
  const brandOptions = {
    'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'T-Roc'],
    'Peugeot': ['108', '208', '308', '3008', '5008'],
    'Renault': ['Clio', 'Captur', 'Megane', 'Scenic', 'Kadjar'],
    'Ford': ['Fiesta', 'Focus', 'Puma', 'Kuga'],
    'Toyota': ['Yaris', 'Corolla', 'RAV4', 'C-HR']
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Required';
    if (!formData.nationality) newErrors.nationality = 'Required';
    if (!formData.licenseDate) newErrors.licenseDate = 'Required';
    if (!formData.licenseNationality) newErrors.licenseNationality = 'Required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Required';
    if (!formData.nieNumber) newErrors.nieNumber = 'Required';
    if (!formData.address) newErrors.address = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => { e.preventDefault(); if (!validate()) return; onSubmit(formData); };
  const handleImageSelect = (file, preview) => setFormData(prev => ({ ...prev, logbookImage: file, logbookPreview: preview }));
  const handleImageRemove = () => setFormData(prev => ({ ...prev, logbookImage: null, logbookPreview: '' }));

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Car Insurance Quote</h2>
        <button type="button" onClick={onBack} className="text-gray-600 hover:text-gray-800">← Back</button>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Full Name *</label>
            <input type="text" value={formData.fullName} onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))} className={`w-full p-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>
          <div><label className="block text-sm font-medium mb-1">Nationality *</label>
            <select value={formData.nationality} onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))} className={`w-full p-2 border rounded-md ${errors.nationality ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Select</option>{nationalityOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
          </div>
          <div><label className="block text-sm font-medium mb-1">License Date *</label>
            <input type="date" value={formData.licenseDate} onChange={(e) => setFormData(prev => ({ ...prev, licenseDate: e.target.value }))} className={`w-full p-2 border rounded-md ${errors.licenseDate ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.licenseDate && <p className="text-red-500 text-xs mt-1">{errors.licenseDate}</p>}
          </div>
          <div><label className="block text-sm font-medium mb-1">License Nationality *</label>
            <select value={formData.licenseNationality} onChange={(e) => setFormData(prev => ({ ...prev, licenseNationality: e.target.value }))} className={`w-full p-2 border rounded-md ${errors.licenseNationality ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Select</option>{nationalityOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            {errors.licenseNationality && <p className="text-red-500 text-xs mt-1">{errors.licenseNationality}</p>}
          </div>
          <div><label className="block text-sm font-medium mb-1">Date of Birth *</label>
            <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))} className={`w-full p-2 border rounded-md ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>
          <div><label className="block text-sm font-medium mb-1">NIE Number *</label>
            <input type="text" value={formData.nieNumber} onChange={(e) => setFormData(prev => ({ ...prev, nieNumber: e.target.value }))} placeholder="X1234567A" className={`w-full p-2 border rounded-md ${errors.nieNumber ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.nieNumber && <p className="text-red-500 text-xs mt-1">{errors.nieNumber}</p>}
          </div>
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Address *</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          <div><label className="block text-sm font-medium mb-1">Email *</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div><label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Registration Number *</label>
            <input type="text" value={formData.registrationNumber} onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))} className={`w-full p-2 border rounded-md ${errors.registrationNumber ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
          </div>
          <div><label className="block text-sm font-medium mb-1">Brand *</label>
            <select value={formData.brand} onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value, model: '' }))} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select brand</option>{Object.keys(brandOptions).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          {formData.brand && <div><label className="block text-sm font-medium mb-1">Model *</label>
            <select value={formData.model} onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select model</option>{brandOptions[formData.brand]?.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>}
          <div><label className="block text-sm font-medium mb-1">Year</label>
            <select value={formData.year} onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select year</option>
              {Array.from({length:30}, (_,i) => new Date().getFullYear()-i).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-1">Engine Size (cc)</label>
            <input type="text" value={formData.engineSize} onChange={(e) => setFormData(prev => ({ ...prev, engineSize: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div><label className="block text-sm font-medium mb-1">Horsepower (HP)</label>
            <input type="text" value={formData.horsepower} onChange={(e) => setFormData(prev => ({ ...prev, horsepower: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div><label className="block text-sm font-medium mb-1">Transmission</label>
            <select value={formData.transmission} onChange={(e) => setFormData(prev => ({ ...prev, transmission: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select</option>{transmissionOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-1">Fuel Type</label>
            <select value={formData.fuelType} onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value }))} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select</option>{fuelTypeOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Upload Vehicle Registration</label>
          <ImageUpload onImageSelect={handleImageSelect} onImageRemove={handleImageRemove} imagePreview={formData.logbookPreview} />
          <p className="text-xs text-gray-500 mt-1">Upload a photo if you do not know the details</p>
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
        Get Quote
      </button>
    </form>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [currentForm, setCurrentForm] = useState('landing');
  return (
    <div className="min-h-screen bg-gray-50">
      {currentForm === 'landing' && <LandingPage onSelect={setCurrentForm} />}
      {currentForm === 'car' && <CarInsuranceForm onSubmit={(d) => console.log(d)} onBack={() => setCurrentForm('landing')} />}
    </div>
  );
}
