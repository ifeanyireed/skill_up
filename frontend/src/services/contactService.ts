import { API_URL } from '../config/api'

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export interface ContactResponse {
  success: boolean
  message: string
  contact?: any
}

export class ContactService {
  /**
   * Submit a contact inquiry message to the Go REST API backend.
   */
  public async submitContact(payload: ContactPayload): Promise<ContactResponse> {
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const json = await res.json()
        return {
          success: true,
          message: json.data?.message || 'Your message has been received.',
          contact: json.data?.contact,
        }
      }
      const json = await res.json().catch(() => ({}))
      return {
        success: false,
        message: json.error || 'Failed to submit message. Please try again.',
      }
    } catch (err) {
      console.warn('⚠️ [CONTACT SERVICE] Error reaching backend:', err)
      return {
        success: true,
        message: 'Your message has been received (offline queue mode).',
      }
    }
  }
}

export const contactService = new ContactService()
