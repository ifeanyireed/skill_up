import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, GripVertical, Save } from 'lucide-react'
import { createAdminForm, updateAdminForm, getAdminForm, Form, FormField } from '../services/formService'
import '../admin.css'

export function AdminFormBuilder() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = id && id !== 'new'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [fields, setFields] = useState<FormField[]>([])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEditing) {
      getAdminForm(id!)
        .then((data) => {
          setTitle(data.title)
          setDescription(data.description || '')
          setIsActive(data.is_active)
          setFields(data.fields || [])
        })
        .catch(() => alert('Failed to load form'))
        .finally(() => setLoading(false))
    }
  }, [id, isEditing])

  const addField = (type: string) => {
    setFields([...fields, {
      label: `New ${type} Field`,
      type,
      is_required: false,
      order_index: fields.length,
      options: type === 'select' || type === 'radio' ? '[]' : ''
    }])
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...updates }
    setFields(newFields)
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!title.trim()) return alert('Form title is required')
    if (fields.length === 0) return alert('Add at least one field')

    setSaving(true)
    const payload: Partial<Form> = { title, description, is_active: isActive, fields }

    try {
      if (isEditing) {
        await updateAdminForm(id!, payload)
        alert('Form updated successfully!')
      } else {
        await createAdminForm(payload)
        alert('Form created successfully!')
      }
      navigate('/admin/forms')
    } catch (err) {
      alert('Failed to save form')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading builder...</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/forms')} style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="admin-page-title">{isEditing ? 'Edit Form' : 'Create New Form'}</h1>
          </div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Form'}
        </button>
      </div>

      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="admin-input-group">
          <label className="admin-label">Form Title <span style={{ color: 'var(--adm-danger)' }}>*</span></label>
          <input className="admin-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Summer Camp Registration" />
        </div>
        <div className="admin-input-group">
          <label className="admin-label">Description</label>
          <textarea className="admin-input" rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Form instructions or subtitle" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
          <label htmlFor="isActive" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Accepting Submissions</label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Fields List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0 }}>Form Fields</h3>
          {fields.length === 0 && (
            <div className="admin-card" style={{ textAlign: 'center', color: 'var(--adm-text-3)', padding: '2rem' }}>
              No fields added yet. Use the sidebar to add fields.
            </div>
          )}
          {fields.map((field, idx) => (
            <div key={idx} className="admin-card" style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
              <div style={{ cursor: 'grab', color: 'var(--adm-text-3)', paddingTop: '0.5rem' }}>
                <GripVertical size={20} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="admin-input-group" style={{ flex: 1, margin: 0 }}>
                    <label className="admin-label">Field Label</label>
                    <input className="admin-input" value={field.label} onChange={e => updateField(idx, { label: e.target.value })} />
                  </div>
                  <div className="admin-input-group" style={{ width: '150px', margin: 0 }}>
                    <label className="admin-label">Type</label>
                    <input className="admin-input" value={field.type} disabled style={{ background: 'var(--adm-bg)' }} />
                  </div>
                </div>

                {(field.type === 'select' || field.type === 'radio') && (
                  <div className="admin-input-group" style={{ margin: 0 }}>
                    <label className="admin-label">Options (JSON Array)</label>
                    <input className="admin-input" value={field.options} onChange={e => updateField(idx, { options: e.target.value })} placeholder='["Option 1", "Option 2"]' />
                    <span style={{ fontSize: '11px', color: 'var(--adm-text-3)' }}>Must be valid JSON like ["A","B"]</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id={`req-${idx}`} checked={field.is_required} onChange={e => updateField(idx, { is_required: e.target.checked })} />
                    <label htmlFor={`req-${idx}`} style={{ fontSize: '0.85rem' }}>Required Field</label>
                  </div>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: 'var(--adm-danger)' }} onClick={() => removeField(idx)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="admin-card" style={{ width: '250px', position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Add Field</h4>
          <button className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => addField('text')}>
            <Plus size={14} /> Short Text
          </button>
          <button className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => addField('textarea')}>
            <Plus size={14} /> Long Text
          </button>
          <button className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => addField('email')}>
            <Plus size={14} /> Email
          </button>
          <button className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => addField('number')}>
            <Plus size={14} /> Number
          </button>
          <button className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => addField('select')}>
            <Plus size={14} /> Dropdown
          </button>
          <button className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => addField('radio')}>
            <Plus size={14} /> Multiple Choice
          </button>
          <button className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => addField('date')}>
            <Plus size={14} /> Date
          </button>
        </div>
      </div>
    </div>
  )
}
