// ============================================================================
// NETS Pricing Engine — Error Handling
// ============================================================================
// Graceful error handling for the pricing engine.
// NEVER expose technical errors to customers.
// ============================================================================

/**
 * Custom error class for pricing engine failures.
 * Contains both an internal technical message and a customer-safe message.
 */
export class PricingError extends Error {
  /** The customer-safe error message */
  public readonly customerMessage: string
  /** Internal error code for logging */
  public readonly errorCode: string

  constructor(
    technicalMessage: string,
    errorCode: string = 'PRICING_ERROR'
  ) {
    super(technicalMessage)
    this.name = 'PricingError'
    this.errorCode = errorCode
    this.customerMessage = getPricingErrorMessage()
  }
}

/**
 * Returns the standard customer-facing error message.
 * This is the ONLY message a customer should ever see when pricing fails.
 */
export function getPricingErrorMessage(): string {
  return "We're unable to calculate an instant estimate for this journey. Our transport specialists will prepare a personalised quotation shortly."
}

/**
 * Validate that a journey has sufficient data for pricing.
 * Returns an array of validation errors (empty if valid).
 */
export function validatePricingInputs(input: {
  vehicleId: string
  distanceKm: number
}): string[] {
  const errors: string[] = []

  if (!input.vehicleId) {
    errors.push('Vehicle selection is required for pricing')
  }

  if (input.distanceKm <= 0) {
    errors.push('Valid journey distance is required for pricing')
  }

  return errors
}
