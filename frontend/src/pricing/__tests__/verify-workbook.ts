// ============================================================================
// NETS Pricing Engine — Workbook Verification Script
// ============================================================================
// Runs the three worked examples from the official Excel workbook and
// verifies the engine produces EXACTLY matching results.
//
// Run with: npx tsx src/pricing/__tests__/verify-workbook.ts
// ============================================================================

import { HIACE_CONFIG, COASTER_CONFIG, SUV_CONFIG } from '../vehiclePricingConfig'
import { calculateFuel } from '../fuelRules'
import { calculateDailyRate, calculateMonthlyRate } from '../standardEngine'
import { calculateThreeDayTripRate } from '../coasterEngine'

let passed = 0
let failed = 0

function assert(testName: string, actual: number, expected: number, tolerance = 0.001) {
  const diff = Math.abs(actual - expected)
  if (diff <= tolerance) {
    console.log(`  ✓ ${testName}: ₦${actual.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
    passed++
  } else {
    console.error(`  ✗ ${testName}: Expected ₦${expected.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, got ₦${actual.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (diff: ${diff})`)
    failed++
  }
}

console.log('═══════════════════════════════════════════════════════════')
console.log('  NETS Pricing Engine — Workbook Verification')
console.log('═══════════════════════════════════════════════════════════')
console.log()

// ── 1. FUEL CALCULATIONS ──
console.log('── Fuel Sub-Calculation ──')

const coasterFuel = calculateFuel(COASTER_CONFIG)
assert('Coaster Daily Fuel Litres', coasterFuel.dailyFuelLitres, 60)
assert('Coaster Fuel Usage (₦/day)', coasterFuel.fuelUsagePerDay, 78000)

const hiaceFuel = calculateFuel(HIACE_CONFIG)
assert('Hiace Daily Fuel Litres', hiaceFuel.dailyFuelLitres, 16.8)
assert('Hiace Fuel Usage (₦/day)', hiaceFuel.fuelUsagePerDay, 18816)

console.log()

// ── 2. HIACE DAILY RATE (Standard Engine) ──
console.log('── Hiace Daily Rate (Standard Engine) ──')

const hiaceDaily = calculateDailyRate(HIACE_CONFIG)
assert('Hiace Running Total', hiaceDaily.runningTotal, 95816)
assert('Hiace Mark-Up', hiaceDaily.markup, 9581.60)
assert('Hiace TOTAL (Daily)', hiaceDaily.totalDaily, 105397.60)

// Verify individual line items
assert('  Fuel Usage', hiaceDaily.fuelUsage, 18816)
assert('  Driver Salary', hiaceDaily.driverSalary, 10000)
assert('  Vehicle Maintenance', hiaceDaily.vehicleMaintenance, 8500)
assert('  Security Fees', hiaceDaily.securityFees, 2500)
assert('  Government Levies', hiaceDaily.governmentLevies, 1000)
assert('  Outstation Allowance', hiaceDaily.driverOutstationAllowance, 0)
assert('  Depreciation', hiaceDaily.depreciationCost, 55000)

console.log()

// ── 3. HIACE MONTHLY RATE ──
console.log('── Hiace Monthly Rate ──')

const hiaceMonthly = calculateMonthlyRate(HIACE_CONFIG)
assert('Hiace TOTAL (Monthly)', hiaceMonthly.totalMonthly, 3267325.60)

console.log()

// ── 4. COASTER DAILY RATE (Coaster Engine) ──
console.log('── Coaster Daily Rate (Coaster Engine) ──')

const coasterDaily = calculateDailyRate(COASTER_CONFIG)
assert('Coaster Running Total', coasterDaily.runningTotal, 160500)
assert('Coaster Mark-Up', coasterDaily.markup, 38520)
assert('Coaster TOTAL (Daily)', coasterDaily.totalDaily, 199020)

// Verify individual line items
assert('  Fuel Usage', coasterDaily.fuelUsage, 78000)
assert('  Driver Salary', coasterDaily.driverSalary, 10000)
assert('  Vehicle Maintenance', coasterDaily.vehicleMaintenance, 12500)
assert('  Security Fees', coasterDaily.securityFees, 3000)
assert('  Government Levies', coasterDaily.governmentLevies, 2000)
assert('  Outstation Allowance', coasterDaily.driverOutstationAllowance, 10000)
assert('  Depreciation', coasterDaily.depreciationCost, 45000)

console.log()

// ── 5. COASTER MONTHLY RATE ──
console.log('── Coaster Monthly Rate ──')

const coasterMonthly = calculateMonthlyRate(COASTER_CONFIG)
assert('Coaster TOTAL (Monthly)', coasterMonthly.totalMonthly, 6169620)

console.log()

// ── 6. COASTER 3-DAY TRIP RATE ──
console.log('── Coaster 3-Day Trip Rate ──')

const coaster3Day = calculateThreeDayTripRate(COASTER_CONFIG)
assert('Coaster 3-Day Running Total', coaster3Day.runningTotal, 325500)
assert('Coaster 3-Day Mark-Up', coaster3Day.markup, 78120)
assert('Coaster 3-Day TOTAL', coaster3Day.totalThreeDayTrip, 403620)

// Verify individual line items (fuel once, everything else ×3)
assert('  Fuel Usage (once)', coaster3Day.fuelUsage, 78000)
assert('  Driver Salary (×3)', coaster3Day.driverSalary, 30000)
assert('  Vehicle Maintenance (×3)', coaster3Day.vehicleMaintenance, 37500)
assert('  Security Fees (×3)', coaster3Day.securityFees, 9000)
assert('  Government Levies (×3)', coaster3Day.governmentLevies, 6000)
assert('  Outstation Allowance (×3)', coaster3Day.driverOutstationAllowance, 30000)
assert('  Depreciation (×3)', coaster3Day.depreciationCost, 135000)

console.log()

// ── 7. SUV = HIACE (Business Rule) ──
console.log('── SUV Inherits Hiace (Business Rule) ──')

const suvDaily = calculateDailyRate(SUV_CONFIG)
assert('SUV TOTAL (Daily) = Hiace TOTAL (Daily)', suvDaily.totalDaily, 105397.60)
assert('SUV Running Total = Hiace Running Total', suvDaily.runningTotal, 95816)

console.log()

// ── RESULTS ──
console.log('═══════════════════════════════════════════════════════════')
console.log(`  RESULTS: ${passed} passed, ${failed} failed`)
if (failed === 0) {
  console.log('  ✓ ALL TESTS PASSED — Engine matches Excel workbook exactly')
} else {
  console.error('  ✗ FAILURES DETECTED — Engine does NOT match workbook')
}
console.log('═══════════════════════════════════════════════════════════')

if (failed > 0) {
  throw new Error(`${failed} test(s) failed`)
}
