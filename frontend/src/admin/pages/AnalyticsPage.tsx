// ============================================================================
// NETS Admin — Analytics Dashboard
// ============================================================================
import { BarChart3, TrendingUp, Users, Truck, ArrowUpRight } from 'lucide-react'
import { useAdminStore } from '../store/useAdminStore'

const fmt = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`

export function AnalyticsPage() {
  const { quotes, bookings, customers, vehicles } = useAdminStore()

  // KPIs
  const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0)
  const conversionRate = quotes.length > 0 ? Math.round((quotes.filter(q => q.status === 'converted').length / quotes.length) * 100) : 0
  const avgDistance = bookings.length > 0 ? Math.round(bookings.reduce((s, b) => s + b.distanceKm, 0) / bookings.length) : 0
  const fleetUtil = vehicles.length > 0 ? Math.round((vehicles.filter(v => v.available).length / vehicles.length) * 100) : 0

  // Most requested vehicle
  const vehicleCounts = bookings.reduce<Record<string, { name: string; count: number }>>((acc, b) => {
    if (!acc[b.vehicleId]) acc[b.vehicleId] = { name: b.vehicleName, count: 0 }
    acc[b.vehicleId].count++
    return acc
  }, {})
  const topVehicle = Object.values(vehicleCounts).sort((a, b) => b.count - a.count)[0]

  // Top routes
  const routeCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    const key = `${b.pickup.split(',')[0]} → ${b.destination.split(',')[0]}`
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
  const topRoutes = Object.entries(routeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Revenue by vehicle
  const revenueByVehicle = bookings.filter(b => b.paymentStatus === 'paid').reduce<Record<string, { name: string; total: number }>>((acc, b) => {
    if (!acc[b.vehicleId]) acc[b.vehicleId] = { name: b.vehicleName, total: 0 }
    acc[b.vehicleId].total += b.totalAmount
    return acc
  }, {})
  const topRevVehicles = Object.values(revenueByVehicle).sort((a, b) => b.total - a.total)

  const Bar = ({ value, max, color = 'var(--adm-accent)' }: { value: number; max: number; color?: string }) => (
    <div style={{ flex: 1, height: 6, background: 'var(--adm-surface-3)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ width: `${(value / max) * 100}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
    </div>
  )

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Analytics Dashboard</div>
          <div className="admin-page-desc">Enterprise KPIs and operational intelligence. Chart integrations ready for Phase 9.</div>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="admin-stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        <div className="admin-stat-card" style={{ borderTop: '2px solid var(--adm-success)' }}>
          <div className="admin-stat-label">Total Revenue (Paid)</div>
          <div className="admin-stat-value" style={{ fontSize: '1.25rem' }}>{fmt(totalRevenue)}</div>
          <div className="admin-stat-sub admin-stat-trend-up"><ArrowUpRight size={12} style={{ display: 'inline' }} /> Confirmed payments</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Bookings</div>
          <div className="admin-stat-value">{bookings.length}</div>
          <div className="admin-stat-sub">{bookings.filter(b => b.operationalStatus === 'completed').length} completed</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Quote Conversion Rate</div>
          <div className="admin-stat-value">{conversionRate}<span style={{ fontSize: 16, color: 'var(--adm-text-3)' }}>%</span></div>
          <div className="admin-stat-sub">{quotes.filter(q => q.status === 'converted').length} of {quotes.length} quotes</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Avg Journey Distance</div>
          <div className="admin-stat-value">{avgDistance}<span style={{ fontSize: 16, color: 'var(--adm-text-3)' }}>km</span></div>
          <div className="admin-stat-sub">Across all bookings</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Fleet Utilisation</div>
          <div className="admin-stat-value">{fleetUtil}<span style={{ fontSize: 16, color: 'var(--adm-text-3)' }}>%</span></div>
          <div className="admin-stat-sub">{vehicles.filter(v => v.available).length} of {vehicles.length} vehicles available</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Customers</div>
          <div className="admin-stat-value">{customers.length}</div>
          <div className="admin-stat-sub">{customers.filter(c => c.type === 'corporate').length} corporate accounts</div>
        </div>
      </div>

      <div className="admin-grid-2" style={{ gap: '1.5rem' }}>
        {/* Top Routes */}
        <div className="admin-card">
          <div className="admin-card-title"><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={14} /> Most Popular Routes</span></div>
          {topRoutes.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--adm-text-3)', textAlign: 'center', padding: '1rem' }}>No data yet</div>
          ) : topRoutes.map(([route, count], i) => (
            <div key={route} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: 11, color: 'var(--adm-text-3)', width: 16, textAlign: 'right' }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--adm-text-1)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{route}</div>
                <Bar value={count} max={topRoutes[0][1]} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--adm-text-2)', width: 24, textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Revenue by Vehicle */}
        <div className="admin-card">
          <div className="admin-card-title"><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Truck size={14} /> Revenue by Vehicle</span></div>
          {topRevVehicles.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--adm-text-3)', textAlign: 'center', padding: '1rem' }}>No paid bookings yet</div>
          ) : topRevVehicles.map((v, i) => (
            <div key={v.name} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: 11, color: 'var(--adm-text-3)', width: 16, textAlign: 'right' }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--adm-text-1)', marginBottom: '0.25rem' }}>{v.name}</div>
                <Bar value={v.total} max={topRevVehicles[0].total} color="var(--adm-success)" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--adm-text-2)', width: 80, textAlign: 'right' }}>{fmt(v.total)}</span>
            </div>
          ))}
        </div>

        {/* Chart placeholder — Bookings Over Time */}
        <div className="admin-card">
          <div className="admin-card-title"><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BarChart3 size={14} /> Bookings Over Time</span></div>
          <div className="admin-chart-placeholder" style={{ height: 200 }}>
            <BarChart3 size={32} color="var(--adm-border)" />
            <div>Chart integration ready</div>
            <div style={{ fontSize: 12 }}>Connect Recharts or Chart.js in Phase 9</div>
          </div>
        </div>

        {/* Chart placeholder — Revenue Trend */}
        <div className="admin-card">
          <div className="admin-card-title"><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={14} /> Revenue Trend</span></div>
          <div className="admin-chart-placeholder" style={{ height: 200 }}>
            <TrendingUp size={32} color="var(--adm-border)" />
            <div>Chart integration ready</div>
            <div style={{ fontSize: 12 }}>Connect Recharts or Chart.js in Phase 9</div>
          </div>
        </div>
      </div>

      {/* Customer Summary */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card-title"><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} /> Top Customers by Spend</span></div>
        <table className="admin-table">
          <thead><tr><th>#</th><th>Customer</th><th>Type</th><th>Bookings</th><th>Total Spend</th></tr></thead>
          <tbody>
            {customers.sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 5).map((c, i) => (
              <tr key={c.id}>
                <td style={{ color: 'var(--adm-text-3)', fontSize: 12 }}>{i + 1}</td>
                <td>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{c.fullName}</div>
                  <div style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{c.company ?? 'Individual'}</div>
                </td>
                <td><span className={`admin-badge ${c.type === 'corporate' ? 'admin-badge-accent' : 'admin-badge-gray'}`}>{c.type}</span></td>
                <td style={{ fontWeight: 500 }}>{c.totalBookings}</td>
                <td style={{ fontWeight: 600 }}>{fmt(c.totalSpend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
