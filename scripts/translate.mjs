import axios from 'axios';
import fs from 'fs';

// Your English text - ALL text from your AboutUs page
const en = {
  // Meta tags
  'about_us_title': 'About Us | InsurancePro - Your Trusted Insurance Partner in Spain',
  'about_us_description': 'Learn about InsurancePro: a mission-driven platform to help you save money on insurance in Spain. Created by Dylan Van Wesemael.',

  // Hero section
  'about': 'About',
  'insurance_pro': 'InsurancePro',
  'tagline': 'Helping you save money on insurance in Spain — the easy way.',

  // Our Story section
  'our_story': 'Our Story',
  'story_part1': 'A few years ago, I found myself struggling to find a',
  'simple_transparent_affordable': 'simple, transparent, and affordable',
  'story_part2': 'way to compare insurance quotes in Spain. Most websites were either too complicated, lacked clear pricing, or didn\'t cater to expats and locals alike.',
  'that_why': 'That\'s why I created',
  'fast_easy_trustworthy': 'fast, easy, and trustworthy',
  'story_part3': 'way to compare insurance options and save money. No jargon, no hidden fees, just the best deals tailored to your needs.',
  'mission': 'Whether you\'re looking for car, home, or other types of insurance, we\'ve got you covered. Our mission is to make insurance simple, accessible, and affordable for everyone in Spain.',

  // Why Choose Us section
  'why_choose': 'Why Choose InsurancePro?',
  'simple_fast': 'Simple & Fast',
  'simple_fast_desc': 'Compare quotes in minutes with our easy-to-use platform. No complicated forms or endless paperwork.',
  'trusted_partners': 'Trusted Partners',
  'trusted_partners_desc': 'We work with the best insurance providers in Spain to bring you reliable, high-quality coverage.',
  'save_money': 'Save Money',
  'save_money_desc': 'Our platform helps you find the best rates, so you can save up to 40% on your insurance premiums.',

  // Founder section
  'meet_founder': 'Meet the Founder',
  'hi_im': 'Hi, I\'m',
  'dylan': 'Dylan',
  'founder_story': 'the creator of InsurancePro. After years of frustration trying to navigate the complex world of insurance in Spain, I decided to build a solution that puts',
  'you': 'you',
  'founder_goal': 'first. My goal is to make insurance simple, transparent, and affordable for everyone.',
  'contact': 'If you have any questions or feedback, feel free to reach out. I\'d love to hear from you!'
};

// 1. Save English translations
fs.writeFileSync('src/en-translation.json', JSON.stringify(en, null, 2));
console.log('✅ English translations saved');

// 2. Translate to Spanish
console.log('🔄 Translating to Spanish...');
const es = {};
for (const [key, value] of Object.entries(en)) {
  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q: value,
      source: 'en',
      target: 'es'
    });
    es[key] = response.data.translatedText || value;
  } catch (e) {
    console.error(`⚠️ Error translating "${value}" to Spanish:`, e.message);
    es[key] = value; // Fallback to English
  }
  // Rate limiting: wait 0.5 seconds between requests
  await new Promise(resolve => setTimeout(resolve, 500));
}
fs.writeFileSync('src/es-translation.json', JSON.stringify(es, null, 2));
console.log('✅ Spanish translations saved');

// 3. Translate to Dutch
console.log('🔄 Translating to Dutch...');
const nl = {};
for (const [key, value] of Object.entries(en)) {
  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q: value,
      source: 'en',
      target: 'nl'
    });
    nl[key] = response.data.translatedText || value;
  } catch (e) {
    console.error(`⚠️ Error translating "${value}" to Dutch:`, e.message);
    nl[key] = value; // Fallback to English
  }
  // Rate limiting: wait 0.5 seconds between requests
  await new Promise(resolve => setTimeout(resolve, 500));
}
fs.writeFileSync('src/nl-translation.json', JSON.stringify(nl, null, 2));
console.log('✅ Dutch translations saved');

console.log('🎉 All translations completed successfully!');
