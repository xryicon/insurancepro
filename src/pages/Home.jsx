import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Euro,
  CheckCircle2,
} from 'lucide-react';

import Button from '../components/ui/Button';
import { FeatureCard } from '../components/ui/Card';
import { Link } from 'react-router-dom';

const bg =
  'https://raw.githubusercontent.com/xryicon/insurancepro/main/src/assets/images/main%20background%20hero.jpg';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Save money on insurance in Spain with InsurancePro</title>
      </Helmet>

      {/* PAGE WRAPPER */}
      <div className="relative min-h-screen bg-[#070B14] text-white overflow-hidden">

        {/* AMBIENT GLOWS */}
        <div className="pointer-events-none absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="pointer-events-none absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />

        {/* HERO */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

          {/* BACKGROUND IMAGE */}
          <div
            className="absolute inset-0 scale-110"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-[#070B14]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070B14]/40 to-[#070B14]" />

          {/* CONTENT */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

            {/* BADGE */}
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
              Trusted insurance comparison platform
            </div>

            {/* TITLE */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-5xl md:text-7xl font-extrabold leading-tight"
            >
              Compare insurance &
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                save instantly
              </span>
            </motion.h1>

            {/* CTA */}
            <div className="mt-10 flex justify-center">
              <Link to="/quote">
                <Button size="lg" variant="primary">
                  Start comparison
                </Button>
              </Link>
            </div>

            {/* TRUST ROW */}
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Free comparison
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Fast results
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Trusted insurers
              </span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="relative py-28 border-t border-white/5 overflow-hidden">
          {/* SOFT GLOW BACKGROUND */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/10 blur-[160px]" />
          </div>

          {/* HEADER */}
          <div className="max-w-6xl mx-auto px-6 text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Why people switch to us
            </h2>
            <p className="text-gray-400 mt-4 text-lg">
              Compare faster, pay less, and avoid overpaying in minutes
            </p>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {/* CARD 1 */}
            <div className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/40">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" d="M12 6v6l4 2" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Save time instantly
                </h3>
                <p className="text-gray-400 mt-2 leading-relaxed">
                  Get real insurance quotes in under 24 hours.
                </p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-indigo-400/40">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                  <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" d="M9 12l2 2 4-4" />
                    <path strokeWidth="2" d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Fully trusted insurers
                </h3>
                <p className="text-gray-400 mt-2 leading-relaxed">
                  We only show regulated insurance providers operating in Spain.
                </p>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400/40">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                  <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" d="M3 17l6-6 4 4 8-8" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Lower your insurance cost
                </h3>
                <p className="text-gray-400 mt-2 leading-relaxed">
                  Compare multiple offers and instantly find cheaper coverage.
                </p>
              </div>
            </div>
          </div>

          {/* MINI CTA */}
          <div className="mt-14 text-center">
            <p className="text-gray-400 mb-4">
              Ready to see your savings?
            </p>
            <a href="/quote" className="inline-flex px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-400 transition shadow-lg hover:shadow-blue-500/30">
              Start comparison
            </a>
          </div>
        </section>
      </div>
    </>
  );
}