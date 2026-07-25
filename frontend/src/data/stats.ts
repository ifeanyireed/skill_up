import type { Stat, Testimonial } from '@/types'

export const stats: Stat[] = [
  { id: '1', value: '20+',    label: 'Vehicles in Fleet',   description: 'Modern, well-maintained vehicles' },
  { id: '2', value: '150+',   label: 'Team Members',        description: 'Professional staff across all operations' },
  { id: '3', value: '5,000+', label: 'Trips Completed',     description: 'Successful journeys delivered' },
  { id: '4', value: '99%',    label: 'On-Time Delivery',    description: 'Consistent operational reliability' },
]

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'NETS handled the transportation for our 3-day wedding across multiple venues in Lagos. The vehicles were immaculate and the drivers were incredibly patient and professional.',
    author: 'Adesuwa & Michael',
    role: 'Private Customers',
    company: 'Wedding Transportation',
  },
  {
    id: '2',
    quote: 'We move over 200 staff daily across three Lagos locations. NETS handles the entire operation seamlessly. Communication is excellent and billing is always straightforward.',
    author: 'Chisom Eze',
    role: 'HR Director',
    company: 'Zenith Manufacturing Group',
  },
  {
    id: '3',
    quote: 'Finding a reliable partner for our school excursions was difficult until we found NETS. Safety is our priority, and their GPS-tracked fleet gives our parents complete peace of mind.',
    author: 'Dr. Ibrahim Yusuf',
    role: 'School Administrator',
    company: 'Crestview Academy',
  },
]
