// ============================================================================
// NETS Admin — Pricing Administration
// ============================================================================
// Editable pricing configurations that feed directly into the pricing engine.
// ============================================================================
import { useState } from 'react'
import { Save, RefreshCw, Info } from 'lucide-react'

// Pricing configuration state — mirrors vehiclePricingConfig.ts values
interface PricingConfig {
  fuelPricePerLitre: number
  driverDailyAllowance: number
  driverOutstationAllowance: number
  maintenanceCostPerKm: number
  minimumChargeHiace: number
  minimumChargeCoaster: number
  hiaceMarkupPercent: number
  coasterMarkupPercent: number
  airportSurcharge: number
  waitingChargePerHour: number
  overnightChargePerNight: number
  longDistanceThresholdKm: number
  longDistanceSurchargePercent: number
  corporateDiscountPercent: number
}

const defaultConfig: PricingConfig = {
  fuelPricePerLitre: 1300,
  driverDailyAllowance: 10000,
  driverOutstationAllowance: 25000,
  maintenanceCostPerKm: 50,
  minimumChargeHiace: 90000,
  minimumChargeCoaster: 180000,
  hiaceMarkupPercent: 20,
  coasterMarkupPercent: 25,
  airportSurcharge: 15000,
  waitingChargePerHour: 5000,
  overnightChargePerNight: 35000,
  longDistanceThresholdKm: 200,
  longDistanceSurchargePercent: 10,
  corporateDiscountPercent: 5,
}

const sections = [
  {
    title: 'Fuel & Operating Costs',
    fields: [
      { key: 'fuelPricePerLitre', label: 'Fuel Price Per Litre', desc: 'Current market pump price in NGN', prefix: '₦' },
      { key: 'maintenanceCostPerKm', label: 'Maintenance Cost Per KM', desc: 'Amortised vehicle maintenance per kilometre', prefix: '₦' },
      { key: 'driverDailyAllowance', label: 'Driver Daily Allowance', desc: 'Per-day driver compensation for local trips', prefix: '₦' },
      { key: 'driverOutstationAllowance', label: 'Driver Outstation Allowance', desc: 'Additional daily allowance for multi-day trips', prefix: '₦' },
    ],
  },
  {
    title: 'Minimum Charges',
    fields: [
      { key: 'minimumChargeHiace', label: 'Minimum Charge — HiAce', desc: 'Floor price for any HiAce journey', prefix: '₦' },
      { key: 'minimumChargeCoaster', label: 'Minimum Charge — Coaster', desc: 'Floor price for any Coaster journey', prefix: '₦' },
    ],
  },
  {
    title: 'Markup & Margin',
    fields: [
      { key: 'hiaceMarkupPercent', label: 'HiAce Markup (%)', desc: 'Profit margin applied to HiAce engine cost', prefix: '', suffix: '%' },
      { key: 'coasterMarkupPercent', label: 'Coaster Markup (%)', desc: 'Profit margin applied to Coaster engine cost', prefix: '', suffix: '%' },
      { key: 'corporateDiscountPercent', label: 'Corporate Account Discount (%)', desc: 'Standard discount for contracted corporate clients', prefix: '', suffix: '%' },
    ],
  },
  {
    title: 'Surcharges & Special Rates',
    fields: [
      { key: 'airportSurcharge', label: 'Airport Surcharge', desc: 'Additional fee for airport pickup/drop-off journeys', prefix: '₦' },
      { key: 'waitingChargePerHour', label: 'Waiting Charge Per Hour', desc: 'Billed for driver waiting time beyond free period', prefix: '₦' },
      { key: 'overnightChargePerNight', label: 'Overnight Charge Per Night', desc: 'Accommodation and allowance for overnight trips', prefix: '₦' },
      { key: 'longDistanceThresholdKm', label: 'Long Distance Threshold (KM)', desc: 'Minimum distance to trigger long distance surcharge', prefix: '', suffix: ' km' },
      { key: 'longDistanceSurchargePercent', label: 'Long Distance Surcharge (%)', desc: 'Extra percentage added for journeys beyond threshold', prefix: '', suffix: '%' },
    ],
  },
]

export function PricingAdminPage() {
  const [config, setConfig] = useState<PricingConfig>({ ...defaultConfig })
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState<{ timestamp: string; config: PricingConfig }[]>([])

  const handleSave = () => {
    setHistory(h => [{ timestamp: new Date().toISOString(), config: { ...config } }, ...h.slice(0, 4)])
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => setConfig({ ...defaultConfig })

  const fmtDate = (iso: string) => new Date(iso).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Pricing Administration</div>
          <div className="admin-page-desc">All pricing values feed directly into the Journey Planner engine. Changes take effect immediately.</div>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-ghost" onClick={handleReset}><RefreshCw size={13} /> Reset Defaults</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave}><Save size={13} /> {saved ? 'Saved ✓' : 'Save Changes'}</button>
        </div>
      </div>

      {saved && (
        <div className="admin-alert admin-alert-success" style={{ marginBottom: '1.25rem' }}>
          ✓ Pricing configuration saved. The Journey Planner will reflect these values immediately.
        </div>
      )}

      <div className="admin-grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        <div>
          {sections.map(section => (
            <div key={section.title} className="admin-card" style={{ marginBottom: '1.25rem' }}>
              <div className="admin-pricing-section-title">{section.title}</div>
              {section.fields.map(field => (
                <div key={field.key} className="admin-pricing-row">
                  <div>
                    <div className="admin-pricing-row-label">{field.label}</div>
                    <div className="admin-pricing-row-desc">{field.desc}</div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    {field.prefix && (
                      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-text-2)', fontSize: 13, fontWeight: 500 }}>{field.prefix}</span>
                    )}
                    <input
                      className="admin-input"
                      type="number"
                      value={(config as any)[field.key]}
                      onChange={e => setConfig(c => ({ ...c, [field.key]: parseFloat(e.target.value) || 0 }))}
                      style={{ paddingLeft: field.prefix ? '1.75rem' : undefined, textAlign: 'right' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div>
          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-card-title">Live Preview</div>
            <div style={{ fontSize: 13, color: 'var(--adm-text-2)', marginBottom: '1rem' }}>
              Sample calculation for a 100km HiAce journey
            </div>
            {(() => {
              const fuelKmHiace = 8 // litres per 100km for hiace
              const fuelCost = (100 / 100) * fuelKmHiace * config.fuelPricePerLitre
              const maintenance = 100 * config.maintenanceCostPerKm
              const driver = config.driverDailyAllowance
              const baseCost = fuelCost + maintenance + driver
              const withMarkup = baseCost * (1 + config.hiaceMarkupPercent / 100)
              const final = Math.max(withMarkup, config.minimumChargeHiace)
              const fmt = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`
              return (
                <div>
                  {[['Fuel Cost (100km)', fmt(fuelCost)], ['Maintenance', fmt(maintenance)], ['Driver Allowance', fmt(driver)], ['Base Cost', fmt(baseCost)], [`+ Markup (${config.hiaceMarkupPercent}%)`, fmt(withMarkup - baseCost)],].map(([l,v]) => (
                    <div key={l as string} className="admin-detail-row">
                      <span className="admin-detail-label" style={{ fontSize: 12 }}>{l}</span>
                      <span className="admin-detail-value" style={{ fontSize: 12 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '0.75rem', padding: '0.875rem', background: 'var(--adm-accent-subtle)', borderRadius: 'var(--adm-radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--adm-accent)' }}>Estimated Investment</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--adm-accent)' }}>{fmt(final)}</span>
                  </div>
                </div>
              )
            })()}
          </div>

          <div className="admin-card">
            <div className="admin-card-title">
              <span>Version History</span>
              <Info size={13} color="var(--adm-text-3)" />
            </div>
            {history.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--adm-text-3)', textAlign: 'center', padding: '1rem' }}>No saved versions yet</div>
            ) : history.map((h, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: '1px solid var(--adm-border-subtle)', fontSize: 12 }}>
                <div>
                  <div style={{ color: 'var(--adm-text-1)', fontWeight: 500 }}>Saved {fmtDate(h.timestamp)}</div>
                  <div style={{ color: 'var(--adm-text-3)' }}>Fuel: ₦{h.config.fuelPricePerLitre.toLocaleString()} / HiAce Min: ₦{h.config.minimumChargeHiace.toLocaleString()}</div>
                </div>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setConfig({ ...h.config })}>Restore</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
