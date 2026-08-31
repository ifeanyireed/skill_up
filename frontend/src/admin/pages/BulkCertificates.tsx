import React, { useState, useEffect, useRef } from 'react'
import { getChildren, BackendChild } from '../services/api'
import { Download, Users, Loader2, CheckSquare, Square } from 'lucide-react'
import { API_BASE_URL } from '../services/api'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface BulkCertificatesProps {
  configs: { category_type: string; category_name: string; template_url: string }[]
}

export function BulkCertificates({ configs }: BulkCertificatesProps) {
  const [children, setChildren] = useState<BackendChild[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  // Filters
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')

  const hiddenCertRef = useRef<HTMLDivElement>(null)
  const [currentRenderChild, setCurrentRenderChild] = useState<{ name: string; url: string } | null>(null)

  useEffect(() => {
    setLoading(true)
    getChildren(undefined, search, undefined)
      .then(data => {
        if (groupFilter !== 'all') {
          setChildren(data.filter(c => (c.senior_track || c.group) === groupFilter))
        } else {
          setChildren(data)
        }
      })
      .finally(() => setLoading(false))
  }, [search, groupFilter])

  const toggleAll = () => {
    if (selectedIds.size === children.length && children.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(children.map(c => c.id)))
    }
  }

  const toggleOne = (id: number) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const getTemplateUrl = (child: BackendChild) => {
    const track = child.senior_track
    const group = child.group

    // Try track match
    let match = configs.find(c => c.category_type === 'Track' && c.category_name === track)
    if (match) return match.template_url

    // Try group match
    match = configs.find(c => c.category_type === 'Group' && c.category_name === group)
    if (match) return match.template_url

    return '/certificate-template.png'
  }

  // Wait for image to load
  const waitForImage = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = resolve
      img.onerror = reject
      img.src = url
    })
  }

  // Wait a small bit for DOM to update font
  const wait = (ms: number) => new Promise(res => setTimeout(res, ms))

  const handleBulkGenerate = async () => {
    const selectedChildren = children.filter(c => selectedIds.has(c.id))
    if (selectedChildren.length === 0) return

    setGenerating(true)
    setProgress(0)

    try {
      const pdf = new jsPDF('landscape', 'px', [800, 566])
      let isFirst = true

      for (let i = 0; i < selectedChildren.length; i++) {
        const child = selectedChildren[i]
        const url = getTemplateUrl(child)

        // Preload image to avoid blank render
        await waitForImage(url).catch(() => {})

        // Set state to render this child
        setCurrentRenderChild({ name: child.full_name, url })
        
        // Wait for React to render the DOM node and apply fonts
        await wait(300)

        if (hiddenCertRef.current) {
          const canvas = await html2canvas(hiddenCertRef.current, { scale: 2, useCORS: true })
          const imgData = canvas.toDataURL('image/jpeg', 1.0)
          
          if (!isFirst) {
            pdf.addPage([800, 566], 'landscape')
          }
          pdf.addImage(imgData, 'JPEG', 0, 0, 800, 566)
          isFirst = false
        }

        setProgress(((i + 1) / selectedChildren.length) * 100)
      }

      pdf.save('SkillUp_Bulk_Certificates.pdf')
    } catch (err) {
      console.error(err)
      alert('Error generating bulk certificates. Please try selecting fewer students.')
    } finally {
      setGenerating(false)
      setCurrentRenderChild(null)
      setProgress(0)
    }
  }

  const allGroups = Array.from(new Set(children.map(c => c.senior_track || c.group).filter(Boolean)))

  return (
    <div style={{ background: '#FFF', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
      
      {/* Hidden Renderer for html2canvas */}
      <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
      <div style={{ overflow: 'hidden', height: 0, width: 0, position: 'absolute', top: -9999, left: -9999 }}>
        {currentRenderChild && (
          <div ref={hiddenCertRef} style={{ position: 'relative', width: '800px', height: '566px', backgroundColor: '#fff' }}>
            <img 
              src={currentRenderChild.url} 
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{
              position: 'absolute', top: '46%', left: '15%', right: '5%', textAlign: 'center',
              fontSize: '34px', fontWeight: 600, color: '#002b80', fontFamily: "'Great Vibes', cursive",
              lineHeight: '1', margin: 0, padding: 0
            }}>
              {currentRenderChild.name}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0' }}>Bulk Download Certificates</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Select students to generate a single PDF containing all their certificates.</p>
        </div>
        <button 
          onClick={handleBulkGenerate}
          disabled={selectedIds.size === 0 || generating}
          style={{ background: '#0284C7', color: '#FFF', border: 'none', padding: '0.65rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: (selectedIds.size === 0 || generating) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (selectedIds.size === 0 || generating) ? 0.6 : 1 }}
        >
          {generating ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
          {generating ? `Generating... ${Math.round(progress)}%` : `Download (${selectedIds.size})`}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search student name..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
        />
        <select 
          value={groupFilter}
          onChange={e => setGroupFilter(e.target.value)}
          style={{ width: '200px', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
        >
          <option value="all">All Groups & Tracks</option>
          <option value="Junior Camp (5–10 years)">Junior Camp (5–10 years)</option>
          <option value="Senior Camp (11+ years)">Senior Camp (11+ years)</option>
          <option value="Graphics Design (Corel Draw) + Robotics">Graphics Design (Corel Draw) + Robotics</option>
          <option value="Cybersecurity + Python Programming">Cybersecurity + Python Programming</option>
        </select>
      </div>

      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 1rem', width: '40px' }}>
                <div onClick={toggleAll} style={{ cursor: 'pointer', color: '#64748B' }}>
                  {selectedIds.size === children.length && children.length > 0 ? <CheckSquare size={18} color="#0284C7" /> : <Square size={18} />}
                </div>
              </th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Student Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Group / Track</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Template Assigned</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}><Loader2 size={24} className="spin" style={{ margin: '0 auto' }} /></td></tr>
            ) : children.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>No students found.</td></tr>
            ) : (
              children.map(child => {
                const isSelected = selectedIds.has(child.id)
                const url = getTemplateUrl(child)
                return (
                  <tr key={child.id} style={{ borderBottom: '1px solid #E2E8F0', background: isSelected ? '#F0F9FF' : '#FFF' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div onClick={() => toggleOne(child.id)} style={{ cursor: 'pointer', color: '#64748B' }}>
                        {isSelected ? <CheckSquare size={18} color="#0284C7" /> : <Square size={18} />}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0F172A' }}>{child.full_name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{child.senior_track || child.group}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#0284C7', fontFamily: 'monospace', fontSize: '11px' }}>{url}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
