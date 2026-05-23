import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import { Card, InsuranceCard, FeatureCard, StatCard, TestimonialCard, ProviderCard } from '../components/ui/Card';
import FormField from '../components/forms/FormField';
import ImageUpload from '../components/forms/ImageUpload';

const schema = z.object({
  // Step 1: Personal Details
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),

  // Step 2: Car Details
  carMake: z.string().min(1, 'Car make is required'),
  carModel: z.string().min(1, 'Car model is required'),
  year: z.number().min(1990, 'Year must be after 1990'),
  mileage: z.number().min(0, 'Mileage must be positive'),

  // Step 3: Coverage
  coverageType: z.enum(['Third-Party', 'Comprehensive'], {
    errorMap: () => ({ message: 'Coverage type is required' }),
  }),

  // Step 4: Current Provider
  currentProvider: z.string().min(1, 'Provider is required'),
  currentPremium: z.number().min(0, 'Premium must be positive'),
});

export default function CarInsurance() {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleNext = async () => {
    const isValid = await trigger([
      ...(step === 1 ? ['name', 'email', 'phone'] : []),
      ...(step === 2 ? ['carMake', 'carModel', 'year', 'mileage'] : []),
      ...(step === 3 ? ['coverageType'] : []),
    ]);
    if (isValid) setStep(step + 1);
  };

  const handlePrevious = () => setStep(step - 1);

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      console.log('Submitting:', data);
      toast.success('Quote submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit quote.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <div className="p-6">
              {/* Progress Steps */}
              <div className="flex justify-between mb-8">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      s <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Personal Details */}
                {step === 1 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Personal Details
                    </h2>
                    <FormField
                      label="Full Name"
                      id="name"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <FormField
                      label="Email"
                      id="email"
                      type="email"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                    <FormField
                      label="Phone"
                      id="phone"
                      type="tel"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                  </>
                )}

                {/* Step 2: Car Details */}
                {step === 2 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Car Details
                    </h2>
                    <FormField
                      label="Car Make"
                      id="carMake"
                      error={errors.carMake?.message}
                      {...register('carMake')}
                    />
                    <FormField
                      label="Car Model"
                      id="carModel"
                      error={errors.carModel?.message}
                      {...register('carModel')}
                    />
                    <FormField
                      label="Year"
                      id="year"
                      type="number"
                      error={errors.year?.message}
                      {...register('year', { valueAsNumber: true })}
                    />
                    <FormField
                      label="Mileage (km)"
                      id="mileage"
                      type="number"
                      error={errors.mileage?.message}
                      {...register('mileage', { valueAsNumber: true })}
                    />
                  </>
                )}

                {/* Step 3: Coverage */}
                {step === 3 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Coverage Preferences
                    </h2>
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Coverage Type
                      </label>
                      <select
                        id="coverageType"
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        {...register('coverageType')}
                      >
                        <option value="">Select coverage type</option>
                        <option value="Third-Party">Third-Party</option>
                        <option value="Comprehensive">Comprehensive</option>
                      </select>
                      {errors.coverageType && (
                        <p className="text-sm text-red-500">
                          {errors.coverageType.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Step 4: Current Provider */}
                {step === 4 && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Current Insurance
                    </h2>
                    <FormField
                      label="Current Provider"
                      id="currentProvider"
                      error={errors.currentProvider?.message}
                      {...register('currentProvider')}
                    />
                    <FormField
                      label="Current Premium (€)"
                      id="currentPremium"
                      type="number"
                      error={errors.currentPremium?.message}
                      {...register('currentPremium', { valueAsNumber: true })}
                    />
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      type="button"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                  )}
                  {step < 4 ? (
                    <Button
                      onClick={handleNext}
                      type="button"
                      className="ml-auto"
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      className="ml-auto"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
