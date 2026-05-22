import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  shadow = 'shadow-sm',
  border = false,
  onClick,
  cursor = 'default',
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect ? { y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl transition-all duration-300 ${
        shadow
      } ${border ? 'border border-gray-100' : ''} ${padding} ${className}`}
      style={{ cursor }}
    >
      {children}
    </motion.div>
  );
};

// Insurance Card Component
const InsuranceCard = ({
  icon: Icon,
  title,
  description,
  save,
  color = 'blue',
  onClick,
  className = '',
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card
      hoverEffect
      onClick={onClick}
      cursor="pointer"
      className={`group ${className}`}
    >
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color] || colorClasses.blue} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-semibold text-sm">{save}</span>
            <span className="text-gray-400 text-xs">savings</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Feature Card Component
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  className = '',
}) => {
  return (
    <Card hoverEffect className={className}>
      <div className="text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Icon className="w-7 h-7 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Card>
  );
};

// Stat Card Component
const StatCard = ({
  number,
  label,
  icon: Icon,
  className = '',
}) => {
  return (
    <Card className={`text-center ${className}`}>
      {Icon && (
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      )}
      <div className="text-3xl font-bold text-gray-900 mb-1">{number}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </Card>
  );
};

// Testimonial Card Component
const TestimonialCard = ({
  name,
  location,
  rating,
  comment,
  date,
  className = '',
}) => {
  return (
    <Card className={`group ${className}`}>
      <div className="flex items-center mb-3">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{comment}</p>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-gray-900 text-sm">{name}</div>
          <div className="text-gray-500 text-xs">{location}</div>
        </div>
        <div className="text-gray-400 text-xs">{date}</div>
      </div>
    </Card>
  );
};

// Provider Card Component
const ProviderCard = ({
  name,
  logo,
  className = '',
}) => {
  return (
    <Card
      hoverEffect
      className={`flex items-center justify-center p-4 ${className}`}
    >
      {logo ? (
        <img src={logo} alt={name} className="h-8 object-contain" />
      ) : (
        <div className="text-gray-400 font-medium">{name}</div>
      )}
    </Card>
  );
};

export {
  Card,
  InsuranceCard,
  FeatureCard,
  StatCard,
  TestimonialCard,
  ProviderCard,
};
