import { API_URL } from '../../config/api'

export interface AdminStats {
  totalQuotes: number
  pendingLeads: number
  unreadContacts: number
  activeFleet: number
  totalPipelineValue: number
}

export interface AdminLead {
  id: number
  leadReference: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  company?: string
  journeyType?: string
  origin?: string
  destination?: string
  estimatedInvestmentMin?: number
  estimatedInvestmentMax?: number
  status: string
  createdAt: string
  payload?: any
}

export interface AdminBookingDB {
  id: string
  reference: string
  quoteReference?: string
  customerId?: string
  customerName: string
  vehicleId?: string
  vehicleName: string
  driverId?: string
  driverName?: string
  pickup: string
  destination: string
  distanceKm: number
  durationMins: number
  tripType: string
  passengerCount: number
  travelDate: string
  totalAmount: number
  paymentStatus: 'pending' | 'partial' | 'paid' | 'invoiced' | 'overdue'
  operationalStatus: 'pending' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
}

export interface AdminCustomerDB {
  id: string
  fullName: string
  email: string
  phone?: string
  company?: string
  type: 'corporate' | 'individual'
  totalBookings: number
  totalSpend: number
  notes?: string
  createdAt: string
}

export interface AdminUserDB {
  id: string
  fullName: string
  email: string
  role: string
  status: 'active' | 'inactive'
  lastLogin?: string
  createdAt: string
}

export class AdminService {
  /**
   * Fetch live dashboard statistics from Go REST API backend.
   */
  public async getStats(): Promise<AdminStats> {
    try {
      const res = await fetch(`${API_URL}/admin/stats`)
      if (res.ok) {
        const json = await res.json()
        if (json.data) return json.data
      }
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not fetch stats from backend:', err)
    }
    return {
      totalQuotes: 0,
      pendingLeads: 0,
      unreadContacts: 0,
      activeFleet: 0,
      totalPipelineValue: 0,
    }
  }

  /**
   * Fetch all leads/quotes from Go REST API backend.
   */
  public async getLeads(): Promise<AdminLead[]> {
    try {
      const res = await fetch(`${API_URL}/leads`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data.leads)) {
          return json.data.leads
        }
      }
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not fetch leads from backend:', err)
    }
    return []
  }

  /**
   * Update lead status.
   */
  public async updateLeadStatus(id: number | string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      return res.ok
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not update lead status:', err)
      return false
    }
  }

  /**
   * Fetch all bookings from Go REST API backend.
   */
  public async getBookings(): Promise<AdminBookingDB[]> {
    try {
      const res = await fetch(`${API_URL}/bookings`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data.bookings)) {
          return json.data.bookings
        }
      }
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not fetch bookings from backend:', err)
    }
    return []
  }

  /**
   * Update booking operational/payment status.
   */
  public async updateBooking(id: string, updates: Partial<AdminBookingDB>): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return res.ok
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not update booking:', err)
      return false
    }
  }

  /**
   * Fetch all customers from Go REST API backend.
   */
  public async getCustomers(): Promise<AdminCustomerDB[]> {
    try {
      const res = await fetch(`${API_URL}/customers`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data.customers)) {
          return json.data.customers
        }
      }
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not fetch customers from backend:', err)
    }
    return []
  }

  /**
   * Fetch all admin users from Go REST API backend.
   */
  public async getUsers(): Promise<AdminUserDB[]> {
    try {
      const res = await fetch(`${API_URL}/users`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data.users)) {
          return json.data.users
        }
      }
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not fetch users from backend:', err)
    }
    return []
  }

  /**
   * Create a new admin user in backend.
   */
  public async saveUser(user: Partial<AdminUserDB>): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      return res.ok
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not save user:', err)
      return false
    }
  }

  /**
   * Update user status (active/inactive).
   */
  public async updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      return res.ok
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not update user status:', err)
      return false
    }
  }

  /**
   * Delete vehicle from backend.
   */
  public async deleteVehicle(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/vehicles/${id}`, { method: 'DELETE' })
      return res.ok
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not delete vehicle:', err)
      return false
    }
  }

  /**
   * Save (create or update) vehicle in backend.
   */
  public async saveVehicle(vehicleData: any, isEdit: boolean): Promise<boolean> {
    try {
      const url = isEdit ? `${API_URL}/vehicles/${vehicleData.id}` : `${API_URL}/vehicles`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      })
      return res.ok
    } catch (err) {
      console.warn('⚠️ [ADMIN SERVICE] Could not save vehicle:', err)
      return false
    }
  }
}

export const adminService = new AdminService()
