import { Check, Award, Clock, Headphones, Car, Home as HomeIcon, Shield, Star, Users, TrendingUp } from 'lucide-react';
// Nationality options
export const nationalityOptions = [
  { value: 'spanish', label: 'Spanish' },
  { value: 'british', label: 'British' },
  { value: 'dutch', label: 'Dutch' },
  { value: 'german', label: 'German' },
  { value: 'french', label: 'French' },
  { value: 'belgian', label: 'Belgian' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'italian', label: 'Italian' },
  { value: 'otherEU', label: 'Other EU' },
  { value: 'nonEU', label: 'Non-EU' },
];

// Transmission options
export const transmissionOptions = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'semi-automatic', label: 'Semi-Automatic' },
];

// Fuel type options
export const fuelTypeOptions = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
  { value: 'plug-in-hybrid', label: 'Plug-in Hybrid' },
  { value: 'lpg', label: 'LPG' },
  { value: 'cng', label: 'CNG' },
];

// Coverage type options
export const coverageTypeOptions = [
  { value: 'third-party', label: 'Third Party' },
  { value: 'third-party-fire-theft', label: 'Third Party Fire & Theft' },
  { value: 'comprehensive', label: 'Comprehensive' },
  { value: 'all-risk', label: 'All Risk' },
];

// Property type options
export const propertyTypeOptions = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'bungalow', label: 'Bungalow' },
];

// Insurance providers
export const insuranceProviders = [
  { value: 'achmea', label: 'Achmea' },
  { value: 'allianz', label: 'Allianz' },
  { value: 'asr', label: 'ASR' },
  { value: 'centraal-beheer', label: 'Centraal Beheer' },
  { value: 'dela', label: 'DELA' },
  { value: 'fbto', label: 'FBTO' },
  { value: 'generali', label: 'Generali' },
  { value: 'interpolis', label: 'Interpolis' },
  { value: 'mapfre', label: 'Mapfre' },
  { value: 'axa', label: 'AXA' },
];

// Brand options with models
export const brandOptions = {
  'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'T-Roc', 'Touareg', 'ID.3', 'ID.4'],
  'Peugeot': ['108', '208', '308', '3008', '5008', '2008', '508'],
  'Renault': ['Clio', 'Captur', 'Megane', 'Scenic', 'Kadjar', 'Austral', 'Arkana'],
  'Ford': ['Fiesta', 'Focus', 'Puma', 'Kuga', 'S-Max', 'Galaxy', 'Mustang Mach-E'],
  'Toyota': ['Yaris', 'Corolla', 'RAV4', 'C-HR', 'Camry', 'Prius', 'Hilux'],
  'SEAT': ['Ibiza', 'Leon', 'Ateca', 'Tarraco', 'Arona'],
  'Hyundai': ['i10', 'i20', 'i30', 'Tucson', 'Kona', 'Santa Fe'],
  'Kia': ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Sorento', 'Niro'],
  'BMW': ['1 Series', '3 Series', '5 Series', 'X1', 'X3', 'X5'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLB', 'GLC'],
  'Audi': ['A1', 'A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
  'Nissan': ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf'],
  'Opel': ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Grandland'],
  'Citroen': ['C1', 'C3', 'C4', 'C5 Aircross', 'Berlingo'],
  'Fiat': ['500', 'Panda', 'Tipo', '500X'],
  'Skoda': ['Fabia', 'Octavia', 'Kamiq', 'Karoq', 'Kodiaq'],
};

// Security features for home insurance
export const securityFeatures = [
  { value: 'alarm', label: 'Alarm System' },
  { value: 'cameras', label: 'Security Cameras' },
  { value: 'smoke-detectors', label: 'Smoke Detectors' },
  { value: 'fire-extinguishers', label: 'Fire Extinguishers' },
  { value: 'security-doors', label: 'Security Doors' },
  { value: 'security-windows', label: 'Security Windows' },
  { value: 'safe', label: 'Safe' },
];

// Years for vehicle and property
export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 50; i++) {
    years.push(currentYear - i);
  }
  return years;
};

// Spanish NIE validation regex
export const NIE_REGEX = /^[XYZ]\d{7}[A-Z]$/i;

// Spanish phone number validation regex
export const PHONE_REGEX = /^(\+34|0034|34)?[67]\d{8}$/;

// Spanish car registration validation regex (new format: 4 digits + 3 letters)
export const REGISTRATION_REGEX = /^\d{4}[A-Z]{3}$/i;

// Email validation regex
export const EMAIL_REGEX = /^[\w\.-]+@[\w\.-]+\.[a-z]{2,}$/i;

// Navigation links
export const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/car-insurance', label: 'Car Insurance' },
  { path: '/home-insurance', label: 'Home Insurance' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact' },
];

// Footer links
export const footerLinks = {
  quickLinks: [
    { path: '/car-insurance', label: 'Car Insurance' },
    { path: '/home-insurance', label: 'Home Insurance' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ],
  resources: [
    { path: '/faq', label: 'FAQ' },
    { path: '/blog', label: 'Blog' },
    { path: '/guides', label: 'Guides' },
    { path: '/privacy-policy', label: 'Privacy Policy' },
  ],
};

// Social media links
export const socialLinks = [
  { name: 'Facebook', href: '#', icon: 'Facebook' },
  { name: 'Twitter', href: '#', icon: 'Twitter' },
  { name: 'LinkedIn', href: '#', icon: 'LinkedIn' },
  { name: 'Instagram', href: '#', icon: 'Instagram' },
];

// Testimonials
export const testimonials = [
  {
    name: 'Maria Garcia',
    location: 'Madrid',
    rating: 5,
    comment: 'Saved €300 on my car insurance! The process was quick and easy. Highly recommended.',
    date: '2 weeks ago',
  },
  {
    name: 'Juan Rodriguez',
    location: 'Barcelona',
    rating: 5,
    comment: 'Excellent service. Found the perfect home insurance for my apartment. Very professional team.',
    date: '1 month ago',
  },
  {
    name: 'Anna Schmidt',
    location: 'Valencia',
    rating: 4,
    comment: 'Great platform for comparing insurance. Saved me a lot of time and money.',
    date: '3 weeks ago',
  },
  {
    name: 'Carlos Martinez',
    location: 'Seville',
    rating: 5,
    comment: 'The best insurance comparison site I\'ve used. Very user-friendly and comprehensive.',
    date: '2 months ago',
  },
];

// How it works steps
export const howItWorksSteps = [
  {
    step: 1,
    title: 'Choose Your Insurance',
    description: 'Select the type of insurance you need - car, home, or other.',
    icon: 'Car',
  },
  {
    step: 2,
    title: 'Fill in Your Details',
    description: 'Provide information about your needs and current coverage.',
    icon: 'Edit3',
  },
  {
    step: 3,
    title: 'Compare Quotes',
    description: 'View and compare offers from top insurance providers.',
    icon: 'BarChart3',
  },
  {
    step: 4,
    title: 'Save Money',
    description: 'Choose the best deal and start saving immediately.',
    icon: 'TrendingUp',
  },
];

// Stats
export const stats = [
  { number: '3500+', label: 'Happy Customers' },
  { number: '50+', label: 'Insurance Partners' },
  { number: '€200k', label: 'Saved by Customers' },
  { number: '4.8/5', label: 'Average Rating' },
];

export const features = [
  {
    icon: Check,  // ✅ Now Check is defined
    title: "100% Free",
    description: "No hidden fees or obligations. Compare quotes for free.",
  },
  {
    icon: Award,
    title: "Top Providers",
    description: "Compare quotes from the best insurance companies in Spain.",
  },
  {
    icon: Clock,
    title: "Fast and Easy",
    description: "Get quotes in minutes with our simple, user-friendly process.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Our team is here to help you every step of the way.",
  },
];

// Insurance types for homepage
export const insuranceTypes = [
  {
    type: 'car',
    title: 'Car Insurance',
    description: 'Compare comprehensive, third-party, and all-risk policies',
    save: 'Save up to 40%',
    icon: 'Car',
    color: 'blue',
    path: '/car-insurance',
  },
  {
    type: 'home',
    title: 'Home Insurance',
    description: 'Protect your home and belongings with the best coverage',
    save: 'Save up to 35%',
    icon: 'Home',
    color: 'green',
    path: '/home-insurance',
  },
];
