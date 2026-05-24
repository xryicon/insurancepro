import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Home, Car } from 'lucide-react';

const insuranceTypes = [
  {
    id: 'home-insurance',
    name: 'Home Insurance',
    icon: Home,
    description: 'Protect your home and belongings',
    path: '/home-insurance'
  },
  {
    id: 'car-insurance',
    name: 'Car Insurance',
    icon: Car,
    description: 'Coverage for your vehicle',
    path: '/car-insurance'
  },
];

const InsuranceSelection = () => {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Get a Quote
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Choose the type of insurance you need
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insuranceTypes.map((insurance) => (
              <Card
                key={insurance.id}
                className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSelect(insurance.path)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <insurance.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {insurance.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {insurance.description}
                  </p>
                  <Button variant="outline">
                    Get Quote
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InsuranceSelection;
