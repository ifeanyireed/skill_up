// ============================================================================
// NETS Admin — Fleet Media Management
// ============================================================================
import { useState, useEffect, useRef } from 'react'
import { Upload, Eye, Trash2, Star, Check } from 'lucide-react'
import { useAdminStore } from '../store/useAdminStore'
import { vehicleService } from '../../services/vehicleService'
import { adminService } from '../services/adminService'
import { Vehicle } from '../../types'

export function MediaPage() {
  const { session } = useAdminStore()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('')
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadVehicles = () => {
    vehicleService.getVehicles().then((list) => {
      setVehicles(list)
      if (list.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(list[0].id)
      }
    })
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  const vehicle = vehicles.find(v => v.id === selectedVehicleId)
  const userId = session.user?.id ?? 'usr-001'
  const userName = session.user?.fullName ?? 'Admin'

  const handleApplyImage = async (newUrl: string) => {
    if (!vehicle) return
    setSaving(true)
    const success = await adminService.saveVehicle({
      id: vehicle.id,
      name: vehicle.name,
      slug: vehicle.slug,
      category: vehicle.category,
      capacity: vehicle.capacity,
      imageUrl: newUrl,
      available: vehicle.available,
    }, true)

    if (success) {
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
      loadVehicles()
      setPreview(null)
    }
    setSaving(false)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !vehicle) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    e.target.value = ''
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Fleet Media Management</div>
          <div className="admin-page-desc">Upload and manage official vehicle photography. Changes reflect on the public website immediately.</div>
        </div>
      </div>

      <div className="admin-grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        {/* Vehicle selector */}
        <div>
          <div className="admin-card" style={{ marginBottom: '1.25rem', padding: 0 }}>
            <div className="admin-card-title" style={{ padding: '0.875rem 1.25rem', marginBottom: 0, borderBottom: '1px solid var(--adm-border)' }}>Select Vehicle</div>
            {vehicles.map(v => (
              <div key={v.id} onClick={() => setSelectedVehicleId(v.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem',
                  cursor: 'pointer', borderBottom: '1px solid var(--adm-border-subtle)',
                  background: selectedVehicleId === v.id ? 'var(--adm-accent-subtle)' : undefined,
                }}>
                <img src={v.imageUrl} alt={v.name} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13, color: selectedVehicleId === v.id ? 'var(--adm-accent)' : 'var(--adm-text-1)' }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{v.id.toUpperCase()} · {v.category}</div>
                </div>
                {selectedVehicleId === v.id && <Star size={12} color="var(--adm-accent)" style={{ marginLeft: 'auto' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Image editor */}
        {vehicle && (
          <div>
            <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
              <div className="admin-card-title">Primary Image — {vehicle.name}</div>

              {/* Current image */}
              <div style={{ position: 'relative', marginBottom: '1rem', borderRadius: 'var(--adm-radius)', overflow: 'hidden', background: 'var(--adm-surface-2)' }}>
                <img
                  src={preview ?? vehicle.imageUrl}
                  alt={vehicle.name}
                  style={{ width: '100%', height: 240, objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.375rem' }}>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setPreview(null)}>
                    <Eye size={12} /> Preview Live
                  </button>
                </div>
              </div>

              {/* Upload area */}
              <div
                style={{
                  border: '2px dashed var(--adm-border)', borderRadius: 'var(--adm-radius)',
                  padding: '2rem', textAlign: 'center', cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault()
                  const file = e.dataTransfer.files[0]
                  if (file && vehicle) {
                    const url = URL.createObjectURL(file)
                    setPreview(url)
                  }
                }}>
                <Upload size={24} color="var(--adm-text-3)" style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontSize: 14, color: 'var(--adm-text-1)', fontWeight: 500, marginBottom: '0.375rem' }}>Drop image here or click to browse</div>
                <div style={{ fontSize: 12, color: 'var(--adm-text-3)' }}>PNG, JPG, WebP · Max 10MB · Recommended 1200×800px</div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
              </div>

              {savedSuccess && (
                <div className="admin-alert admin-alert-success" style={{ marginTop: '1rem' }}>
                  <Check size={14} /> Primary image updated successfully in database.
                </div>
              )}

              {preview && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className="admin-btn admin-btn-primary" disabled={saving} onClick={() => handleApplyImage(preview)}>
                    {saving ? 'Saving to Database…' : 'Apply Image'}
                  </button>
                  <button className="admin-btn admin-btn-ghost" disabled={saving} onClick={() => setPreview(null)}>Cancel</button>
                </div>
              )}
            </div>

            <div className="admin-card">
              <div className="admin-card-title">Image Guidelines</div>
              <div style={{ fontSize: 13, color: 'var(--adm-text-2)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>✓ Maintain correct aspect ratio — do not crop or stretch</div>
                <div>✓ Ensure NETS branding is clearly visible</div>
                <div>✓ Use clean backgrounds or real-world locations</div>
                <div>✓ Avoid excessive zoom — show the full vehicle</div>
                <div>✓ Minimum resolution: 1200×800px for crisp display</div>
                <div>✗ Do not use competitor vehicle images</div>
                <div>✗ Do not remove or alter NETS branding</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
