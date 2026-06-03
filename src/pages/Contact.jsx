import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, User, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

function Contact() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    query: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ SUPABASE VERSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('leads').insert([
        {
          full_name: formData.name,
          email: formData.email,
          phone: formData.telephone || null,

          lead_type: 'contact',
          status: 'new',
          source: 'contact_form',

          data: {
            message: formData.query
          }
        }
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        telephone: '',
        query: ''
      });

    } catch (error) {
      console.error('Supabase error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-green-400 mb-4">
            {t('thank_you') || 'Thank you'}
          </h2>

          <p className="text-gray-400">
            {t('we_will_contact_you_soon') || 'We will contact you soon.'}
          </p>

          <button
            onClick={() => setSubmitSuccess(false)}
            className="mt-6 px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition"
          >
            {t('back') || 'Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white relative overflow-hidden">

      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />

      <div className="relative max-w-3xl mx-auto px-6 py-20">

        <h1 className="text-4xl font-bold text-center mb-10">
          {t('contact_us') || 'Contact us'}
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="text-sm text-gray-300 flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                {t('name')}
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                {t('telephone')}
              </label>

              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" />
                {t('your_query')}
              </label>

              <textarea
                name="query"
                value={formData.query}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send message'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;