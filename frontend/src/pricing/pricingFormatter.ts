// ============================================================================
// NETS Pricing Engine — Pricing Formatter (Customer-Facing)
// ============================================================================
// Formats raw estimates into customer-safe display values.
// NEVER reveals internal formulas, markup percentages, or line-item costs.
// ============================================================================

import type { EstimatedInvestment, CustomerPricingView } from './pricing.types'

/**
 * Format a number as Nigerian Naira.
 * Rounds to nearest whole number for display (₦105,398 not ₦105,397.60).
 */
export function formatCurrency(amount: number): string {
  return `₦${Math.round(amount).toLocaleString('en-NG')}`
}

/**
 * Format a number as Nigerian Naira with kobo (2 decimal places).
 * For internal/admin use only.
 */
export function formatCurrencyPrecise(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * The items included in every NETS quotation.
 * This is the ONLY pricing detail customers see beyond the estimate range.
 */
const PRICING_INCLUDES: string[] = [
  'Vehicle',
  'Professional Driver',
  'Fuel',
  'Operational Support',
  'Safety Standards',
  'Fleet Maintenance',
]

/**
 * Standard pricing disclaimer shown to all customers.
 */
const PRICING_DISCLAIMER =
  'This is an estimated investment based on your journey details. Final pricing will be confirmed by our transport specialists after reviewing your specific requirements.'

/**
 * Transform an internal EstimatedInvestment into a customer-safe view.
 * This is ALL the customer ever sees — no formulas, no markups, no line items.
 */
export function formatEstimateForCustomer(
  estimate: EstimatedInvestment
): CustomerPricingView {
  return {
    estimatedInvestment: formatCurrency(estimate.estimatedInvestment),
    pricingIncludes: [...PRICING_INCLUDES],
    disclaimer: PRICING_DISCLAIMER,
  }
}
