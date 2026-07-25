// ============================================================================
// NETS Pricing Engine — CRM Payload Builder
// ============================================================================
// Builds the structured CRM quotation object for lead management.
// Contains both customer-visible and internal operations data.
// ============================================================================

import type {
  EstimatedInvestment,
  CRMQuotationPayload,
  JourneyPricingInput,
  VehiclePricingConfig,
} from './pricing.types'

/** Current pricing engine version */
export const PRICING_ENGINE_VERSION = '1.0.0'

/**
 * Build the complete CRM quotation payload.
 *
 * @param estimate - The calculated pricing estimate
 * @param input - The journey pricing input
 * @param vehicleConfig - The vehicle's pricing configuration
 * @param journeyReference - The unique journey reference number
 * @param customerDetails - Customer contact information
 */
export function buildCRMPayload(
  estimate: EstimatedInvestment,
  input: JourneyPricingInput,
  vehicleConfig: VehiclePricingConfig,
  journeyReference: string,
  customerDetails: {
    fullName: string
    email: string
    phone: string
    company: string | null
    specialInstructions: string | null
    consentGiven: boolean
  }
): CRMQuotationPayload {
  return {
    journeyReference,

    journeyDetails: {
      pickup: '', // Populated by the store at integration time
      destination: '',
      distanceKm: input.distanceKm,
      durationMinutes: input.durationMinutes,
      tripType: input.tripType,
      passengerCount: input.passengerCount,
      travelDate: input.travelDate?.toISOString() ?? null,
      stops: input.stops,
      journeyInsights: input.journeyInsights,
    },

    customerDetails: {
      fullName: customerDetails.fullName,
      email: customerDetails.email,
      phone: customerDetails.phone,
      company: customerDetails.company,
      specialInstructions: customerDetails.specialInstructions,
      consentGiven: customerDetails.consentGiven,
    },

    vehicleDetails: {
      vehicleId: vehicleConfig.vehicleId,
      vehicleName: vehicleConfig.vehicleName,
      engineType: vehicleConfig.engineType,
    },

    estimatedInvestment: {
      total: estimate.estimatedInvestment,
      rateTier: estimate.rateTier,
      optionalServicesTotal: estimate.optionalServices.totalOptionalCharges,
      minimumChargeApplied: estimate.minimumChargeApplied,
    },

    metadata: {
      pricingVersion: PRICING_ENGINE_VERSION,
      calculationTimestamp: estimate.calculatedAt,
      leadSource: 'Website Journey Planner',
      status: 'New Lead',
      pipeline: 'Journey Quotes',
    },
  }
}
