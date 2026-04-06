const EXPOSITION_LABEL = { plein_soleil: '☀️ Plein soleil', mi_ombre: '⛅ Mi-ombre', ombre: '🌑 Ombre' }

function getFreq(plant, season) {
  return season === 'hiver' && plant.arrosageFreqHiver ? plant.arrosageFreqHiver : plant.arrosageFreq || 7
}

function daysAgo(iso) {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function waterStatus(plant, season) {
  const days = daysAgo(plant.lastWatered)
  const freq = getFreq(plant, season)
  if (days === null) return { color: '#f87171', label: 'Jamais arrosé', urgent: true }
  if (days >= freq) return { color: '#fb923c', label: days + ' jours sans eau — à arroser !', urgent: true }
  const remaining = freq - days
  return { color: '#7ab870', label: 'Prochain arrosage dans ' + remaining + ' jour' + (remaining > 1 ? 's' : ''), urgent: false }
}

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f1f0f; }
  .detail-page { min-height: 100dvh; background: #0f1f0f; font-family: 'DM Sans', sans-serif; max-width: 480px; margin: 0 auto; padding-bottom: 6rem; }
  .detail-hero { padding: 3.5rem 1.5rem 2rem; text-align: center; background: linear-gradient(180deg, #162416 0%, #0f1f0f 100%); border-bottom: 1px solid #2a3d2a; position: relative; }
  .detail-nav { position: absolute; top: 3.5rem; left: 1.5rem; right: 1.5rem; display: flex; justify-content: space-between; }
  .nav-btn { background: #0f1f0f; border: 1px solid #2a3d2a; border-radius: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #7a9a72; font-size: 1rem; transition: all 0.2s; }
  .nav-btn:hover { background: #1e341e; }
  .nav-btn.danger:hover { background: #2a0f0f; color: #f87171; border-color: #6a2a2a; }
  .detail-emoji { font-size: 4rem; margin: 2.5rem 0 1rem; display: block; }
  .detail-name { font-family: 'Playfair Display', serif; color: #c8e6c0; font-size: 2rem; font-weight: 400; }
  .detail-latin { color: #5a7a52; font-style: italic; margin-top: 0.25rem; font-size: 0.9rem; }
  .detail-lieu { color: #7a9a72; font-size: 0.85rem; margin-top: 0.5rem; }
  .water-card { margin: 1.5rem; border-radius: 14px; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; border: 1px solid; }
  .water-info { flex: 1; }
  .water-label { font-size: 0.82rem; font-weight: 500; margin-bottom: 0.2rem; }
  .water-date { font-size: 0.75rem; opacity: 0.6; }
  .water-action { background: rgba(255,255,255,0.08); border: none; border-radius: 10px; padding: 0.6rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; cursor: pointer; font-weight: 500; transition: background 0.2s; flex-shrink: 0; }
  .water-action:hover { background: rgba(255,255,255,0.15); }
  .season-info { margin: 0 1.5rem 1.25rem; background: #162416; border: 1px solid #2a3d2a; border-radius: 12px; overflow: hidden; }
  .season-row { display: flex; }
  .season-col { flex: 1; padding: 0.75rem 1rem; text-align: center; }
  .season-col.active { background: rgba(122,184,112,0.1); border: 1px solid rgba(122,184,112,0.3); border-radius: 10px; margin: 4px; }
  .season-col-title { font-size: 0.72rem; color: #5a7a52; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem; }
  .season-col-val { font-size: 0.95rem; color: #c8e6c0; font-weight: 500; }
  .sections { padding: 0 1.5rem; }
  .section { margin-bottom: 1.25rem; background: #162416; border: 1px solid #2a3d2a; border-radius: 14px; overflow: hidden; }
  .section-title { padding: 0.75rem 1rem; border-bottom: 1px solid #2a3d2a; color: #5a7a52; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; }
  .info-row { display: flex; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid #1e2e1e; gap: 0.75rem; }
  .info-row:last-child { border-bottom: none; }
  .info-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }
  .info-key { color: #5a7a52; font-size: 0.82rem; flex: 1; }
  .info-val { color: #c8e6c0; font-size: 0.85rem; text-align: right; max-width: 60%; }
  .notes-text { padding: 1rem; color: #9ab890; font-size: 0.88rem; line-height: 1.6; font-style: italic; }
  .detail-actions { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; padding: 1rem 1.5rem; background: #0f1f0f; border-top: 1px solid #1a2e1a; display: flex; gap: 0.75rem; }
  .btn-edit { flex: 1; background: #3a6a2a; border: none; border-radius: 12px; padding: 0.875rem; color: #c8e6c0; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: background 0.2s; }
  .btn-edit:hover { background: #4a7a3a; }
  .empty-field { color: #3a5a3a; font-style: italic; }
`

export default function PlantDetail({ plant, season, onEdit, onDelete, onWater, onBack, saving }) {
  const ws = waterStatus(plant, season)
  const freqEte = plant.arrosageFreq || 7
  const freqHiver = plant.arrosageFreqHiver || plant.arrosageFreq || 7

  const handleDelete = () => {
    if (window.confirm('Supprimer "' + plant.nom + '" ?')) onDelete()
  }

  return (
    <>
      <style>{styles}</style>
      <div className="detail-page">
        <div className="detail-hero">
          <div className="detail-nav">
            <button className="nav-btn" onClick={onBack}>←</button>
            <button className="nav-btn danger" onClick={handleDelete}>🗑</button>
          </div>
          <span className="detail-emoji">{plant.emoji || '🌿'}</span>
          <div className="detail-name">{plant.nom}</div>
          {plant.nomLatin && <div className="detail-latin">{plant.nomLatin}</div>}
          {plant.lieu && <div className="detail-lieu">📍 {plant.lieu}</div>}
        </div>

        <div className="water-card" style={{
          background: ws.urgent ? 'rgba(251,146,60,0.08)' : 'rgba(122,184,112,0.08)',
          borderColor: ws.urgent ? 'rgba(251,146,60,0.3)' : 'rgba(122,184,112,0.3)',
          margin: '1.5rem 1.5rem 0.75rem'
        }}>
          <div className="water-info">
            <div className="water-label" style={{ color: ws.color }}>💧 {ws.label}</div>
            <div className="water-date" style={{ color: ws.color }}>
              {plant.lastWatered ? 'Dernier arrosage : ' + formatDate(plant.lastWatered) : 'Aucun arrosage enregistré'}
            </div>
          </div>
          <button className="water-action" style={{ color: ws.color }} onClick={onWater} disabled={saving}>
            {saving ? '...' : 'Arroser'}
          </button>
        </div>

        <div className="season-info" style={{ margin: '0 1.5rem 1.25rem' }}>
          <div className="season-row">
            <div className={'season-col' + (season === 'ete' ? ' active' : '')}>
              <div className="season-col-title">☀️ Été</div>
              <div className="season-col-val">tous les {freqEte}j</div>
            </div>
            <div className={'season-col' + (season === 'hiver' ? ' active' : '')}>
              <div className="season-col-title">❄️ Hiver</div>
              <div className="season-col-val">tous les {freqHiver}j</div>
            </div>
          </div>
        </div>

        <div className="sections">
          <div className="section">
            <div className="section-title">Lumière & Arrosage</div>
            <div className="info-row">
              <span className="info-icon">☀️</span>
              <span className="info-key">Exposition</span>
              <span className="info-val">{EXPOSITION_LABEL[plant.exposition] || <span className="empty-field">—</span>}</span>
            </div>
            {plant.arrosageNote && (
              <div className="info-row">
                <span className="info-icon">📝</span>
                <span className="info-key">Conseil</span>
                <span className="info-val">{plant.arrosageNote}</span>
              </div>
            )}
          </div>

          <div className="section">
            <div className="section-title">Entretien</div>
            <div className="info-row">
              <span className="info-icon">🪱</span>
              <span className="info-key">Terre</span>
              <span className="info-val">{plant.terreType || <span className="empty-field">—</span>}</span>
            </div>
            <div className="info-row">
              <span className="info-icon">🌱</span>
              <span className="info-key">Engrais</span>
              <span className="info-val">{plant.engrais || <span className="empty-field">—</span>}</span>
            </div>
            <div className="info-row">
              <span className="info-icon">🪣</span>
              <span className="info-key">Rempotage</span>
              <span className="info-val">{plant.rempotage || <span className="empty-field">—</span>}</span>
            </div>
          </div>

          {plant.notes && (
            <div className="section">
              <div className="section-title">Notes</div>
              <div className="notes-text">{plant.notes}</div>
            </div>
          )}
        </div>

        <div className="detail-actions">
          <button className="btn-edit" onClick={onEdit}>✏️ Modifier la fiche</button>
        </div>
      </div>
    </>
  )
}
