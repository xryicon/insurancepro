import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, TrendingUp } from 'lucide-react';

export default function AboutUs() {
  return (
    <>
      <Helmet>
        <title>About Us | InsurancePro - Your Trusted Insurance Partner in Spain</title>
        <meta
          name="description"
          content="Learn about InsurancePro: a mission-driven platform to help you save money on insurance in Spain. Created by Dylan Van Wesemael."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 sm:text-5xl"
          >
            About <span className="text-blue-600">InsurancePro</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Helping you save money on insurance in Spain — the easy way.
          </motion.p>
        </div>

        {/* Our Story Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8 lg:p-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                A few years ago, I found myself struggling to find a <strong>simple, transparent, and affordable</strong> way to compare insurance quotes in Spain. Most websites were either too complicated, lacked clear pricing, or didn’t cater to expats and locals alike.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                That’s why I created <strong>InsurancePro</strong> — to give people a <strong>fast, easy, and trustworthy</strong> way to compare insurance options and save money. No jargon, no hidden fees, just the best deals tailored to your needs.
              </p>
              <p className="text-lg text-gray-600">
                Whether you’re looking for car, home, or other types of insurance, we’ve got you covered. Our mission is to make insurance simple, accessible, and affordable for everyone in Spain.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-3xl font-bold text-gray-900 text-center mb-12"
            >
              Why Choose InsurancePro?
            </motion.h2>
            <div className="grid gap-8 md:grid-cols-3">
              {/* Simple & Fast */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Simple & Fast
                </h3>
                <p className="text-gray-600">
                  Compare quotes in minutes with our easy-to-use platform. No complicated forms or endless paperwork.
                </p>
              </motion.div>

              {/* Trusted Partners */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Trusted Partners
                </h3>
                <p className="text-gray-600">
                  We work with the best insurance providers in Spain to bring you reliable, high-quality coverage.
                </p>
              </motion.div>

              {/* Save Money */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Save Money
                </h3>
                <p className="text-gray-600">
                  Our platform helps you find the best rates, so you can save up to 40% on your insurance premiums.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="bg-white rounded-xl shadow-lg p-8 lg:p-12 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Meet the Founder
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Hi, I’m <strong>Dylan</strong>, the creator of InsurancePro. After years of frustration trying to navigate the complex world of insurance in Spain, I decided to build a solution that puts <strong>you</strong> first. My goal is to make insurance simple, transparent, and affordable for everyone.
              </p>
              <p className="text-lg text-gray-600">
                If you have any questions or feedback, feel free to reach out. I’d love to hear from you!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
