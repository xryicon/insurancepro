import { Card } from '../components/ui/Card';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] py-16">
      <div className="max-w-4xl mx-auto px-6">

        <Card className="p-8 bg-slate-900 border-slate-800 text-slate-300">

          <h1 className="text-3xl font-bold text-white mb-6">
            Privacy Policy
          </h1>

          {/* INTRO */}
          <p className="mb-6">
            This Privacy Policy explains how we collect, use, and protect your personal data when you use our insurance comparison platform.
            We are committed to complying with the General Data Protection Regulation (GDPR).
          </p>

          {/* DATA WE COLLECT */}
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">
            1. Data We Collect
          </h2>

          <p className="mb-2">We may collect the following personal data:</p>

          <ul className="list-disc pl-6 space-y-1">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Address and postal code</li>
            <li>Vehicle information (e.g. registration plate, make, model)</li>
            <li>Property information (e.g. home type, size, construction details)</li>
            <li>Insurance-related details submitted via quote forms</li>
            <li>Messages submitted via our contact form</li>
          </ul>

          {/* HOW WE USE DATA */}
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">
            2. How We Use Your Data
          </h2>

          <ul className="list-disc pl-6 space-y-1">
            <li>To provide insurance comparison services</li>
            <li>To generate and manage insurance quotes</li>
            <li>To contact you regarding your request</li>
            <li>To improve our services and user experience</li>
            <li>To comply with legal and regulatory obligations</li>
          </ul>

          {/* LEGAL BASIS */}
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">
            3. Legal Basis for Processing
          </h2>

          <p className="mb-4">
            We process your personal data based on:
          </p>

          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Consent</strong> – when you submit forms or accept cookies</li>
            <li><strong>Contractual necessity</strong> – to provide requested insurance quotes</li>
            <li><strong>Legitimate interest</strong> – to operate and improve our platform</li>
          </ul>

          {/* DATA STORAGE */}
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">
            4. Data Storage & Retention
          </h2>

          <p className="mb-4">
            All personal data is securely stored in our database provider (Supabase).
          </p>

          <p className="mb-4">
            We retain insurance-related data for up to <strong>12 months</strong> after submission,
            unless a longer retention period is required for legal or regulatory reasons.
          </p>

          {/* SHARING DATA */}
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">
            5. Data Sharing
          </h2>

          <p className="mb-4">
            We do not sell your personal data. Data may only be shared with:
          </p>

          <ul className="list-disc pl-6 space-y-1">
            <li>Insurance partners (to provide quotes if applicable)</li>
            <li>Service providers (e.g. Supabase for secure data hosting)</li>
            <li>Legal authorities if required by law</li>
          </ul>

          {/* COOKIES */}
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">
            6. Cookies
          </h2>

          <p className="mb-4">
            We use cookies to:
          </p>

          <ul className="list-disc pl-6 space-y-1">
            <li>Enable essential website functionality</li>
            <li>Remember user preferences</li>
            <li>Measure website performance (if analytics enabled)</li>
          </ul>

          <p className="mb-4">
            You can manage or withdraw your consent at any time through your browser settings or our cookie banner.
          </p>

          {/* USER RIGHTS */}
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">
            7. Your Rights (GDPR)
          </h2>

          <p className="mb-2">You have the right to:</p>

          <ul className="list-disc pl-6 space-y-1">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data ("right to be forgotten")</li>
            <li>Withdraw consent at any time</li>
            <li>Request data portability</li>
          </ul>

          {/* SECURITY */}
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">
            8. Data Security
          </h2>

          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal data,
            including secure database storage and access control.
          </p>

          {/* CONTACT */}
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">
            9. Contact
          </h2>

          <p className="mb-2">
            For any privacy-related requests, you can contact us via our contact form.
          </p>

          <p>
            We will respond within a reasonable timeframe in accordance with GDPR requirements.
          </p>

          <p className="mt-8 text-xs text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>

        </Card>
      </div>
    </div>
  );
}