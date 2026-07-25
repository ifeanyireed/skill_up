import { create } from 'zustand'
import type { EstimatedInvestment, CustomerPricingView } from '../pricing/pricing.types'
import { generateEstimate } from '../pricing/estimateGenerator'
import { formatEstimateForCustomer } from '../pricing/pricingFormatter'
import { getPricingErrorMessage } from '../pricing/pricingErrors'

export type JourneyIntent =
  | 'General Transport'
  | 'Corporate Staff Transport'
  | 'Airport Transfer'
  | 'Wedding & Events'
  | 'School Transport'
  | 'Religious Groups'
  | 'Conference & Exhibitions'
  | 'Tourism & Excursions'
  | 'Private Group Travel'
  | 'Recurring Staff Shuttle'
  | null

export type TripType = 'One Way' | 'Return' | 'Multi-Day' | 'Recurring'

export interface LocationData {
  address: string
  lat: number
  lng: number
  placeId?: string
  displayName?: string
  administrativeArea?: string
  country?: string
}

export interface CustomerDetails {
  fullName: string
  email: string
  phone: string
  whatsappNumber: string
  company: string
  specialInstructions: string
  consentGiven: boolean
}

interface JourneyState {
  currentStep: number
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  // Step 1
  intent: JourneyIntent
  setIntent: (intent: JourneyIntent) => void

  // Step 2 & 3
  pickup: LocationData | null
  setPickup: (pickup: LocationData | null) => void
  destination: LocationData | null
  setDestination: (destination: LocationData | null) => void
  
  // Routing Intelligence (Phase 4 -> 5)
  distanceKm: number
  distanceMeters: number
  durationMins: number
  durationSeconds: number
  durationText: string
  routePolyline: any | null
  journeyBounds: any | null
  journeyInsights: string[]
  setRouteCalculations: (calc: { distanceKm: number, distanceMeters: number, durationMins: number, durationSeconds: number, durationText: string, routePolyline: any | null, journeyBounds: any | null, journeyInsights: string[] }) => void

  // Step 4
  passengers: string | null
  setPassengers: (p: string) => void
  
  // Step 5
  travelDate: Date | null
  setTravelDate: (d: Date) => void
  departureTime: string
  setDepartureTime: (t: string) => void
  tripType: TripType
  setTripType: (type: TripType) => void
  returnDate: Date | null
  setReturnDate: (d: Date | null) => void

  // Step 6
  extras: string[]
  toggleExtra: (extra: string) => void
  customRequest: string
  setCustomRequest: (r: string) => void
  stops: LocationData[]
  addStop: (stop: LocationData) => void
  removeStop: (index: number) => void
  updateStop: (index: number, stop: LocationData) => void
  reorderStops: (startIndex: number, endIndex: number) => void

  // Step 7 - Smart vehicle recommendation derived from passenger count
  recommendedVehicleId: string | null
  setRecommendedVehicleId: (id: string | null) => void
  selectedVehicleId: string | null
  setSelectedVehicleId: (id: string | null) => void

  // Customer Details
  customerDetails: CustomerDetails
  referenceNumber: string | null
  setCustomerDetails: (details: Partial<CustomerDetails>) => void
  
  // CRM Integration
  generateReference: () => void
  getCRMLeadPayload: () => any

  // Pricing Engine (Phase 5)
  estimatedInvestment: EstimatedInvestment | null
  customerPricingView: CustomerPricingView | null
  pricingError: string | null
  isPricingCalculating: boolean
  calculatePricing: () => void

  // Reset State
  resetJourney: () => void
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(10, state.currentStep + 1) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  intent: null,
  setIntent: (intent) => set({ intent }),

  pickup: null,
  setPickup: (pickup) => set({ pickup }),
  destination: null,
  setDestination: (destination) => set({ destination }),

  distanceKm: 0,
  distanceMeters: 0,
  durationMins: 0,
  durationSeconds: 0,
  durationText: '',
  routePolyline: null,
  journeyBounds: null,
  journeyInsights: [],
  setRouteCalculations: (calc) => set({ ...calc }),

  passengers: null,
  setPassengers: (passengers) => set({ passengers }),

  travelDate: null,
  setTravelDate: (travelDate) => set({ travelDate }),
  departureTime: '09:00',
  setDepartureTime: (departureTime) => set({ departureTime }),
  tripType: 'One Way',
  setTripType: (tripType) => set({ tripType }),
  returnDate: null,
  setReturnDate: (returnDate) => set({ returnDate }),

  extras: [],
  toggleExtra: (extra) => set((state) => ({
    extras: state.extras.includes(extra) 
      ? state.extras.filter(e => e !== extra)
      : [...state.extras, extra]
  })),
  customRequest: '',
  setCustomRequest: (customRequest) => set({ customRequest }),
  stops: [],
  addStop: (stop) => set((state) => ({ stops: [...state.stops, stop] })),
  removeStop: (index) => set((state) => ({ stops: state.stops.filter((_, i) => i !== index) })),
  updateStop: (index, stop) => set((state) => {
    const newStops = [...state.stops]
    newStops[index] = stop
    return { stops: newStops }
  }),
  reorderStops: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.stops)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return { stops: result }
  }),

  recommendedVehicleId: null,
  setRecommendedVehicleId: (recommendedVehicleId) => set({ recommendedVehicleId }),

  selectedVehicleId: null,
  setSelectedVehicleId: (selectedVehicleId) => {
    set({ selectedVehicleId })
    // Recalculate pricing if they change vehicle after passing step 9
    if (get().currentStep >= 9) {
      get().calculatePricing()
    }
  },

  customerDetails: {
    fullName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    company: '',
    specialInstructions: '',
    consentGiven: false,
  },
  referenceNumber: null,
  setCustomerDetails: (details) => set((state) => ({
    customerDetails: { ...state.customerDetails, ...details }
  })),

  generateReference: () => {
    const today = new Date()
    const dateStr = today.toISOString().slice(0,10).replace(/-/g,'')
    const rand = Math.floor(Math.random() * 9000 + 1000)
    set({ referenceNumber: `NETS-${dateStr}-${rand}` })
  },
  getCRMLeadPayload: () => {
    const state = get();
    return {
      customerInformation: {
        name: state.customerDetails.fullName,
        email: state.customerDetails.email,
        phone: state.customerDetails.phone,
        whatsappNumber: state.customerDetails.whatsappNumber || null,
        company: state.customerDetails.company || null,
        specialInstructions: state.customerDetails.specialInstructions || null,
        consentGiven: state.customerDetails.consentGiven
      },
      journeyInformation: {
        journeyType: state.intent,
        pickup: state.pickup,
        destination: state.destination,
        stops: state.stops,
        distanceKm: state.distanceKm,
        distanceMeters: state.distanceMeters,
        estimatedDurationMins: state.durationMins,
        durationSeconds: state.durationSeconds,
        durationText: state.durationText,
        routePolyline: state.routePolyline,
        journeyInsights: state.journeyInsights,
        passengerCount: state.passengers,
        recommendedVehicle: state.recommendedVehicleId,
        selectedVehicle: state.selectedVehicleId,
        travelDate: state.travelDate?.toISOString(),
        tripType: state.tripType
      },
      estimatedInvestment: state.estimatedInvestment ? {
        total: state.estimatedInvestment.estimatedInvestment,
        rateTier: state.estimatedInvestment.rateTier,
        vehicleName: state.estimatedInvestment.vehicleName,
        pricingVersion: state.estimatedInvestment.pricingVersion,
      } : null,
      leadMetadata: {
        leadSource: 'Website Journey Planner',
        status: 'New Lead',
        assignedPipeline: 'Journey Quotes',
        submissionTimestamp: new Date().toISOString(),
        quoteReferenceNumber: state.referenceNumber
      }
    };
  },

  // Pricing Engine (Phase 5)
  estimatedInvestment: null,
  customerPricingView: null,
  pricingError: null,
  isPricingCalculating: false,
  calculatePricing: () => {
    const state = get()
    
    // Require vehicle and distance
    if (!state.recommendedVehicleId || state.distanceKm <= 0) {
      set({ estimatedInvestment: null, customerPricingView: null, pricingError: null })
      return
    }

    set({ isPricingCalculating: true, pricingError: null })

    try {
      const passengerCount = state.passengers ? parseInt(state.passengers.split('–')[0] || '1', 10) : 1
      
      // Calculate number of days for multi-day trips
      let numberOfDays = 1
      if (state.tripType === 'Multi-Day' && state.travelDate && state.returnDate) {
        const diff = state.returnDate.getTime() - state.travelDate.getTime()
        numberOfDays = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
      }

      const vehicleId = state.selectedVehicleId || state.recommendedVehicleId || 'hiace'

      const estimate = generateEstimate({
        vehicleId,
        distanceKm: state.distanceKm,
        distanceMeters: state.distanceMeters,
        durationMinutes: state.durationMins,
        durationSeconds: state.durationSeconds,
        tripType: state.tripType as any,
        passengerCount,
        travelDate: state.travelDate,
        returnDate: state.returnDate,
        numberOfDays,
        stops: state.stops.length,
        journeyInsights: state.journeyInsights,
        selectedExtras: state.extras,
        customRequest: state.customRequest,
        useReferenceDistance: true, // Default: use workbook reference distance
      })

      const customerView = formatEstimateForCustomer(estimate)

      set({
        estimatedInvestment: estimate,
        customerPricingView: customerView,
        isPricingCalculating: false,
        pricingError: null,
      })
    } catch (err) {
      console.error('Pricing calculation failed:', err)
      set({
        estimatedInvestment: null,
        customerPricingView: null,
        isPricingCalculating: false,
        pricingError: getPricingErrorMessage(),
      })
    }
  },

  resetJourney: () => {
    set({
      currentStep: 1,
      intent: null,
      pickup: null,
      destination: null,
      distanceKm: 0,
      distanceMeters: 0,
      durationMins: 0,
      durationSeconds: 0,
      durationText: '',
      routePolyline: null,
      journeyBounds: null,
      journeyInsights: [],
      passengers: null,
      travelDate: null,
      departureTime: '09:00',
      tripType: 'One Way',
      returnDate: null,
      extras: [],
      customRequest: '',
      stops: [],
      recommendedVehicleId: null,
      referenceNumber: null,
      estimatedInvestment: null,
      customerPricingView: null,
      pricingError: null,
      // intentionally keeping customer details (name/email/etc) populated 
      // in case they want to plan another journey without re-typing their info
    })
  }
}))
