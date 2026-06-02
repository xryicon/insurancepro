import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../components/ui/Card';

const faqItems = [
  {
    question: "How do I get a quote?",
    answer: "Simply fill out our online form with your details and we'll provide you with personalized insurance quotes within 24 hours."
  },
  {
    question: "What information do I need to provide?",
    answer: "You'll need your personal details, property or vehicle information, and current insurance details if applicable."
  },
  {
    question: "How long does it take to process my application?",
    answer: "Most applications are processed within 24-48 hours. Complex cases may take slightly longer."
  },
  {
    question: "Can I cancel my policy at any time?",
    answer: "Yes, you can cancel your policy at any time. Please refer to our terms and conditions for any applicable fees."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, credit/debit cards, and direct debit payments."
  },
  {
    question: "How do I make a claim?",
    answer: "Contact our claims department directly at claims@yourcompany.com or call +34 123 456 789."
  }
];

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleItem = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] py-16">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="p-8 bg-slate-900 border-slate-800">
          <h1 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h1>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border-b border-slate-800 pb-4"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {expandedIndex === index && (
                  <div className="mt-4">
                    <p className="text-slate-400">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}