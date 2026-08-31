import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginParent, registerParent } from './parentApi'

export function ParentAuthPage() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await loginParent(email, password)
      } else {
        await registerParent(fullName, email, phone, password)
      }
      navigate('/parents/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 1.5rem 0', color: 'var(--adm-text-1)' }}>
          {isLogin ? 'Parent Portal Login' : 'Register Parent Account'}
        </h2>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <>
              <div>
                <label className="admin-label">Full Name</label>
                <input className="admin-input" type="text" required value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Phone Number (To link your child)</label>
                <input className="admin-input" type="text" required value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </>
          )}

          <div>
            <label className="admin-label">Email Address {isLogin ? '' : '(To link your child)'}</label>
            <input className="admin-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="admin-label">Password</label>
            <input className="admin-input" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button 
            type="submit" 
            className="admin-btn admin-btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login to Portal' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            className="admin-btn admin-btn-ghost" 
            onClick={() => setIsLogin(!isLogin)}
            style={{ margin: '0 auto' }}
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  )
}
