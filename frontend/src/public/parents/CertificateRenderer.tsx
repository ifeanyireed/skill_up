import React, { useRef, useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download, Loader2 } from 'lucide-react'
import { API_BASE_URL } from '../../admin/services/api'

interface CertificateProps {
  studentName: string
  track: string
  group: string
  date: string
}

export function CertificateRenderer({ studentName, track, group, date }: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [templateUrl, setTemplateUrl] = useState('/certificate-template.png')

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const query = new URLSearchParams()
        if (group) query.append('group', group)
        if (track) query.append('track', track)
        const res = await fetch(`${API_BASE_URL}/certificates/match?${query.toString()}`)
        if (res.ok) {
          const data = await res.json()
          if (data.template_url) {
            setTemplateUrl(data.template_url)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchMatch()
  }, [group, track])

  const handleDownload = async () => {
    if (!certRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height])
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height)
      pdf.save(`${studentName.replace(/ /g, '_')}_Certificate.pdf`)
    } catch (err) {
      alert('Failed to generate certificate PDF.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <button 
        className="admin-btn admin-btn-primary" 
        onClick={handleDownload} 
        disabled={downloading}
      >
        {downloading ? <Loader2 size={16} className="spin" /> : <Download size={16} />} 
        {downloading ? 'Generating PDF...' : 'Download Certificate'}
      </button>

      {/* Wrapper to scale down the massive 800px preview visually while keeping DOM real size for html2canvas */}
      <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', overflow: 'hidden', borderRadius: '8px' }}>
        <div style={{ transform: 'scale(0.625)', transformOrigin: 'top left', width: '800px', height: '566px' }}>
          <div 
            ref={certRef} 
            style={{ 
              position: 'relative', 
              width: '800px',
              height: '566px',
              backgroundColor: '#fff',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            {/* Load Handwriting Font */}
            <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />

            {/* Background Graphic */}
            <img 
              src={templateUrl} 
              crossOrigin="anonymous"
              alt="Certificate Background" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            
            {/* Dynamic Name Overlay */}
            <div style={{
              position: 'absolute',
              top: '46%',
              left: '25%', // Center on the right 3/4 of the certificate
              right: '0',
              textAlign: 'center',
              fontSize: '34px',
              fontWeight: 600,
              color: '#002b80', // Richer shade of blue
              fontFamily: "'Great Vibes', cursive"
            }}>
              {studentName}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
