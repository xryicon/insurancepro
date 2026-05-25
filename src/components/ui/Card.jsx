import React from 'react';
import { motion } from 'framer-motion';

// ========== ANIMATION VARIANTS ==========
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    y: -8,
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.3 }
  }
};

// ========== BASE CARD COMPONENT ==========
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

// ========== INSURANCE CARD COMPONENT ==========
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

// ========== FEATURE CARD COMPONENT (UPDATED) ==========
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color = 'blue',
  delay = 0,
  className = '',
}) => {
  const colorConfig = {
    blue: {
      bg: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-50',
      iconText: 'text-blue-600',
      titleText: 'text-blue-900',
    },
    green: {
      bg: 'from-green-50 to-green-100',
      iconBg: 'bg-green-50',
      iconText: 'text-green-600',
      titleText: 'text-green-900',
    }
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      custom={delay}
      className={`w-full max-w-sm p-8 rounded-xl text-center
        bg-gradient-to-br ${config.bg}
        shadow-lg ${className}`}
      style={{ transition: 'all 0.5s ease' }}
    >
      <div className={`w-14 h-14 ${config.iconBg} rounded-xl
        flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-7 h-7 ${config.iconText}`} />
      </div>
      <h3 className={`text-xl font-semibold ${config.titleText} mb-3`}>
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </motion.div>
  );
};

// ========== STAT CARD COMPONENT ==========
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

// ========== TESTIMONIAL CARD COMPONENT ==========
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

// ========== PROVIDER CARD COMPONENT ==========
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

// ========== EXPORTS ==========
export {
  Card,
  InsuranceCard,
  FeatureCard,
  StatCard,
  TestimonialCard,
  ProviderCard,
};
