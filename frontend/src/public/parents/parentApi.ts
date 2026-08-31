import { API_BASE_URL } from '../../admin/services/api'
import { BackendChild } from '../../admin/services/api'

export const loginParent = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/parents/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) {
    const text = await res.text()
    let errMsg = 'Login failed'
    try {
      const parsed = JSON.parse(text)
      if (parsed && parsed.error) errMsg = parsed.error
    } catch (e) {}
    throw new Error(errMsg)
  }
  const data = await res.json()
  localStorage.setItem('skillup_parent_token', data.token)
  return data.parent
}

export const registerParent = async (fullName: string, email: string, phone: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/parents/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: fullName, email, phone, password })
  })
  if (!res.ok) {
    const text = await res.text()
    try {
      throw new Error(JSON.parse(text).error)
    } catch {
      throw new Error('Registration failed')
    }
  }
  const data = await res.json()
  localStorage.setItem('skillup_parent_token', data.token)
  return data.parent
}

export const getParentChildren = async (): Promise<BackendChild[]> => {
  const token = localStorage.getItem('skillup_parent_token')
  if (!token) throw new Error('Not authenticated')

  const res = await fetch(`${API_BASE_URL}/parents/children`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to fetch children')
  return res.json()
}

export const parentLogout = () => {
  localStorage.removeItem('skillup_parent_token')
}
