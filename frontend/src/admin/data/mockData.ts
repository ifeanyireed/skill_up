// ============================================================================
// NETS Admin — Mock Data Seed
// ============================================================================
// Realistic Nigerian transport business data for the Operations Control Center.
// All records are mock; ready to be replaced by real API calls in Phase 9.
// ============================================================================

import type { AdminQuote, AdminBooking, AdminCustomer, AdminDriver, AdminUser, AdminVehicle, ActivityLogEntry, Promotion } from '../store/useAdminStore'

// ── Helpers ──────────────────────────────────────────────────────────────────
const now = new Date()
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString()
const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400000).toISOString()

// ── Drivers ──────────────────────────────────────────────────────────────────
export const mockDrivers: AdminDriver[] = [
  { id: 'drv-001', name: 'Emmanuel Okafor', phone: '+234 803 111 2222', licenseNumber: 'LAG-DL-00441', status: 'active', assignedVehicleId: 'hiace', totalTrips: 214 },
  { id: 'drv-002', name: 'Chukwuemeka Adiele', phone: '+234 807 333 4444', licenseNumber: 'LAG-DL-00562', status: 'active', assignedVehicleId: 'coaster', totalTrips: 187 },
  { id: 'drv-003', name: 'Samuel Idowu', phone: '+234 815 555 6666', licenseNumber: 'LAG-DL-00789', status: 'on-trip', assignedVehicleId: 'midibus-18', totalTrips: 302 },
  { id: 'drv-004', name: 'Babatunde Fashola', phone: '+234 802 777 8888', licenseNumber: 'ABA-DL-01123', status: 'active', assignedVehicleId: null, totalTrips: 98 },
  { id: 'drv-005', name: 'Ifeanyi Chukwu', phone: '+234 901 999 0000', licenseNumber: 'LAG-DL-01455', status: 'off-duty', assignedVehicleId: null, totalTrips: 156 },
]

// ── Vehicles (admin-extended) ─────────────────────────────────────────────────
export const mockAdminVehicles: AdminVehicle[] = [
  {
    id: 'hiace', name: 'Toyota HiAce', slug: 'toyota-hiace', capacity: 14, category: 'Standard',
    imageUrl: '/vehicles/hiace.jpg', registrationNumber: 'LAG-234-KJA', insuranceExpiry: daysFromNow(180),
    maintenanceStatus: 'ok', available: true, visible: true, pricingCategory: 'hiace',
    features: ['Air Conditioning', 'Tinted Windows', 'Professional Driver', 'GPS Tracked'],
  },
  {
    id: 'coaster', name: 'Toyota Coaster', slug: 'toyota-coaster', capacity: 30, category: 'Executive',
    imageUrl: '/vehicles/coaster.jpg', registrationNumber: 'LAG-456-MNA', insuranceExpiry: daysFromNow(95),
    maintenanceStatus: 'ok', available: true, visible: true, pricingCategory: 'coaster',
    features: ['Air Conditioning', 'Reclining Seats', 'Professional Driver', 'GPS Tracked'],
  },
  {
    id: 'midibus-18', name: '18-Seater Executive Shuttle', slug: '18-seater-shuttle', capacity: 18, category: 'Executive',
    imageUrl: '/vehicles/hiace.jpg', registrationNumber: 'LAG-789-PQR', insuranceExpiry: daysFromNow(45),
    maintenanceStatus: 'service-due', available: true, visible: true, pricingCategory: 'hiace',
    features: ['Air Conditioning', 'USB Charging', 'Professional Driver', 'GPS Tracked'],
  },
  {
    id: 'coach-50', name: '50-Seater Luxury Coach', slug: '50-seater-coach', capacity: 50, category: 'Luxury',
    imageUrl: '/vehicles/hiace.jpg', registrationNumber: 'LAG-012-STU', insuranceExpiry: daysFromNow(210),
    maintenanceStatus: 'ok', available: false, visible: true, pricingCategory: 'hiace',
    features: ['Air Conditioning', 'PA System', 'Luggage Hold', 'Professional Driver', 'GPS Tracked'],
  },
  {
    id: 'suv', name: 'Executive SUV', slug: 'executive-suv', capacity: 4, category: 'Luxury',
    imageUrl: '/vehicles/suv.png', registrationNumber: 'LAG-345-VWX', insuranceExpiry: daysFromNow(330),
    maintenanceStatus: 'ok', available: true, visible: true, pricingCategory: 'hiace',
    features: ['Leather Interior', 'Air Conditioning', 'Professional Driver', 'Privacy Glass'],
  },
  {
    id: 'sedan', name: 'Executive Sedan', slug: 'executive-sedan', capacity: 3, category: 'Luxury',
    imageUrl: '/vehicles/hiace.jpg', registrationNumber: 'ABJ-678-YZA', insuranceExpiry: daysFromNow(150),
    maintenanceStatus: 'ok', available: true, visible: true, pricingCategory: 'hiace',
    features: ['Premium Leather', 'Air Conditioning', 'Professional Chauffeur', 'GPS Tracked'],
  },
]

// ── Customers ─────────────────────────────────────────────────────────────────
export const mockCustomers: AdminCustomer[] = [
  { id: 'cust-001', fullName: 'Dr. Adaeze Okonkwo', email: 'adaeze.okonkwo@gtbankplc.com', phone: '+234 803 100 2000', company: 'GTBank PLC', type: 'corporate', totalBookings: 12, totalSpend: 4820000, createdAt: daysAgo(90), notes: 'Prefers Coaster for exec events. Pay promptly.' },
  { id: 'cust-002', fullName: 'Engr. Bola Afolabi', email: 'b.afolabi@dangotelng.com', phone: '+234 807 200 3000', company: 'Dangote Group', type: 'corporate', totalBookings: 28, totalSpend: 14200000, createdAt: daysAgo(180), notes: 'Key account. Monthly staff transport contract.' },
  { id: 'cust-003', fullName: 'Mrs. Chioma Eze', email: 'chioma.eze@gmail.com', phone: '+234 815 300 4000', company: null, type: 'individual', totalBookings: 3, totalSpend: 650000, createdAt: daysAgo(30), notes: 'Wedding event client.' },
  { id: 'cust-004', fullName: 'Mr. Emeka Nwosu', email: 'emeka@techhive.ng', phone: '+234 802 400 5000', company: 'TechHive Nigeria', type: 'corporate', totalBookings: 7, totalSpend: 2100000, createdAt: daysAgo(60), notes: 'Monthly airport runs.' },
  { id: 'cust-005', fullName: 'Pastor Jide Oluwafemi', email: 'jide@rcchurch.ng', phone: '+234 901 500 6000', company: 'Redeemed Christian Church', type: 'corporate', totalBookings: 5, totalSpend: 1800000, createdAt: daysAgo(45), notes: 'Pilgrimages + special events.' },
  { id: 'cust-006', fullName: 'Ms. Fatima Aliyu', email: 'fatima.aliyu@accessbank.com', phone: '+234 803 600 7000', company: 'Access Bank PLC', type: 'corporate', totalBookings: 19, totalSpend: 8400000, createdAt: daysAgo(120), notes: 'Q3 contract renewal due.' },
  { id: 'cust-007', fullName: 'Mr. Tunde Bakare', email: 'tbakare@gmail.com', phone: '+234 807 700 8000', company: null, type: 'individual', totalBookings: 1, totalSpend: 199020, createdAt: daysAgo(7), notes: '' },
  { id: 'cust-008', fullName: 'Dr. Ngozi Adeyemi', email: 'ngozi.adeyemi@firstbank.ng', phone: '+234 815 800 9000', company: 'First Bank Nigeria', type: 'corporate', totalBookings: 9, totalSpend: 3200000, createdAt: daysAgo(75), notes: 'Executive level only — SUV or Sedan.' },
]

// ── Quotes ────────────────────────────────────────────────────────────────────
export const mockQuotes: AdminQuote[] = [
  { id: 'q-001', reference: 'NETS-20260723-001001', customerId: 'cust-007', customerName: 'Mr. Tunde Bakare', customerEmail: 'tbakare@gmail.com', vehicleId: 'coaster', vehicleName: 'Toyota Coaster', pickup: 'Lekki Phase 1, Lagos', destination: 'Murtala Muhammed Airport, Lagos', distanceKm: 28, durationMins: 45, tripType: 'One Way', passengerCount: 24, travelDate: daysFromNow(3), estimatedInvestment: 199020, status: 'new', createdAt: daysAgo(1), notes: '' },
  { id: 'q-002', reference: 'NETS-20260722-002002', customerId: 'cust-001', customerName: 'Dr. Adaeze Okonkwo', customerEmail: 'adaeze.okonkwo@gtbankplc.com', vehicleId: 'coaster', vehicleName: 'Toyota Coaster', pickup: 'GTBank HQ, Victoria Island', destination: 'Eko Hotel & Suites', distanceKm: 8, durationMins: 20, tripType: 'Return', passengerCount: 22, travelDate: daysFromNow(7), estimatedInvestment: 199020, status: 'approved', createdAt: daysAgo(2), notes: 'Board meeting shuttle. Confirm by Friday.' },
  { id: 'q-003', reference: 'NETS-20260721-003003', customerId: 'cust-003', customerName: 'Mrs. Chioma Eze', customerEmail: 'chioma.eze@gmail.com', vehicleId: 'hiace', vehicleName: 'Toyota HiAce', pickup: 'Ikeja GRA, Lagos', destination: 'Oriental Hotel, VI', distanceKm: 18, durationMins: 35, tripType: 'Wedding', passengerCount: 12, travelDate: daysFromNow(14), estimatedInvestment: 105397.60, status: 'new', createdAt: daysAgo(3), notes: 'Wedding convoy. 2 vehicles needed.' },
  { id: 'q-004', reference: 'NETS-20260720-004004', customerId: 'cust-004', customerName: 'Mr. Emeka Nwosu', customerEmail: 'emeka@techhive.ng', vehicleId: 'hiace', vehicleName: 'Toyota HiAce', pickup: 'Yaba, Lagos', destination: 'Murtala Muhammed Airport, Lagos', distanceKm: 22, durationMins: 40, tripType: 'Airport Transfer', passengerCount: 8, travelDate: daysFromNow(1), estimatedInvestment: 105397.60, status: 'converted', createdAt: daysAgo(4), notes: '' },
  { id: 'q-005', reference: 'NETS-20260719-005005', customerId: 'cust-006', customerName: 'Ms. Fatima Aliyu', customerEmail: 'fatima.aliyu@accessbank.com', vehicleId: 'coaster', vehicleName: 'Toyota Coaster', pickup: 'Access Bank HQ, VI', destination: 'Transcorp Hilton, Abuja', distanceKm: 900, durationMins: 480, tripType: 'Multi-Day', passengerCount: 26, travelDate: daysFromNow(10), estimatedInvestment: 403620, status: 'reviewed', createdAt: daysAgo(5), notes: 'Long-distance Abuja trip. Needs driver outstation allowance.' },
  { id: 'q-006', reference: 'NETS-20260718-006006', customerId: 'cust-002', customerName: 'Engr. Bola Afolabi', customerEmail: 'b.afolabi@dangotelng.com', vehicleId: 'coach-50', vehicleName: '50-Seater Luxury Coach', pickup: 'Dangote Refinery, Ibeju-Lekki', destination: 'AIICO Building, VI', distanceKm: 50, durationMins: 90, tripType: 'Corporate Shuttle', passengerCount: 45, travelDate: daysFromNow(2), estimatedInvestment: 199020, status: 'approved', createdAt: daysAgo(6), notes: 'Daily recurring contract.' },
  { id: 'q-007', reference: 'NETS-20260717-007007', customerId: 'cust-005', customerName: 'Pastor Jide Oluwafemi', customerEmail: 'jide@rcchurch.ng', vehicleId: 'midibus-18', vehicleName: '18-Seater Executive Shuttle', pickup: 'RCCG Camp, Mowe', destination: 'Tafawa Balewa Square, Lagos', distanceKm: 42, durationMins: 75, tripType: 'Conference', passengerCount: 16, travelDate: daysFromNow(21), estimatedInvestment: 105397.60, status: 'rejected', createdAt: daysAgo(7), notes: 'Rate too high for NGO budget. Referred to discount.' },
  { id: 'q-008', reference: 'NETS-20260716-008008', customerId: 'cust-008', customerName: 'Dr. Ngozi Adeyemi', customerEmail: 'ngozi.adeyemi@firstbank.ng', vehicleId: 'sedan', vehicleName: 'Executive Sedan', pickup: 'First Bank HQ, Broad Street', destination: 'Nnamdi Azikiwe Airport, Abuja', distanceKm: 900, durationMins: 480, tripType: 'Airport Transfer', passengerCount: 1, travelDate: daysAgo(1), estimatedInvestment: 105397.60, status: 'new', createdAt: daysAgo(8), notes: '' },
]

// ── Bookings ──────────────────────────────────────────────────────────────────
export const mockBookings: AdminBooking[] = [
  { id: 'bk-001', reference: 'BK-20260723-001', quoteReference: 'NETS-20260720-004004', customerId: 'cust-004', customerName: 'Mr. Emeka Nwosu', vehicleId: 'hiace', vehicleName: 'Toyota HiAce', driverId: 'drv-001', driverName: 'Emmanuel Okafor', pickup: 'Yaba, Lagos', destination: 'Murtala Muhammed Airport, Lagos', distanceKm: 22, durationMins: 40, tripType: 'Airport Transfer', passengerCount: 8, travelDate: daysFromNow(1), totalAmount: 105397.60, paymentStatus: 'paid', operationalStatus: 'confirmed', createdAt: daysAgo(3), notes: 'Flight at 08:00. Pickup 05:30.' },
  { id: 'bk-002', reference: 'BK-20260722-002', quoteReference: null, customerId: 'cust-002', customerName: 'Engr. Bola Afolabi', vehicleId: 'coaster', vehicleName: 'Toyota Coaster', driverId: 'drv-002', driverName: 'Chukwuemeka Adiele', pickup: 'Dangote Refinery, Ibeju-Lekki', destination: 'AIICO Building, VI', distanceKm: 50, durationMins: 90, tripType: 'Corporate Shuttle', passengerCount: 28, travelDate: daysAgo(1), totalAmount: 199020, paymentStatus: 'invoiced', operationalStatus: 'completed', createdAt: daysAgo(8), notes: 'Recurring daily contract.' },
  { id: 'bk-003', reference: 'BK-20260721-003', quoteReference: null, customerId: 'cust-001', customerName: 'Dr. Adaeze Okonkwo', vehicleId: 'coaster', vehicleName: 'Toyota Coaster', driverId: null, driverName: null, pickup: 'GTBank HQ, Victoria Island', destination: 'Eko Hotel & Suites', distanceKm: 8, durationMins: 20, tripType: 'Return', passengerCount: 22, travelDate: daysFromNow(7), totalAmount: 199020, paymentStatus: 'pending', operationalStatus: 'confirmed', createdAt: daysAgo(2), notes: 'Driver assignment pending.' },
  { id: 'bk-004', reference: 'BK-20260720-004', quoteReference: null, customerId: 'cust-003', customerName: 'Mrs. Chioma Eze', vehicleId: 'hiace', vehicleName: 'Toyota HiAce', driverId: 'drv-003', driverName: 'Samuel Idowu', pickup: 'Ikeja GRA, Lagos', destination: 'Oriental Hotel, VI', distanceKm: 18, durationMins: 35, tripType: 'Wedding', passengerCount: 12, travelDate: daysFromNow(14), totalAmount: 210795.20, paymentStatus: 'partial', operationalStatus: 'pending', createdAt: daysAgo(1), notes: '50% deposit received.' },
  { id: 'bk-005', reference: 'BK-20260719-005', quoteReference: null, customerId: 'cust-006', customerName: 'Ms. Fatima Aliyu', vehicleId: 'coach-50', vehicleName: '50-Seater Luxury Coach', driverId: 'drv-004', driverName: 'Babatunde Fashola', pickup: 'Access Bank HQ, VI', destination: 'Transcorp Hilton, Abuja', distanceKm: 900, durationMins: 480, tripType: 'Multi-Day', passengerCount: 45, travelDate: daysFromNow(10), totalAmount: 403620, paymentStatus: 'paid', operationalStatus: 'confirmed', createdAt: daysAgo(5), notes: 'Full payment received.' },
  { id: 'bk-006', reference: 'BK-20260718-006', quoteReference: null, customerId: 'cust-008', customerName: 'Dr. Ngozi Adeyemi', vehicleId: 'sedan', vehicleName: 'Executive Sedan', driverId: 'drv-005', driverName: 'Ifeanyi Chukwu', pickup: 'First Bank HQ, Broad Street', destination: 'Murtala Muhammed Airport, Lagos', distanceKm: 22, durationMins: 40, tripType: 'Airport Transfer', passengerCount: 1, travelDate: daysAgo(2), totalAmount: 105397.60, paymentStatus: 'paid', operationalStatus: 'completed', createdAt: daysAgo(10), notes: '' },
]

// ── Users ─────────────────────────────────────────────────────────────────────
export const mockUsers: AdminUser[] = [
  { id: 'usr-001', fullName: 'Adebayo Ogundimu', email: 'admin@netsnigeria.com', role: 'super-admin', status: 'active', lastLogin: daysAgo(0) },
  { id: 'usr-002', fullName: 'Kemi Adeyinka', email: 'ops@netsnigeria.com', role: 'ops-manager', status: 'active', lastLogin: daysAgo(1) },
  { id: 'usr-003', fullName: 'Tolu Obi', email: 'sales@netsnigeria.com', role: 'sales-manager', status: 'active', lastLogin: daysAgo(0) },
  { id: 'usr-004', fullName: 'Uche Nwachukwu', email: 'finance@netsnigeria.com', role: 'finance', status: 'active', lastLogin: daysAgo(3) },
  { id: 'usr-005', fullName: 'Amaka Okafor', email: 'support@netsnigeria.com', role: 'support', status: 'active', lastLogin: daysAgo(1) },
  { id: 'usr-006', fullName: 'Rotimi Adesanya', email: 'marketing@netsnigeria.com', role: 'marketing', status: 'inactive', lastLogin: daysAgo(14) },
]

// ── Activity Log ──────────────────────────────────────────────────────────────
export const mockActivityLog: ActivityLogEntry[] = [
  { id: 'act-001', userId: 'usr-003', userName: 'Tolu Obi', action: 'Quote Approved', entity: 'Quote', entityId: 'q-002', description: 'Approved quote NETS-20260722-002002 for Dr. Adaeze Okonkwo', timestamp: daysAgo(0), previousValue: 'new', newValue: 'approved' },
  { id: 'act-002', userId: 'usr-001', userName: 'Adebayo Ogundimu', action: 'Pricing Updated', entity: 'Pricing', entityId: 'coaster', description: 'Updated Coaster fuel cost per litre from ₦1,200 to ₦1,300', timestamp: daysAgo(0), previousValue: '1200', newValue: '1300' },
  { id: 'act-003', userId: 'usr-002', userName: 'Kemi Adeyinka', action: 'Booking Created', entity: 'Booking', entityId: 'bk-003', description: 'Created booking BK-20260721-003 for Dr. Adaeze Okonkwo', timestamp: daysAgo(1), previousValue: null, newValue: 'confirmed' },
  { id: 'act-004', userId: 'usr-003', userName: 'Tolu Obi', action: 'Quote Rejected', entity: 'Quote', entityId: 'q-007', description: 'Rejected quote NETS-20260717-007007 — NGO budget constraint', timestamp: daysAgo(1), previousValue: 'reviewed', newValue: 'rejected' },
  { id: 'act-005', userId: 'usr-001', userName: 'Adebayo Ogundimu', action: 'Vehicle Added', entity: 'Vehicle', entityId: 'sedan', description: 'Added Executive Sedan (ABJ-678-YZA) to fleet', timestamp: daysAgo(2), previousValue: null, newValue: 'active' },
  { id: 'act-006', userId: 'usr-003', userName: 'Tolu Obi', action: 'Quote Created', entity: 'Quote', entityId: 'q-001', description: 'New quote NETS-20260723-001001 from Journey Planner', timestamp: daysAgo(2), previousValue: null, newValue: 'new' },
  { id: 'act-007', userId: 'usr-002', userName: 'Kemi Adeyinka', action: 'Booking Completed', entity: 'Booking', entityId: 'bk-002', description: 'Marked BK-20260722-002 as completed', timestamp: daysAgo(2), previousValue: 'dispatched', newValue: 'completed' },
  { id: 'act-008', userId: 'usr-004', userName: 'Uche Nwachukwu', action: 'Payment Recorded', entity: 'Booking', entityId: 'bk-005', description: 'Full payment recorded for BK-20260719-005 — ₦403,620', timestamp: daysAgo(3), previousValue: 'pending', newValue: 'paid' },
  { id: 'act-009', userId: 'usr-001', userName: 'Adebayo Ogundimu', action: 'User Login', entity: 'User', entityId: 'usr-001', description: 'Adebayo Ogundimu logged in', timestamp: daysAgo(0), previousValue: null, newValue: null },
  { id: 'act-010', userId: 'usr-001', userName: 'Adebayo Ogundimu', action: 'Image Updated', entity: 'Vehicle', entityId: 'hiace', description: 'Replaced primary image for Toyota HiAce', timestamp: daysAgo(4), previousValue: 'unsplash-url', newValue: '/vehicles/hiace.jpg' },
]

// ── Promotions ────────────────────────────────────────────────────────────────
export const mockPromotions: Promotion[] = [
  { id: 'promo-001', title: 'End of Year Corporate Deal', type: 'offer', description: '15% off all corporate shuttle bookings in December', startDate: daysFromNow(160), endDate: daysFromNow(191), visible: true, ctaText: 'Get a Quote', ctaUrl: '/plan', priority: 1, status: 'scheduled' },
  { id: 'promo-002', title: 'Airport Transfer Flash Offer', type: 'banner', description: 'Fixed-rate airport transfers within Lagos — book before the 31st', startDate: daysAgo(5), endDate: daysFromNow(25), visible: true, ctaText: 'Plan Your Journey', ctaUrl: '/plan', priority: 2, status: 'active' },
  { id: 'promo-003', title: 'Conference Season Discount', type: 'campaign', description: 'Special rates for conference and event transport in Q3', startDate: daysAgo(20), endDate: daysAgo(5), visible: false, ctaText: 'Book Now', ctaUrl: '/plan', priority: 3, status: 'expired' },
]
