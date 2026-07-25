// ============================================================================
// NETS Pricing Engine — Standard Engine
// ============================================================================
// Line-for-line translation of the Standard Engine formula from the Excel workbook.
// Used by: Hiace, SUV, Executive Bus, Luxury Coach, Executive Sedan, and all future vehicles.
//
// Running Total (₦/day) = Fuel Usage + Salaries + Vehicle Maintenance + Security Fees
//                        + Government Levies + Driver Outstation Allowance + Depreciation Cost
// Mark-Up (₦/day)       = Running Total × Mark-Up Percentage
// TOTAL (₦/day)         = Running Total + Mark-Up
// Monthly Rate          = Daily Rate × 31
//
// Verification (Hiace):
//   Running Total = 18,816 + 10,000 + 8,500 + 2,500 + 1,000 + 0 + 55,000 = 95,816
//   Mark-Up       = 95,816 × 0.10 = 9,581.60
//   TOTAL (Daily) = 105,397.60  ✓
//   TOTAL (Monthly) = 3,267,325.60  ✓
//
// IMPORTANT: No intermediate rounding. Only round for on-screen display.
// ============================================================================

import type { VehiclePricingConfig, DailyRateBreakdown, MonthlyRateBreakdown } from './pricing.types'
import { calculateFuel } from './fuelRules'

/**
 * Calculate the daily rate using the Standard Engine formula.
 *
 * Vehicle Documents (₦/day) is deliberately EXCLUDED from the running total
 * as per the workbook — it is a record-keeping field only.
 */
export function calculateDailyRate(
  config: VehiclePricingConfig,
  overrideDistanceKm?: number
): DailyRateBreakdown {
  const fuel = calculateFuel(config, overrideDistanceKm)

  const fuelUsage = fuel.fuelUsagePerDay
  const driverSalary = config.driverSalaryPerDay
  const vehicleMaintenance = config.vehicleMaintenancePerDay
  const securityFees = config.securityFeesPerDay
  const governmentLevies = config.governmentLeviesPerDay
  const driverOutstationAllowance = config.driverOutstationAllowancePerDay
  const depreciationCost = config.depreciationCostPerDay

  // Running Total = sum of the 7 line items
  const runningTotal =
    fuelUsage +
    driverSalary +
    vehicleMaintenance +
    securityFees +
    governmentLevies +
    driverOutstationAllowance +
    depreciationCost

  // Mark-Up = Running Total × Mark-Up Percentage
  const markup = runningTotal * config.markupPercentage

  // TOTAL (Daily) = Running Total + Mark-Up
  const totalDaily = runningTotal + markup

  return {
    fuelUsage,
    driverSalary,
    vehicleMaintenance,
    securityFees,
    governmentLevies,
    driverOutstationAllowance,
    depreciationCost,
    runningTotal,
    markup,
    totalDaily,
  }
}

/**
 * Calculate the monthly rate.
 * Monthly Rate = Daily Rate × 31 (applied line-by-line and to TOTAL).
 */
export function calculateMonthlyRate(
  config: VehiclePricingConfig,
  overrideDistanceKm?: number
): MonthlyRateBreakdown {
  const daily = calculateDailyRate(config, overrideDistanceKm)

  return {
    fuelUsage: daily.fuelUsage * 31,
    driverSalary: daily.driverSalary * 31,
    vehicleMaintenance: daily.vehicleMaintenance * 31,
    securityFees: daily.securityFees * 31,
    governmentLevies: daily.governmentLevies * 31,
    driverOutstationAllowance: daily.driverOutstationAllowance * 31,
    depreciationCost: daily.depreciationCost * 31,
    runningTotal: daily.runningTotal * 31,
    markup: daily.markup * 31,
    totalMonthly: daily.totalDaily * 31,
  }
}
