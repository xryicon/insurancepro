import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  onClick,
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect ? { y: -6 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        relative
        rounded-2xl
        ${padding}
        bg-white/5
        border border-white/10
        backdrop-blur-xl
        shadow-lg
        hover:bg-white/10
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <Card hoverEffect className="text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>

      <h3 className="text-lg font-semibold text-white">{title}</h3>

      <p className="text-sm text-gray-400 mt-2">{description}</p>
    </Card>
  );
};

export { Card, FeatureCard };