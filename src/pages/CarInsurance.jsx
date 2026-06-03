import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import FormField from '../components/forms/FormField';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const formatDate = (value) => {
  if (!value) return value;

  const v = value.replace(/\D/g, '').substring(0, 8);

  if (v.length <= 2) return v;
  if (v.length <= 4) return `${v.substring(0, 2)}/${v.substring(2)}`;

  return `${v.substring(0, 2)}/${v.substring(2, 4)}/${v.substring(4)}`;
};

const schema = z.object({
  fullName: z.string().min(1),
  dateOfBirth: z.string().min(1),
  nationality: z.string().min(1),
  nieNumber: z.string().min(1),
  dateOfCarLicense: z.string().min(1),
  nationalityOfCarLicense: z.string().min(1),
  address: z.string().min(1),
  postcode: z.string().min(1),
  email: z.string().email(),
  telephone: z.string().min(1),

  carMake: z.string().min(1),
  carModel: z.string().min(1),
  year: z.coerce.number().min(1990),
  horsepower: z.coerce.number().min(1),
  engineSize: z.coerce.number().min(1),
  registration: z.string().min(1),
  transmissionType: z.enum(['Manual', 'Automatic', 'Hybrid', 'Full Electric']),

  currentCompany: z.string().min(1),
  currentPremium: z.coerce.number().min(0),
  currentCover: z.string().min(1),
});

export default function CarInsurance() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    getValues,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      dateOfCarLicense: formatDate(
        new Date().toLocaleDateString('en-GB').replace(/\//g, '')
      ),
      transmissionType: 'Manual',
      nationalityOfCarLicense: '',
    },
  });

  const dateOfBirth = watch('dateOfBirth');
  const dateOfCarLicense = watch('dateOfCarLicense');
  const nationality = watch('nationality');

  useEffect(() => {
    if (dateOfBirth) {
      setValue('dateOfBirth', formatDate(dateOfBirth), {
        shouldValidate: false,
      });
    }
  }, [dateOfBirth, setValue]);

  useEffect(() => {
    if (dateOfCarLicense) {
      setValue('dateOfCarLicense', formatDate(dateOfCarLicense), {
        shouldValidate: false,
      });
    }
  }, [dateOfCarLicense, setValue]);

  useEffect(() => {
    if (nationality) {
      setValue('nationalityOfCarLicense', nationality);
    }
  }, [nationality, setValue]);

  const steps = [
    { number: 1, label: 'Personal Info' },
    { number: 2, label: 'Car Details' },
    { number: 3, label: 'Current Insurance' },
    { number: 4, label: 'Review & Submit' },
  ];

  const handleNext = async () => {
    const fields = {
      1: [
        'fullName',
        'dateOfBirth',
        'nationality',
        'nieNumber',
        'dateOfCarLicense',
        'nationalityOfCarLicense',
        'address',
        'postcode',
        'email',
        'telephone',
      ],
      2: [
        'carMake',
        'carModel',
        'year',
        'registration',
        'horsepower',
        'engineSize',
        'transmissionType',
      ],
      3: ['currentCompany', 'currentPremium', 'currentCover'],
    }[step];

    const valid = await trigger(fields, { shouldFocus: true });

    if (!valid) {
      toast.error('Please complete all fields');
      return;
    }

    setStep((s) => s + 1);
  };

  const handlePrevious = () => setStep((s) => s - 1);

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase.from('leads').insert([
        {
          full_name: data.fullName,
          email: data.email,
          phone: data.telephone || null,
          address: data.address,

          lead_type: 'car',
          status: 'new',
          source: 'car_insurance_form',

          data: {
            nationality: data.nationality,
            date_of_birth: data.dateOfBirth,
            nie_number: data.nieNumber,
            date_of_car_license: data.dateOfCarLicense,
            nationality_of_car_license: data.nationalityOfCarLicense,
            postal_code: data.postcode,

            car_make: data.carMake,
            car_model: data.carModel,
            year: data.year,
            horsepower: data.horsepower,
            engine_size: data.engineSize,
            registration: data.registration,
            transmission_type: data.transmissionType,

            current_company: data.currentCompany,
            current_premium: data.currentPremium ? parseFloat(data.currentPremium) : null,
            current_cover: data.currentCover
          }
        }
      ]);

      if (error) {
        console.error(error);
        toast.error(error.message);
        return;
      }

      toast.success('Car insurance quote submitted!');

      setSubmitSuccess(true);

    } catch (err) {
      console.error(err);
      toast.error('Submission failed');
    }
  };

  const allValues = getValues();

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white">
        <Card className="p-10 bg-slate-900 border-slate-800 text-center max-w-2xl">
          <Check className="w-10 h-10 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl mb-4">Quote Request Submitted!</h2>
          <p className="text-slate-400 mb-8">
            Thank you for your request. We will contact you within 24 hours.
          </p>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/')}>Back to Home</Button>
            <Button variant="ghost" onClick={() => navigate('/quote')}>
              Start New Quote
            </Button>
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

          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center text-slate-400"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {/* PROGRESS BAR */}
          <div className="mb-10 relative">
            <div className="h-1 bg-slate-800 rounded">
              <div
                className="h-1 bg-indigo-500 transition-all"
                style={{
                  width: `${((step - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between mt-4">
              {steps.map((s) => (
                <div key={s.number} className="text-center">
                  <div
                    className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center ${
                      step >= s.number ? 'bg-indigo-500' : 'bg-slate-700'
                    }`}
                  >
                    {s.number}
                  </div>
                  <div className="text-xs mt-1 text-slate-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-slate-900 border-slate-800 p-8">

            <form id="form" onSubmit={handleSubmit(onSubmit)}>

              {step === 4 ? (
                <div className="space-y-6 text-slate-300">

                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-white font-medium mb-3">
                      Personal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>Full name: {allValues.fullName}</div>
                      <div>Date of Birth: {allValues.dateOfBirth}</div>
                      <div>Nationality: {allValues.nationality}</div>
                      <div>NIE: {allValues.nieNumber}</div>
                      <div>License Date: {allValues.dateOfCarLicense}</div>
                      <div>License Nationality: {allValues.nationalityOfCarLicense}</div>
                      <div>Email: {allValues.email}</div>
                      <div>Phone: {allValues.telephone}</div>
                      <div className="md:col-span-2">Address: {allValues.address}</div>
                      <div className="md:col-span-2">Postcode: {allValues.postcode}</div>
                    </div>
                  </div>

                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-white font-medium mb-3">
                      Car Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>Make: {allValues.carMake}</div>
                      <div>Model: {allValues.carModel}</div>
                      <div>Year: {allValues.year}</div>
                      <div>Plate: {allValues.registration}</div>
                      <div>HP: {allValues.horsepower}</div>
                      <div>Engine: {allValues.engineSize}</div>
                      <div className="md:col-span-2">
                        Transmission: {allValues.transmissionType}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">
                      Insurance Information
                    </h3>

                    <div className="grid gap-4">
                      <div>Provider: {allValues.currentCompany}</div>
                      <div>Premium: {allValues.currentPremium}</div>
                      <div>Cover: {allValues.currentCover}</div>
                    </div>
                  </div>

                </div>
              ) : (
                <>
                  <div className="space-y-6 text-white">

                    {/* STEP 1 */}
                    {step === 1 && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField {...register('fullName')} label="Full name" />
                        <FormField {...register('dateOfBirth')} label="Date of Birth" />
                        <FormField {...register('nationality')} label="Nationality" />
                        <FormField {...register('nieNumber')} label="NIE" />
                        <FormField {...register('dateOfCarLicense')} label="License Date" />
                        <FormField {...register('nationalityOfCarLicense')} label="License Nationality" />
                        <FormField {...register('email')} label="Email" />
                        <FormField {...register('telephone')} label="Phone" />
                        <FormField {...register('address')} label="Address" className="md:col-span-2" />
                        <FormField {...register('postcode')} label="Postcode" className="md:col-span-2" />
                      </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField {...register('carMake')} label="Make" />
                        <FormField {...register('carModel')} label="Model" />
                        <FormField {...register('year', { valueAsNumber: true })} label="Year" type="number" />
                        <FormField {...register('registration')} label="Plate" />
                        <FormField {...register('horsepower', { valueAsNumber: true })} label="HP" type="number" />
                        <FormField {...register('engineSize', { valueAsNumber: true })} label="Engine" type="number" />

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">
                            Transmission
                          </label>

                          <select
                            {...register('transmissionType')}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
                          >
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Full Electric">Full Electric</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                      <div className="grid gap-6">
                        <FormField {...register('currentCompany')} label="Current Provider" />
                        <FormField {...register('currentPremium', { valueAsNumber: true })} label="Premium" type="number" />
                        <FormField {...register('currentCover')} label="Cover" />
                      </div>
                    )}

                  </div>

                  <div className="flex justify-between mt-8 border-t border-slate-800 pt-6">
                    {step > 1 && (
                      <Button type="button" variant="ghost" onClick={handlePrevious}>
                        <ChevronLeft /> Back
                      </Button>
                    )}

                    {step < 4 && (
                      <Button type="button" onClick={handleNext}>
                        Next <ChevronRight />
                      </Button>
                    )}
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
                  <Button type="submit" loading={isSubmitting}>
                    Submit Quote Request
                  </Button>
                )}
              </div>

            </form>
          </Card>
        </div>
      </div>
    </>
  );
}