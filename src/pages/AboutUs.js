// src/pages/AboutUs.js
import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
          <p className="text-gray-600 mb-4">
            We are a leading insurance comparison service helping you find the best coverage at the best prices.
          </p>
          <p className="text-gray-600 mb-8">
            Our mission is to make insurance simple, transparent, and affordable for everyone.
          </p>
          <Button onClick={() => window.history.back()}>Back</Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
