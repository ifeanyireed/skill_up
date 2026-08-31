import { API_BASE_URL } from './api'

export interface FormField {
  id?: number
  form_id?: number
  label: string
  type: string
  options?: string
  is_required: boolean
  order_index: number
}

export interface Form {
  id?: number
  title: string
  description?: string
  slug?: string
  is_active: boolean
  fields: FormField[]
  created_at?: string
}

export interface FormSubmission {
  id: number
  form_id: number
  data: string
  created_at: string
}

const getAuthHeaders = () => {
  let token = ''
  try {
    const sessionStr = localStorage.getItem('skillup_admin_session')
    if (sessionStr) {
      const parsed = JSON.parse(sessionStr)
      if (parsed.token) token = parsed.token
    }
  } catch (err) {}
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

// -- Admin Endpoints --

export async function getAdminForms(): Promise<Form[]> {
  const res = await fetch(`${API_BASE_URL}/admin/forms`, {
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error('Failed to fetch forms')
  return res.json()
}

export async function getAdminForm(id: number | string): Promise<Form> {
  const res = await fetch(`${API_BASE_URL}/admin/forms/${id}`, {
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error('Failed to fetch form details')
  return res.json()
}

export async function createAdminForm(form: Partial<Form>): Promise<Form> {
  const res = await fetch(`${API_BASE_URL}/admin/forms`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(form)
  })
  if (!res.ok) throw new Error('Failed to create form')
  return res.json()
}

export async function updateAdminForm(id: number | string, form: Partial<Form>): Promise<Form> {
  const res = await fetch(`${API_BASE_URL}/admin/forms/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(form)
  })
  if (!res.ok) throw new Error('Failed to update form')
  return res.json()
}

export async function deleteAdminForm(id: number | string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/forms/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error('Failed to delete form')
}

export async function getFormSubmissions(id: number | string): Promise<FormSubmission[]> {
  const res = await fetch(`${API_BASE_URL}/admin/forms/${id}/submissions`, {
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error('Failed to fetch submissions')
  return res.json()
}

// -- Public Endpoints --

export async function getPublicForm(slug: string): Promise<Form> {
  const res = await fetch(`${API_BASE_URL}/forms/${slug}`)
  if (!res.ok) throw new Error('Form not found or inactive')
  return res.json()
}

export async function submitPublicForm(slug: string, data: Record<string, any>): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/forms/${slug}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const text = await res.text()
    try {
      const err = JSON.parse(text)
      throw new Error(err.error || 'Submission failed')
    } catch {
      throw new Error('Submission failed')
    }
  }
}
