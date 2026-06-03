import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, TrendingUp, Sparkles } from 'lucide-react';

export default function AboutUs() {
  return (
    <>
      <Helmet>
        <title>About InsurancePro | Smart Insurance Comparison Spain</title>
        <meta
          name="description"
          content="Learn how InsurancePro helps people in Spain save money on insurance with fast, transparent comparisons."
        />
      </Helmet>

      {/* PAGE WRAPPER */}
      <div className="relative min-h-screen bg-[#070B14] text-white overflow-hidden">

        {/* GLOW BACKGROUND */}
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />

        {/* ================= HERO ================= */}
        <section className="relative py-28 text-center">

          <div className="max-w-4xl mx-auto px-6">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Built for smarter insurance decisions in Spain
            </div>

            {/* TITLE */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-5xl md:text-6xl font-extrabold"
            >
              About <span className="text-blue-400">InsurancePro</span>
            </motion.h1>

            {/* SUBTEXT */}
            <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
              A faster, simpler way to compare insurance and save money — without confusion, or hidden fees.
            </p>

          </div>
        </section>

        {/* ================= STORY ================= */}
        <section className="relative py-20">

          <div className="max-w-5xl mx-auto px-6">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">

              <h2 className="text-2xl font-bold mb-6">
                Our Story
              </h2>

              <p className="text-gray-300 leading-relaxed mb-4">
                A few years ago, I struggled to compare insurance in Spain — everything was slow, unclear, and full of hidden terms.
              </p>

              <p className="text-gray-300 leading-relaxed mb-4">
                That frustration led to the creation of <span className="text-white font-semibold">InsurancePro</span>, a platform focused on clarity, speed, and real savings.
              </p>

              <p className="text-gray-300 leading-relaxed">
                Today, our mission is simple: help people in Spain find better insurance in minutes, not hours.
              </p>

            </div>

          </div>
        </section>

        {/* ================= VALUE GRID ================= */}
        <section className="relative py-20">

          <div className="max-w-6xl mx-auto px-6">

            <h2 className="text-center text-3xl font-bold mb-12">
              Why people trust us
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              {/* CARD 1 */}
              <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <TrendingUp className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Fast comparisons</h3>
                <p className="text-gray-400">
                  Get real insurance quotes in under 24 hours.
                </p>
              </div>

              {/* CARD 2 */}
              <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <ShieldCheck className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trusted providers</h3>
                <p className="text-gray-400">
                  Only verified insurance companies in Spain.
                </p>
              </div>

              {/* CARD 3 */}
              <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <Heart className="w-8 h-8 text-pink-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Save money</h3>
                <p className="text-gray-400">
                  Users typically reduce costs by up to 40%.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ================= FOUNDER ================= */}
        <section className="relative py-24">

          <div className="max-w-4xl mx-auto px-6 text-center">

            <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">

              <h2 className="text-2xl font-bold mb-4">
                Meet the Founder
              </h2>

              <p className="text-gray-300 leading-relaxed">
                Hi, I’m <span className="text-white font-semibold">Dylan</span>. I built InsurancePro after seeing how confusing insurance in Spain can be. My goal is simple: make insurance transparent, fast, and fair for everyone.
              </p>

            </div>

          </div>
        </section>

      </div>
    </>
  );
}