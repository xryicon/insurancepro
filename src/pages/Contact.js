// src/pages/Contact.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import FormField from '../components/forms/FormField';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    telephone: '',
    query: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.telephone.trim()) newErrors.telephone = 'Telephone is required';
    if (!formData.query.trim()) newErrors.query = 'Query is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('https://formspree.io/f/xbdbkgap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', telephone: '', query: '' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thank you!</h2>
          <p className="text-gray-600">We will contact you soon.</p>
          <Button onClick={() => window.history.back()} className="mt-4">Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              type="text"
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              error={errors.name}
            />
            <FormField
              type="tel"
              name="telephone"
              label="Telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="+34 600 000 000"
              required
              error={errors.telephone}
            />
            <FormField
              type="textarea"
              name="query"
              label="Your Query"
              value={formData.query}
              onChange={handleChange}
              placeholder="How can we help you?"
              required
              error={errors.query}
              rows={5}
            />
            <Button type="submit" loading={isSubmitting} className="w-full">
              Send Query
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
