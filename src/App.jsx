import { useState, useEffect } from 'react';
import { Car, Home, Shield, Mail, Camera, X, Euro } from 'lucide-react';

// Comprehensive car database
const carDatabase = {
  'Alfa Romeo': {
    models: {
      'Giulia': { engineSizes: [1400, 1600, 1995, 2891], horsepower: [150, 180, 200, 280, 510] },
      'Stelvio': { engineSizes: [1995, 2891], horsepower: [200, 280, 510] },
      'Tonale': { engineSizes: [1499, 1995], horsepower: [130, 160, 250] }
    }
  },
  'Audi': {
    models: {
      'A1': { engineSizes: [999, 1395, 1498, 1984], horsepower: [95, 116, 150, 200] },
      'A3': { engineSizes: [1395, 1498, 1984, 2996], horsepower: [116, 150, 204, 306] },
      'A4': { engineSizes: [1984, 2996], horsepower: [150, 204, 265, 340] },
      'A6': { engineSizes: [1984, 2996], horsepower: [204, 245, 340, 450] },
      'Q3': { engineSizes: [1984, 2996], horsepower: [150, 230, 340] },
      'Q5': { engineSizes: [1984, 2996], horsepower: [204, 265, 340] }
    }
  },
  'BMW': {
    models: {
      '1 Series': { engineSizes: [1499, 1998, 2998], horsepower: [140, 170, 218, 306] },
      '2 Series': { engineSizes: [1499, 1998, 2998], horsepower: [150, 192, 258, 340] },
      '3 Series': { engineSizes: [1998, 2998], horsepower: [184, 258, 340, 374] },
      '4 Series': { engineSizes: [1998, 2998], horsepower: [197, 258, 340] },
      '5 Series': { engineSizes: [1998, 2998], horsepower: [250, 265, 340, 530] },
      'X1': { engineSizes: [1499, 1998], horsepower: [140, 192, 231] },
      'X3': { engineSizes: [1998, 2998], horsepower: [190, 252, 292, 360] },
      'X5': { engineSizes: [2998, 3982], horsepower: [265, 340, 400, 530] }
    }
  },
  'Citroën': {
    models: {
      'C1': { engineSizes: [998, 1199], horsepower: [68, 72, 82, 100] },
      'C3': { engineSizes: [1199, 1499], horsepower: [82, 100, 110, 130] },
      'C4': { engineSizes: [1199, 1499, 1997], horsepower: [100, 130, 155, 225] },
      'C5 Aircross': { engineSizes: [1499, 1997], horsepower: [130, 180] }
    }
  },
  'Cupra': {
    models: {
      'Ateca': { engineSizes: [1498, 1984], horsepower: [150, 245, 300] },
      'Formentor': { engineSizes: [1498, 1984, 2891], horsepower: [150, 245, 310, 390] },
      'Leon': { engineSizes: [1498, 1984], horsepower: [150, 190, 245, 300] }
    }
  },
  'Dacia': {
    models: {
      'Sandero': { engineSizes: [999, 1461], horsepower: [65, 75, 90, 100] },
      'Duster': { engineSizes: [1461, 1600], horsepower: [90, 105, 130, 150] },
      'Jogger': { engineSizes: [999, 1461], horsepower: [90, 100, 110] }
    }
  },
  'DS': {
    models: {
      'DS 3': { engineSizes: [1199, 1499], horsepower: [95, 100, 130, 155] },
      'DS 4': { engineSizes: [1199, 1499], horsepower: [100, 130, 225] },
      'DS 7': { engineSizes: [1499, 1997], horsepower: [130, 180, 225, 360] }
    }
  },
  'Fiat': {
    models: {
      '500': { engineSizes: [875, 1197, 1368], horsepower: [65, 85, 95, 110] },
      'Panda': { engineSizes: [875, 999, 1197], horsepower: [65, 70, 85] },
      'Tipo': { engineSizes: [999, 1368, 1598], horsepower: [70, 95, 120] }
    }
  },
  'Ford': {
    models: {
      'Fiesta': { engineSizes: [998, 1197, 1499], horsepower: [85, 100, 125, 155] },
      'Focus': { engineSizes: [998, 1499, 1999], horsepower: [85, 125, 150, 190, 280] },
      'Puma': { engineSizes: [999, 1499], horsepower: [95, 125, 155] },
      'Kuga': { engineSizes: [1499, 1999], horsepower: [125, 150, 190, 245] },
      'Galaxy': { engineSizes: [1999], horsepower: [190, 240, 280] }
    }
  },
  'Hyundai': {
    models: {
      'i10': { engineSizes: [998, 1197], horsepower: [67, 84, 100] },
      'i20': { engineSizes: [998, 1368, 1580], horsepower: [84, 100, 120, 140] },
      'i30': { engineSizes: [1368, 1580, 1999], horsepower: [100, 120, 140, 184, 276] },
      'Tucson': { engineSizes: [1580, 1999], horsepower: [150, 184, 230, 265] },
      'Kona': { engineSizes: [1580], horsepower: [120, 136, 204] }
    }
  },
  'Kia': {
    models: {
      'Picanto': { engineSizes: [998, 1248], horsepower: [67, 84, 100] },
      'Rio': { engineSizes: [998, 1368], horsepower: [84, 100, 120] },
      'Ceed': { engineSizes: [1368, 1580, 1999], horsepower: [100, 120, 140, 204] },
      'Sportage': { engineSizes: [1580, 1999], horsepower: [150, 184, 265] },
      'Niro': { engineSizes: [1580], horsepower: [141, 204] }
    }
  },
  'Mercedes-Benz': {
    models: {
      'A-Class': { engineSizes: [1332, 1497, 1991], horsepower: [136, 163, 204, 306] },
      'B-Class': { engineSizes: [1332, 1497, 1991], horsepower: [136, 163, 204] },
      'C-Class': { engineSizes: [1497, 1991, 2996], horsepower: [184, 204, 258, 390, 435] },
      'E-Class': { engineSizes: [1991, 2996], horsepower: [211, 258, 340, 435, 612] },
      'GLA': { engineSizes: [1332, 1991], horsepower: [136, 163, 204, 306] },
      'GLB': { engineSizes: [1332, 1991], horsepower: [136, 163, 204, 224] },
      'GLC': { engineSizes: [1991, 2996], horsepower: [204, 258, 313, 390] }
    }
  },
  'Nissan': {
    models: {
      'Micra': { engineSizes: [999, 1197], horsepower: [71, 90, 100] },
      'Juke': { engineSizes: [999, 1332, 1598], horsepower: [95, 117, 140, 190] },
      'Qashqai': { engineSizes: [1197, 1598, 1997], horsepower: [115, 130, 140, 160, 190] },
      'X-Trail': { engineSizes: [1997], horsepower: [150, 200] },
      'Leaf': { engineSizes: [0], horsepower: [110, 150, 218] }
    }
  },
  'Opel': {
    models: {
      'Corsa': { engineSizes: [1199, 1368, 1499], horsepower: [75, 95, 100, 130, 155] },
      'Astra': { engineSizes: [1199, 1368, 1499, 1998], horsepower: [95, 110, 125, 155, 230] },
      'Insignia': { engineSizes: [1499, 1998, 2994], horsepower: [145, 170, 200, 230, 260] },
      'Mokka': { engineSizes: [1199, 1499], horsepower: [95, 115, 130, 155] },
      'Grandland': { engineSizes: [1499, 1998], horsepower: [130, 175, 230, 300] }
    }
  },
 'Peugeot': {
    models: {
      '108': { engineSizes: [998, 1199], horsepower: [68, 72, 82, 110] },
      '208': { engineSizes: [1199, 1499], horsepower: [75, 100, 130, 155] },
      '308': { engineSizes: [1199, 1499, 1997], horsepower: [110, 130, 155, 180, 225] },
      '3008': { engineSizes: [1199, 1499, 1997], horsepower: [110, 130, 155, 180, 225] },
      '5008': { engineSizes: [1499, 1997], horsepower: [130, 180, 225] }
    }
  },
  'Renault': {
    models: {
      'Clio': { engineSizes: [999, 1332, 1461], horsepower: [75, 90, 100, 130, 140] },
      'Captur': { engineSizes: [898, 1332, 1461], horsepower: [90, 100, 130, 140, 155] },
      'Megane': { engineSizes: [1197, 1332, 1461, 1799], horsepower: [100, 115, 130, 140, 160, 280] },
      'Scenic': { engineSizes: [1332, 1461], horsepower: [115, 130, 145, 160] },
      'Kadjar': { engineSizes: [1332, 1461, 1598], horsepower: [115, 130, 140, 160] }
    }
  },
  'Seat': {
    models: {
      'Ibiza': { engineSizes: [999, 1197, 1498], horsepower: [80, 95, 110, 115, 150] },
      'Leon': { engineSizes: [1197, 1498, 1984], horsepower: [95, 110, 120, 150, 190, 245, 300] },
      'Ateca': { engineSizes: [1498, 1984], horsepower: [115, 150, 190, 245, 300] },
      'Tarraco': { engineSizes: [1498, 1984], horsepower: [150, 190, 245, 300] }
    }
  },
  'Skoda': {
    models: {
      'Fabia': { engineSizes: [999, 1498], horsepower: [80, 95, 110, 115, 150] },
      'Octavia': { engineSizes: [1498, 1984, 2800], horsepower: [115, 150, 190, 245, 280] },
      'Kamiq': { engineSizes: [999, 1498], horsepower: [95, 115, 150] },
      'Karoq': { engineSizes: [1498, 1984], horsepower: [115, 150, 190, 245] },
      'Kodiaq': { engineSizes: [1984, 2800], horsepower: [150, 190, 245, 280] }
    }
  },
  'Toyota': {
    models: {
      'Yaris': { engineSizes: [998, 1490], horsepower: [72, 92, 116, 130] },
      'Corolla': { engineSizes: [1197, 1490, 1987], horsepower: [92, 116, 132, 160, 196] },
      'Camry': { engineSizes: [2487], horsepower: [218] },
      'RAV4': { engineSizes: [2487], horsepower: [196, 218, 306] },
      'C-HR': { engineSizes: [1798, 1987], horsepower: [116, 140, 196] }
    }
  },
  'Volvo': {
    models: {
      'XC40': { engineSizes: [1477, 1969, 2487], horsepower: [150, 163, 211, 250, 408] },
      'XC60': { engineSizes: [1969, 2487, 2954], horsepower: [211, 250, 299, 390, 408] },
      'XC90': { engineSizes: [2954, 2979], horsepower: [250, 320, 408, 455] },
      'V60': { engineSizes: [1969, 2487], horsepower: [211, 250, 299, 390] }
    }
  },
  'Volkswagen': {
    models: {
      'up!': { engineSizes: [999], horsepower: [60, 75, 90] },
      'Polo': { engineSizes: [999, 1498], horsepower: [75, 90, 95, 110, 115, 150] },
      'Golf': { engineSizes: [1197, 1498, 1968], horsepower: [90, 110, 115, 130, 150, 190, 245, 300] },
      'Passat': { engineSizes: [1395, 1498, 1968, 2800], horsepower: [110, 150, 190, 245, 280] },
      'Tiguan': { engineSizes: [1498, 1968, 2800], horsepower: [130, 150, 190, 220, 245, 280] },
      'T-Roc': { engineSizes: [1197, 1498, 1968], horsepower: [110, 115, 150, 190] }
    }
  }
}

// Insurance providers
const insuranceProviders = [
  'Achmea', 'Allianz', 'ASR', 'a.s.r.', 'Centraal Beheer', 'CNP Assurances',
  'DELA', 'FBTO', 'Generali', 'InShared', 'Interpolis', 'Kempen',
  'National Nederlanden', 'OHRA', 'Reaal', 'Univé', 'VGZ', 'ZLM',
  'Mapfre', 'AXA'
];

// Coverage types
const coverageTypes = [
  { value: 'third_party', label: { en: 'Third Party', nl: 'WA' } },
  { value: 'limited_casco', label: { en: 'Limited Casco', nl: 'WA+' } },
  { value: 'fully_comprehensive', label: { en: 'Fully Comprehensive', nl: 'All Risk' } }
];

// House excess options
const houseExcessOptions = [
  { value: '90', label: '€90' },
  { value: '300', label: '€300' },
  { value: 'other', label: 'Other' }
];

// Country options
const countryOptions = [
  'Netherlands', 'Belgium', 'Spain', 'Germany', 'France', 'United Kingdom',
  'Portugal', 'Italy', 'Poland', 'Romania', 'Other EU', 'Non-EU'
];

// Gender options
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

// ImageUpload Component
function ImageUpload({ label, onImageSelect, onImageRemove, imagePreview }) {
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onImageSelect(file, reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <Camera className="w-8 h-8 text-gray-400 mb-1" />
          <span className="text-xs text-gray-500 text-center">Upload</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border"
            />
            <button
              onClick={onImageRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// SmartSelect Component
function SmartSelect({ label, value, onChange, options, otherValue, onOtherChange, required = false, error = '' }) {
  const [showOther, setShowOther] = useState(value === 'other');

  useEffect(() => {
    setShowOther(value === 'other');
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setShowOther(val === 'other');
    if (val !== 'other') onOtherChange('');
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={handleChange}
        className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="">Select...</option>
        {Object.entries(options).map(([key, label]) => (
          <option key={key} value={key}>
            {typeof label === 'string' ? label : label.en}
          </option>
        ))}
        <option value="other">Other (specify)</option>
      </select>
      {showOther && (
        <input
          type="text"
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="Please specify"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
// CarInsuranceForm Component
function CarInsuranceForm({ onSubmit, onBack, language }) {
  const t = language === 'nl' ? nlTranslations : enTranslations;

  const [formData, setFormData] = useState({
    currentProvider: '', currentCoverage: '', currentPremium: '',
    brand: '', brandOther: '', model: '', modelOther: '', year: '',
    engineSize: '', engineSizeOther: '', horsepower: '', horsepowerOther: '',
    dateOfBirth: '', nieNumber: '', driverLicenseNationality: '',
    driverLicenseDate: '', gender: '',
    vehicleDocumentImage: null, vehicleDocumentPreview: '',
    name: '', email: '', phone: ''
  });

  const [errors, setErrors] = useState({});

  const getModels = () => {
    if (formData.brand === '' || formData.brand === 'other') return {};
    return carDatabase[formData.brand]?.models || {};
  };

  const getEngineSizes = () => {
    if (formData.brand === '' || formData.brand === 'other' || formData.model === '' || formData.model === 'other') return [];
    return carDatabase[formData.brand]?.models[formData.model]?.engineSizes || [];
  };

  const getHorsepower = () => {
    if (formData.brand === '' || formData.brand === 'other' || formData.model === '' || formData.model === 'other') return [];
    return carDatabase[formData.brand]?.models[formData.model]?.horsepower || [];
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.currentProvider) newErrors.currentProvider = t.required;
    if (!formData.currentCoverage) newErrors.currentCoverage = t.required;
    if (!formData.currentPremium) newErrors.currentPremium = t.required;
    if (!formData.brand) newErrors.brand = t.required;
    if (formData.brand !== 'other' && !formData.model) newErrors.model = t.required;
    if (formData.brand !== 'other' && formData.model !== 'other' && !formData.year) newErrors.year = t.required;
    if (!formData.dateOfBirth) newErrors.dateOfBirth = t.required;
    if (!formData.nieNumber) newErrors.nieNumber = t.required;
    if (!formData.driverLicenseNationality) newErrors.driverLicenseNationality = t.required;
    if (!formData.driverLicenseDate) newErrors.driverLicenseDate = t.required;
    if (!formData.gender) newErrors.gender = t.required;
    if (!formData.name) newErrors.name = t.required;
    if (!formData.email) {
      newErrors.email = t.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleImageSelect = (file, preview) => {
    setFormData(prev => ({ ...prev, vehicleDocumentImage: file, vehicleDocumentPreview: preview }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, vehicleDocumentImage: null, vehicleDocumentPreview: '' }));
  };

  const brandOptions = {};
  Object.keys(carDatabase).forEach(brand => { brandOptions[brand] = brand; });

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Car className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">{t.carInsurance}</h2>
        </div>
        <button type="button" onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
          <X className="w-4 h-4" />{t.back}
        </button>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.currentInsurance}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.currentProvider}*</label>
            <select value={formData.currentProvider} onChange={(e) => setFormData(prev => ({ ...prev, currentProvider: e.target.value }))}
              className={`w-full p-2 border rounded-md ${errors.currentProvider ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">{t.selectProvider}</option>
              {insuranceProviders.map(provider => <option key={provider} value={provider}>{provider}</option>)}
            </select>
            {errors.currentProvider && <p className="text-red-500 text-xs mt-1">{errors.currentProvider}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.coverageType}*</label>
            <select value={formData.currentCoverage} onChange={(e) => setFormData(prev => ({ ...prev, currentCoverage: e.target.value }))}
              className={`w-full p-2 border rounded-md ${errors.currentCoverage ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">{t.selectCoverage}</option>
              {coverageTypes.map(ct => <option key={ct.value} value={ct.value}>{typeof ct.label === 'string' ? ct.label : ct.label[language]}</option>)}
            </select>
            {errors.currentCoverage && <p className="text-red-500 text-xs mt-1">{errors.currentCoverage}</p>}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.currentPremium} (€)*</label>
          <div className="relative">
            <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="number" value={formData.currentPremium} onChange={(e) => setFormData(prev => ({ ...prev, currentPremium: e.target.value }))}
              placeholder="0" min="0" step="1" className={`w-full pl-10 p-2 border rounded-md ${errors.currentPremium ? 'border-red-500' : 'border-gray-300'}`} />
          </div>
          {errors.currentPremium && <p className="text-red-500 text-xs mt-1">{errors.currentPremium}</p>}
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.vehicleDetails}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmartSelect label={`${t.brand}*`} value={formData.brand} onChange={(val) => setFormData(prev => ({ ...prev, brand: val, model: '', engineSize: '', horsepower: '' }))}
            onOtherChange={(val) => setFormData(prev => ({ ...prev, brandOther: val }))} options={brandOptions} otherValue={formData.brandOther} required error={errors.brand} />
          {formData.brand && formData.brand !== 'other' && (
            <SmartSelect label={`${t.model}*`} value={formData.model} onChange={(val) => setFormData(prev => ({ ...prev, model: val, engineSize: '', horsepower: '' }))}
              onOtherChange={(val) => setFormData(prev => ({ ...prev, modelOther: val }))} options={getModels()} otherValue={formData.modelOther} required error={errors.model} />
          )}
        </div>
        {formData.brand && formData.brand !== 'other' && formData.model && formData.model !== 'other' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.year}*</label>
              <select value={formData.year} onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                className={`w-full p-2 border rounded-md ${errors.year ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">{t.selectYear}</option>
                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
            </div>
            <SmartSelect label={t.engineSizeCC} value={formData.engineSize} onChange={(val) => setFormData(prev => ({ ...prev, engineSize: val, horsepower: '' }))}
              onOtherChange={(val) => setFormData(prev => ({ ...prev, engineSizeOther: val }))}
              options={getEngineSizes().reduce((acc, size) => { acc[size] = `${size} cc`; return acc; }, {})} otherValue={formData.engineSizeOther} />
            <SmartSelect label={t.horsepowerHP} value={formData.horsepower} onChange={(val) => setFormData(prev => ({ ...prev, horsepower: val }))}
              onOtherChange={(val) => setFormData(prev => ({ ...prev, horsepowerOther: val }))}
              options={getHorsepower().reduce((acc, hp) => { acc[hp] = `${hp} HP`; return acc; }, {})} otherValue={formData.horsepowerOther} />
          </div>
        )}
        <ImageUpload label={t.pictureOfVehicleDocuments} onImageSelect={handleImageSelect} onImageRemove={handleImageRemove} imagePreview={formData.vehicleDocumentPreview} />
        <p className="text-xs text-gray-500 mt-1">{t.uploadVehicleDocumentsHint}</p>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.driverDetails}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.dateOfBirth}*</label>
            <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className={`w-full p-2 border rounded-md ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.nieNumber}*</label>
            <input type="text" value={formData.nieNumber} onChange={(e) => setFormData(prev => ({ ...prev, nieNumber: e.target.value }))}
              placeholder="X1234567A" className={`w-full p-2 border rounded-md ${errors.nieNumber ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.nieNumber && <p className="text-red-500 text-xs mt-1">{errors.nieNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.driverLicenseNationality}*</label>
            <select value={formData.driverLicenseNationality} onChange={(e) => setFormData(prev => ({ ...prev, driverLicenseNationality: e.target.value }))}
              className={`w-full p-2 border rounded-md ${errors.driverLicenseNationality ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">{t.selectNationality}</option>
              {countryOptions.map(country => <option key={country} value={country}>{country}</option>)}
            </select>
            {errors.driverLicenseNationality && <p className="text-red-500 text-xs mt-1">{errors.driverLicenseNationality}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.driverLicenseDate}*</label>
            <input type="date" value={formData.driverLicenseDate} onChange={(e) => setFormData(prev => ({ ...prev, driverLicenseDate: e.target.value }))}
              className={`w-full p-2 border rounded-md ${errors.driverLicenseDate ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.driverLicenseDate && <p className="text-red-500 text-xs mt-1">{errors.driverLicenseDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.gender}*</label>
            <select value={formData.gender} onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              className={`w-full p-2 border rounded-md ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">{t.selectGender}</option>
              {genderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.contactInformation}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.fullName}*</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t.enterYourName} className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}*</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder={t.enterYourEmail} className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder={t.enterYourPhone} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
        <Mail className="w-5 h-5" />{t.submitQuoteRequest}
      </button>
    </form>
  );
}
