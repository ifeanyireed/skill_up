import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { getPublicForm, submitPublicForm, Form } from '../services/formService'

export function PublicFormViewer() {
  const { slug } = useParams()
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  // State for form values
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (slug) {
      getPublicForm(slug)
        .then((data) => {
          setForm(data)
          // Initialize form state
          const initialData: Record<string, any> = {}
          data.fields.forEach((f) => {
            initialData[f.label] = ''
          })
          setFormData(initialData)
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [slug])

  const handleInputChange = (label: string, value: any) => {
    setFormData((prev) => ({ ...prev, [label]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form || !slug) return

    setSubmitting(true)
    try {
      await submitPublicForm(slug, formData)
      setSubmitted(true)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <p>Loading form...</p>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: 'var(--adm-danger)', margin: '0 0 0.5rem 0' }}>Form Unavailable</h2>
          <p style={{ margin: 0, color: '#4b5563' }}>{error || 'This form does not exist or is no longer accepting submissions.'}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '1rem' }}>
        <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <CheckCircle2 size={64} color="var(--adm-green)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ margin: '0 0 1rem 0', color: 'var(--adm-text-1)' }}>Success!</h2>
          <p style={{ margin: 0, color: 'var(--adm-text-2)' }}>Your response has been recorded successfully.</p>
        </div>
      </div>
    )
  }

  const sortedFields = [...form.fields].sort((a, b) => a.order_index - b.order_index)

  return (
    <div className="admin-shell" style={{ minHeight: '100vh', background: '#f3f4f6', padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '1.5rem', borderTop: '8px solid var(--adm-primary)' }}>
          <h1 style={{ margin: '0 0 0.5rem 0', color: 'var(--adm-text-1)', fontSize: '2rem' }}>{form.title}</h1>
          {form.description && (
            <p style={{ margin: 0, color: 'var(--adm-text-2)', fontSize: '1.1rem', lineHeight: 1.5 }}>
              {form.description}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {sortedFields.map((field) => {
            let options: string[] = []
            if (field.type === 'select' || field.type === 'radio') {
              try {
                options = JSON.parse(field.options || '[]')
              } catch {
                options = []
              }
            }

            return (
              <div key={field.id} style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <label style={{ display: 'block', fontWeight: 600, color: 'var(--adm-text-1)', marginBottom: '1rem', fontSize: '1.05rem' }}>
                  {field.label} {field.is_required && <span style={{ color: 'var(--adm-danger)' }}>*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea 
                    className="admin-input" 
                    rows={4} 
                    required={field.is_required}
                    value={formData[field.label]}
                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                  />
                ) : field.type === 'select' ? (
                  <select 
                    className="admin-select" 
                    required={field.is_required}
                    value={formData[field.label]}
                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                  >
                    <option value="">Select an option...</option>
                    {options.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'radio' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {options.map((opt, i) => (
                      <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name={`field-${field.id}`} 
                          required={field.is_required}
                          checked={formData[field.label] === opt}
                          onChange={() => handleInputChange(field.label, opt)}
                          style={{ width: '1.1rem', height: '1.1rem' }}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input 
                    type={field.type} 
                    className="admin-input" 
                    required={field.is_required}
                    value={formData[field.label]}
                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                  />
                )}
              </div>
            )
          })}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={submitting}
              style={{
                background: 'var(--adm-primary)',
                color: 'white',
                border: 'none',
                padding: '0.875rem 2rem',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
