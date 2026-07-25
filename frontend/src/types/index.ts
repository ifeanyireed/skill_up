export interface Vehicle {
  id: string
  name: string
  slug: string
  capacity: number
  category: string
  bestFor: string
  imageUrl: string
  features: string[]
  available: boolean
  editorialStory?: string
  comfortRating?: string
  luggageSpace?: string
  airConditioning?: string
  recommendedFor?: string[]
  gallery?: string[]
}

export interface Service {
  id: string
  slug: string
  title: string
  description: string
  shortDescription: string
  isPrimary: boolean
  imageUrl: string
  icon: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
  avatarUrl?: string
}

export interface Stat {
  id: string
  value: string
  label: string
  description?: string
}

export interface Industry {
  id: string
  name: string
  description: string
}

export interface ProcessStep {
  id: string
  step: number
  title: string
  description: string
}
