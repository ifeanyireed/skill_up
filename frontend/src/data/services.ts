import type { Service } from '@/types'

export const services: Service[] = [
  {
    id: 'bus-rental',
    slug: 'bus-rental',
    title: 'Bus Rental',
    shortDescription: 'Premium chauffeur-driven bus hire for organisations, events and private groups. Our flagship service.',
    description: 'New Era Transport Services provides end-to-end bus rental solutions for corporate transport, airport transfers, private events, schools, and executive travel. Every booking includes a professional driver, GPS tracking, and 24/7 support.',
    isPrimary: true,
    imageUrl: '/vehicles/coaster.jpg',
    icon: 'bus',
  },
  {
    id: 'corporate-transport',
    slug: 'corporate-transport',
    title: 'Corporate Staff Transportation',
    shortDescription: 'Scheduled and on-demand staff movement for businesses across Nigeria.',
    description: 'Reliable, scheduled transportation for your workforce. We manage routes, rosters, and reporting so your HR team can focus on people, not logistics.',
    isPrimary: false,
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    icon: 'building',
  },
  {
    id: 'car-rental',
    slug: 'car-rental',
    title: 'Car Rental',
    shortDescription: 'Executive vehicles and chauffeur services for corporate travellers.',
    description: 'From executive sedans to full-size SUVs, our car rental fleet serves corporate clients requiring premium, reliable transportation.',
    isPrimary: false,
    imageUrl: '/vehicles/hiace.jpg',
    icon: 'car',
  },
  {
    id: 'fleet-management',
    slug: 'fleet-management',
    title: 'Fleet Management',
    shortDescription: 'End-to-end fleet operations management for organisations with existing vehicles.',
    description: 'We manage your fleet so you don\'t have to. From maintenance scheduling to driver management and GPS monitoring — complete operational control.',
    isPrimary: false,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    icon: 'settings',
  },
  {
    id: 'parcel-delivery',
    slug: 'parcel-delivery',
    title: 'Parcel Delivery',
    shortDescription: 'Same-day and next-day parcel delivery within Lagos and across Nigeria.',
    description: 'Reliable courier and parcel delivery services leveraging our nationwide network and professional logistics infrastructure.',
    isPrimary: false,
    imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
    icon: 'package',
  },
]

export const industries = [
  { id: '1', name: 'Corporate & Government', icon: 'briefcase' },
  { id: '2', name: 'Schools & Universities', icon: 'graduation-cap' },
  { id: '3', name: 'Weddings & Private Events', icon: 'heart' },
  { id: '4', name: 'Airport Transfers & Tourism', icon: 'plane' },
  { id: '5', name: 'Religious Events & NGOs', icon: 'globe' },
  { id: '6', name: 'Conferences & Exhibitions', icon: 'calendar' },
  { id: '7', name: 'Family Travel & Excursions', icon: 'users' },
  { id: '8', name: 'Manufacturing & Hospitality', icon: 'building' },
]

export const processSteps = [
  { id: '1', step: 1, title: 'Request a Quote', description: 'Submit your trip details via our online form or call our operations team directly.' },
  { id: '2', step: 2, title: 'Receive Your Estimate', description: 'We\'ll send a detailed, no-obligation quote within 2 business hours.' },
  { id: '3', step: 3, title: 'Confirm Your Booking', description: 'Approve the quote, complete documentation, and your booking is secured.' },
  { id: '4', step: 4, title: 'Enjoy Your Journey', description: 'Your professional driver arrives on time. Track your vehicle in real time.' },
]

export const whyNets = [
  { id: '1', title: 'Reliable Modern Fleet', description: 'All vehicles are maintained to the highest standards with regular safety inspections.' },
  { id: '2', title: 'Professional Drivers', description: 'Trained, vetted, and uniformed drivers with verifiable track records.' },
  { id: '3', title: 'Flexible Booking & Billing', description: 'Corporate invoicing, bulk accounts, and seamless payment options for individuals.' },
  { id: '4', title: 'Real-Time GPS Tracking', description: 'Monitor every vehicle in your fleet from our live tracking dashboard.' },
  { id: '5', title: '24/7 Customer Support', description: 'Round-the-clock support for all operational requirements and emergencies.' },
  { id: '6', title: 'Nationwide Operations', description: 'Services available across all 36 states and Abuja, Federal Capital Territory.' },
]
