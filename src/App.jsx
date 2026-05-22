import { useState } from 'react';
import { Car, Home, Shield, Mail, Phone, User, CheckCircle, ChevronDown } from 'lucide-react';

const carDatabase = {
  'Alfa Romeo': { models: { 'Giulia': { engineSizes: [1400, 1600, 1995, 2891], horsepower: [150, 180, 200, 280, 510] }, 'Stelvio': { engineSizes: [1995, 2891], horsepower: [200, 280, 510] }, 'Tonale': { engineSizes: [1499, 1995], horsepower: [130, 160, 250] } } },
  'Audi': { models: { 'A1': { engineSizes: [999, 1395, 1498, 1984], horsepower: [95, 116, 150, 200] }, 'A3': { engineSizes: [1395, 1498, 1984, 2996], horsepower: [116, 150, 204, 306] }, 'A4': { engineSizes: [1984, 2996], horsepower: [150, 204, 265, 340] }, 'A6': { engineSizes: [1984, 2996], horsepower: [204, 245, 340, 450] }, 'Q3': { engineSizes: [1984, 2996], horsepower: [150, 230, 340] }, 'Q5': { engineSizes: [1984, 2996], horsepower: [204, 265, 340] } } },
  'BMW': { models: { '1 Series': { engineSizes: [1499, 1998, 2998], horsepower: [140, 170, 218, 306] }, '2 Series': { engineSizes: [1499, 1998, 2998], horsepower: [150, 192, 258, 340] }, '3 Series': { engineSizes: [1998, 2998], horsepower: [184, 258, 340, 374] }, '4 Series': { engineSizes: [1998, 2998], horsepower: [197, 258, 340] }, '5 Series': { engineSizes: [1998, 2998], horsepower: [250, 265, 340, 530] }, 'X1': { engineSizes: [1499, 1998], horsepower: [140, 192, 231] }, 'X3': { engineSizes: [1998, 2998], horsepower: [190, 252, 292, 360] }, 'X5': { engineSizes: [2998, 3982], horsepower: [265, 340, 400, 530] } } },
  'Citroën': { models: { 'C1': { engineSizes: [998, 1199], horsepower: [68, 72, 82, 100] }, 'C3': { engineSizes: [1199, 1499], horsepower: [82, 100, 110, 130] }, 'C4': { engineSizes: [1199, 1499, 1997], horsepower: [100, 130, 155, 225] }, 'C5 Aircross': { engineSizes: [1499, 1997], horsepower: [130, 180] } } },
  'Cupra': { models: { 'Ateca': { engineSizes: [1498, 1984], horsepower: [150, 245, 300] }, 'Formentor': { engineSizes: [1498, 1984, 2891], horsepower: [150, 245, 310, 390] }, 'Leon': { engineSizes: [1498, 1984], horsepower: [150, 190, 245, 300] } } },
  'Dacia': { models: { 'Sandero': { engineSizes: [999, 1461], horsepower: [65, 75, 90, 100] }, 'Duster': { engineSizes: [1461, 1600], horsepower: [90, 105, 130, 150] }, 'Jogger': { engineSizes: [999, 1461], horsepower: [90, 100, 110] } } },
  'DS': { models: { 'DS 3': { engineSizes: [1199, 1499], horsepower: [95, 100, 130, 155] }, 'DS 4': { engineSizes: [1199, 1499], horsepower: [100, 130, 225] }, 'DS 7': { engineSizes: [1499, 1997], horsepower: [130, 180, 225, 360] } } },
  'Fiat': { models: { '500': { engineSizes: [875, 1197, 1368], horsepower: [65, 85, 95, 110] }, 'Panda': { engineSizes: [875, 999, 1197], horsepower: [65, 70, 85] }, 'Tipo': { engineSizes: [999, 1368, 1598], horsepower: [70, 95, 120] } } },
  'Ford': { models: { 'Fiesta': { engineSizes: [998, 1197, 1499], horsepower: [85, 100, 125, 155] }, 'Focus': { engineSizes: [998, 1499, 1999], horsepower: [85, 125, 150, 190, 280] }, 'Puma': { engineSizes: [999, 1499], horsepower: [95, 125, 155] }, 'Kuga': { engineSizes: [1499, 1999], horsepower: [125, 150, 190, 245] }, 'Galaxy': { engineSizes: [1999], horsepower: [190, 240, 280] } } },
  'Hyundai': { models: { 'i10': { engineSizes: [998, 1197], horsepower: [67, 84, 100] }, 'i20': { engineSizes: [998, 1368, 1580], horsepower: [84, 100, 120, 140] }, 'i30': { engineSizes: [1368, 1580, 1999], horsepower: [100, 120, 140, 184, 276] }, 'Tucson': { engineSizes: [1580, 1999], horsepower: [150, 184, 230, 265] }, 'Kona': { engineSizes: [1580], horsepower: [120, 136, 204] } } },
  'Kia': { models: { 'Picanto': { engineSizes: [998, 1248], horsepower: [67, 84, 100] }, 'Rio': { engineSizes: [998, 1368], horsepower: [84, 100, 120] }, 'Ceed': { engineSizes: [1368, 1580, 1999], horsepower: [100, 120, 140, 204] }, 'Sportage': { engineSizes: [1580, 1999], horsepower: [150, 184, 265] }, 'Niro': { engineSizes: [1580], horsepower: [141, 204] } } },
  'Mercedes-Benz': { models: { 'A-Class': { engineSizes: [1332, 1497, 1991], horsepower: [136, 163, 204, 306] }, 'B-Class': { engineSizes: [1332, 1497, 1991], horsepower: [136, 163, 204] }, 'C-Class': { engineSizes: [1497, 1991, 2996], horsepower: [184, 204, 258, 390, 435] }, 'E-Class': { engineSizes: [1991, 2996], horsepower: [211, 258, 340, 435, 612] }, 'GLA': { engineSizes: [1332, 1991], horsepower: [136, 163, 204, 306] }, 'GLB': { engineSizes: [1332, 1991], horsepower: [136, 163, 204, 224] }, 'GLC': { engineSizes: [1991, 2996], horsepower: [204, 258, 313, 390] } } },
  'Nissan': { models: { 'Micra': { engineSizes: [999, 1197], horsepower: [71, 90, 100] }, 'Juke': { engineSizes: [999, 1332, 1598], horsepower: [95, 117, 140, 190] }, 'Qashqai': { engineSizes: [1197, 1598, 1997], horsepower: [115, 130, 140, 160, 190] }, 'X-Trail': { engineSizes: [1997], horsepower: [150, 200] }, 'Leaf': { engineSizes: [0], horsepower: [110, 150, 218] } } },
  'Opel': { models: { 'Corsa': { engineSizes: [1199, 1368, 1499], horsepower: [75, 95, 100, 130, 155] }, 'Astra': { engineSizes: [1199, 1368, 1499, 1998], horsepower: [95, 110, 125, 155, 230] }, 'Insignia': { engineSizes: [1499, 1998, 2994], horsepower: [145, 170, 200, 230, 260] }, 'Mokka': { engineSizes: [1199, 1499], horsepower: [95, 115, 130, 155] }, 'Grandland': { engineSizes: [1499, 1998], horsepower: [130, 175, 230, 300] } } },
  'Peugeot': { models: { '208': { engineSizes: [1199, 1499], horsepower: [75, 100, 130, 155] }, '308': { engineSizes: [1199, 1499, 1997], horsepower: [110, 130, 155, 180, 225] }, '3008': { engineSizes: [1199, 1499, 1997], horsepower: [110, 130, 155, 180, 225] }, '5008': { engineSizes: [1499, 1997], horsepower: [130, 180, 225] } } },
  'Renault': { models: { 'Clio': { engineSizes: [999, 1332, 1461], horsepower: [75, 90, 100, 130, 140] }, 'Captur': { engineSizes: [898, 1332, 1461], horsepower: [90, 100, 130, 140, 155] }, 'Megane': { engineSizes: [1197, 1332, 1461, 1799], horsepower: [100, 115, 130, 140, 160, 280] }, 'Scenic': { engineSizes: [1332, 1461], horsepower: [115, 130, 160] }, 'Arkana': { engineSizes: [1332], horsepower: [140, 160] } } },
  'SEAT': { models: { 'Ibiza': { engineSizes: [999, 1498], horsepower: [80, 95, 110, 150] }, 'Leon': { engineSizes: [999, 1498, 1984], horsepower: [90, 110, 150, 190, 300] }, 'Arona': { engineSizes: [999, 1498], horsepower: [95, 110, 150] }, 'Ateca': { engineSizes: [1498, 1984], horsepower: [116, 150, 190] } } },
  'Škoda': { models: { 'Fabia': { engineSizes: [999, 1498], horsepower: [65, 80, 95, 110, 150] }, 'Octavia': { engineSizes: [999, 1498, 1984, 2891], horsepower: [85, 110, 150, 190, 245] }, 'Superb': { engineSizes: [1498, 1984], horsepower: [150, 190, 218, 272] }, 'Karoq': { engineSizes: [999, 1498, 1984], horsepower: [95, 116, 150, 190] }, 'Kodiaq': { engineSizes: [1498, 1984], horsepower: [150, 190, 240] } } },
  'Toyota': { models: { 'Yaris': { engineSizes: [998, 1490], horsepower: [70, 95, 100, 116, 130] }, 'Corolla': { engineSizes: [1197, 1798, 1987], horsepower: [90, 99, 122, 180] }, 'C-HR': { engineSizes: [1197, 1798], horsepower: [98, 122, 184] }, 'RAV4': { engineSizes: [1987, 2494], horsepower: [175, 218, 302] }, 'Camry': { engineSizes: [2494], horsepower: [218] } } },
  'Volkswagen': { models: { 'Polo': { engineSizes: [999, 1498], horsepower: [65, 80, 95, 110, 207] }, 'Golf': { engineSizes: [999, 1498, 1984, 2891], horsepower: [90, 110, 150, 190, 245, 300] }, 'Tiguan': { engineSizes: [1498, 1984], horsepower: [130, 150, 190, 220, 245] }, 'Passat': { engineSizes: [1498, 1984], horsepower: [150, 190, 218, 272] }, 'T-Roc': { engineSizes: [999, 1498, 1984], horsepower: [115, 150, 190, 221] } } },
  'Volvo': { models: { 'V40': { engineSizes: [1498, 1969, 2497], horsepower: [122, 150, 190, 213] }, 'XC40': { engineSizes: [1477, 1969], horsepower: [150, 163, 211, 262] }, 'XC60': { engineSizes: [1969, 2497], horsepower: [190, 250, 310, 390] }, 'XC90': { engineSizes: [1969, 2497], horsepower: [235, 310, 390] }, 'S60': { engineSizes: [1969, 2497], horsepower: [190, 250, 310, 390] } } },
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

const homeTypes = ['Detached house', 'Semi-detached house', 'Terraced house', 'Apartment', 'Bungalow', 'Farmhouse'];
const roomOptions = [1, 2, 3, 4, 5, 6, 7, 8];
const valueRanges = ['< €100,000', '€100,000 – €200,000', '€200,000 – €350,000', '€350,000 – €500,000', '€500,000 – €750,000', '> €750,000'];

function SelectField({ label, value, onChange, options, placeholder, disabled }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-400 transition"
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, icon: Icon }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
        />
      </div>
    </div>
  );
}

function CarForm({ onSubmitReady }) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [engineSize, setEngineSize] = useState('');
  const [hp, setHp] = useState('');
  const [year, setYear] = useState('');

  const brands = Object.keys(carDatabase).sort();
  const models = brand ? Object.keys(carDatabase[brand].models).sort() : [];
  const engineSizes = brand && model ? carDatabase[brand].models[model].engineSizes : [];
  const horsepowers = brand && model ? carDatabase[brand].models[model].horsepower : [];

  const isReady = brand && model && engineSize && hp && year;

  const handleBrandChange = v => { setBrand(v); setModel(''); setEngineSize(''); setHp(''); };
  const handleModelChange = v => { setModel(v); setEngineSize(''); setHp(''); };

  return (
    <div className="space-y-4">
      <SelectField label="Brand" value={brand} onChange={handleBrandChange} options={brands} placeholder="Select brand" />
      <SelectField label="Model" value={model} onChange={handleModelChange} options={models} placeholder="Select model" disabled={!brand} />
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Engine (cc)"
          value={engineSize}
          onChange={setEngineSize}
          options={engineSizes.map(s => s === 0 ? 'Electric' : `${s} cc`)}
          placeholder="Engine size"
          disabled={!model}
        />
        <SelectField
          label="Horsepower"
          value={hp}
          onChange={setHp}
          options={horsepowers.map(h => `${h} hp`)}
          placeholder="Power"
          disabled={!model}
        />
      </div>
      <SelectField label="Year of registration" value={year} onChange={setYear} options={years} placeholder="Select year" />
      <button
        onClick={() => isReady && onSubmitReady({ type: 'car', brand, model, engineSize, hp, year })}
        disabled={!isReady}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        Get my car insurance quote
      </button>
    </div>
  );
}

function HomeForm({ onSubmitReady }) {
  const [homeType, setHomeType] = useState('');
  const [rooms, setRooms] = useState('');
  const [buildYear, setBuildYear] = useState('');
  const [value, setValue] = useState('');

  const isReady = homeType && rooms && buildYear && value;

  return (
    <div className="space-y-4">
      <SelectField label="Property type" value={homeType} onChange={setHomeType} options={homeTypes} placeholder="Select type" />
      <div className="grid grid-cols-2 gap-4">
        <SelectField label="Bedrooms" value={rooms} onChange={setRooms} options={roomOptions} placeholder="Rooms" />
        <SelectField label="Construction year" value={buildYear} onChange={setBuildYear} options={years} placeholder="Year built" />
      </div>
      <SelectField label="Estimated property value" value={value} onChange={setValue} options={valueRanges} placeholder="Select range" />
      <button
        onClick={() => isReady && onSubmitReady({ type: 'home', homeType, rooms, buildYear, value })}
        disabled={!isReady}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        Get my home insurance quote
      </button>
    </div>
  );
}

function LeadForm({ quoteData, onComplete }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isReady = name.trim() && email.includes('@') && phone.trim();

  const handleSubmit = async () => {
    if (!isReady) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    onComplete({ name, email, phone, ...quoteData });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Almost there! Enter your contact details and an advisor will reach out with a personalised quote.
      </p>
      <InputField label="Full name" value={name} onChange={setName} placeholder="Jane Smith" icon={User} />
      <InputField label="Email address" type="email" value={email} onChange={setEmail} placeholder="jane@example.com" icon={Mail} />
      <InputField label="Phone number" type="tel" value={phone} onChange={setPhone} placeholder="+32 400 000 000" icon={Phone} />
      <button
        onClick={handleSubmit}
        disabled={!isReady || submitting}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {submitting ? 'Sending…' : 'Send my quote request'}
      </button>
    </div>
  );
}

function SuccessPanel({ data }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-500" />
      <h2 className="text-xl font-bold text-gray-900">Quote request received!</h2>
      <p className="text-gray-600 max-w-sm">
        Thanks, <span className="font-semibold">{data.name}</span>! One of our advisors will contact you at{' '}
        <span className="font-semibold">{data.email}</span> within 24 hours with your personalised{' '}
        {data.type === 'car' ? 'car' : 'home'} insurance quote.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 rounded-lg border border-blue-600 px-6 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
      >
        Request another quote
      </button>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('car');
  const [step, setStep] = useState('form');
  const [quoteData, setQuoteData] = useState(null);
  const [finalData, setFinalData] = useState(null);

  const handleQuoteReady = data => {
    setQuoteData(data);
    setStep('lead');
  };

  const handleComplete = data => {
    setFinalData(data);
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
          <Shield className="w-7 h-7 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">InsurancePro</span>
          <span className="ml-auto text-sm text-gray-500 hidden sm:block">Trusted insurance quotes in minutes</span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-2xl px-4 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          Compare & get the best<br />
          <span className="text-blue-600">insurance quote</span> for you
        </h1>
        <p className="mt-3 text-gray-600">
          Fill in the details below and receive a personalised offer from our advisors — completely free.
        </p>
      </section>

      {/* Card */}
      <main className="mx-auto max-w-lg px-4 pb-16">
        <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
          {step !== 'success' && (
            <>
              {/* Tabs */}
              {step === 'form' && (
                <div className="flex border-b">
                  {[
                    { key: 'car', label: 'Car Insurance', Icon: Car },
                    { key: 'home', label: 'Home Insurance', Icon: Home },
                  ].map(({ key, label, Icon }) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-semibold transition border-b-2 ${
                        tab === key
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* Step indicator */}
              {step === 'lead' && (
                <div className="bg-blue-600 px-6 py-4">
                  <p className="text-sm font-medium text-blue-100">Step 2 of 2 — Your contact details</p>
                  <p className="text-white font-semibold mt-0.5">
                    {quoteData?.type === 'car'
                      ? `${quoteData.brand} ${quoteData.model} · ${quoteData.year}`
                      : `${quoteData?.homeType} · ${quoteData?.value}`}
                  </p>
                </div>
              )}
            </>
          )}

          <div className="p-6">
            {step === 'form' && tab === 'car' && <CarForm onSubmitReady={handleQuoteReady} />}
            {step === 'form' && tab === 'home' && <HomeForm onSubmitReady={handleQuoteReady} />}
            {step === 'lead' && <LeadForm quoteData={quoteData} onComplete={handleComplete} />}
            {step === 'success' && <SuccessPanel data={finalData} />}
          </div>
        </div>

        {/* Trust badges */}
        {step === 'form' && (
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-green-500" /> 100% secure & free</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> No obligation</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-green-500" /> Reply within 24h</span>
          </div>
        )}
      </main>
    </div>
  );
}
