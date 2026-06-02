import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Car, Sparkles } from 'lucide-react';

const insuranceTypes = [
  {
    id: 'home-insurance',
    name: 'Home Insurance',
    icon: Home,
    description: 'Protect your home, contents and peace of mind',
    path: '/home-insurance',
    gradient: 'from-blue-500 to-indigo-500',
    glow: 'bg-blue-500/20'
  },
  {
    id: 'car-insurance',
    name: 'Car Insurance',
    icon: Car,
    description: 'Full coverage for your vehicle in minutes',
    path: '/car-insurance',
    gradient: 'from-indigo-500 to-purple-500',
    glow: 'bg-indigo-500/20'
  },
];

export default function InsuranceSelection() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#070B14] text-white overflow-hidden">

      {/* AMBIENT GLOWS */}
      <div className="pointer-events-none absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />

      {/* CONTENT WRAPPER */}
      <div className="relative max-w-5xl mx-auto px-6 py-24">

        {/* HEADER */}
        <div className="text-center mb-14">

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Start your comparison
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold">
            What do you want to insure?
          </h1>

          <p className="mt-4 text-gray-400">
            Choose an option below and get real quotes in minutes
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-8">

          {insuranceTypes.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => navigate(item.path)}
              className="relative cursor-pointer group"
            >

              {/* CARD */}
              <div className="relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition">

                {/* glow background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition ${item.glow}`} />

                {/* icon */}
                <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center bg-white/10 mb-6">
                  <item.icon className="w-7 h-7 text-white" />
                </div>

                {/* title */}
                <h3 className="text-2xl font-bold">
                  {item.name}
                </h3>

                {/* description */}
                <p className="mt-2 text-gray-400">
                  {item.description}
                </p>

                {/* CTA */}
                <div className="mt-6">
                  <div className="inline-flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold group-hover:shadow-xl transition">
                    Start comparison
                  </div>
                </div>

              </div>

            </motion.div>
          ))}

        </div>

        {/* FOOTER NOTE */}
        <div className="text-center mt-16 text-gray-500 text-sm">
           Receive a quote within 24 hours. No spam, we promise.
        </div>

      </div>
    </div>
  );
}