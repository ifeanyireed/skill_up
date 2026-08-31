import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Table } from 'lucide-react'
import { getAdminForm, getFormSubmissions, Form, FormSubmission } from '../services/formService'
import '../admin.css'

export function AdminFormSubmissions() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState<Form | null>(null)
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      Promise.all([getAdminForm(id), getFormSubmissions(id)])
        .then(([formData, subData]) => {
          setForm(formData)
          setSubmissions(subData)
        })
        .catch(() => alert('Failed to load submissions'))
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) return <p>Loading submissions...</p>
  if (!form) return <p>Form not found.</p>

  // Parse JSON data for each submission
  const parsedSubmissions = submissions.map((sub) => {
    try {
      return { id: sub.id, created_at: sub.created_at, data: JSON.parse(sub.data) }
    } catch {
      return { id: sub.id, created_at: sub.created_at, data: {} }
    }
  })

  // Extract column headers based on form fields
  const headers = form.fields.sort((a, b) => a.order_index - b.order_index)

  const exportCsv = () => {
    if (parsedSubmissions.length === 0) return
    let csv = 'Submission ID,Date,' + headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(',') + '\n'
    parsedSubmissions.forEach((sub) => {
      const date = new Date(sub.created_at).toLocaleString()
      const row = [sub.id, `"${date}"`]
      headers.forEach((h) => {
        const val = sub.data[h.label] || ''
        row.push(`"${String(val).replace(/"/g, '""')}"`)
      })
      csv += row.join(',') + '\n'
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.slug}_submissions.csv`
    a.click()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/forms')} style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="admin-page-title">{form.title} - Submissions</h1>
            <p className="admin-page-desc">Total: {submissions.length} responses</p>
          </div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={exportCsv} disabled={submissions.length === 0}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        {submissions.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--adm-text-3)' }}>
            <Table size={48} style={{ margin: '0 auto 1rem' }} />
            <p>No submissions yet.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                {headers.map((h) => (
                  <th key={h.id}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedSubmissions.map((sub) => (
                <tr key={sub.id}>
                  <td>#{sub.id}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(sub.created_at).toLocaleString()}</td>
                  {headers.map((h) => (
                    <td key={h.id}>{String(sub.data[h.label] || '-')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
