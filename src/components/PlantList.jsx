import { useState } from 'react'

const EXPOSITION = { plein_soleil: '☀️', mi_ombre: '⛅', ombre: '🌑' }
const EXPOSITION_LABEL = { plein_soleil: 'Plein soleil', mi_ombre: 'Mi-ombre', ombre: 'Ombre' }

function daysAgo(iso) {
  if (!iso) return null
  const diff = Date.now() - new Date(iso).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function waterStatus(plant) {
  const days = daysAgo(plant.lastWatered)
  const freq = plant.arrosageFreq || 7
  if (days === null) return { color: '#f87171', label: 'Jamais arrosé', urgent: true }
  if (days >= freq) return { color: '#fb923c', label: `${days}j sans eau`, urgent: true }
  const remaining = freq - days
  return { color: '#7ab870', label: remaining === 0 ? 'Aujourd\'hui' : `dans ${remaining}j`, urgent: false }
}

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f1f0f; }

  .app {
    min-height: 100dvh;
    background: #0f1f0f;
    font-family: 'DM Sans', sans-serif;
    max-width: 480px;
    margin: 0 auto;
  }

  .header {
    padding: 3.5rem 1.5rem 1.5rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    color: #c8e6c0;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .header-count {
    color: #5a7a52;
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .icon-btn {
    background: #162416;
    border: 1px solid #2a3d2a;
    border-radius: 10px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #7a9a72;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .icon-btn:hover { background: #1e341e; color: #c8e6c0; }

  .add-btn {
    background: #3a6a2a;
    border: none;
    border-radius: 12px;
    padding: 0.6rem 1.1rem;
    color: #c8e6c0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: background 0.2s;
  }

  .add-btn:hover { background: #4a7a3a; }

  .plants-grid {
    padding: 0 1rem 6rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .plant-card {
    background: #162416;
    border: 1px solid #2a3d2a;
    border-radius: 16px;
    padding: 1.1rem 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .plant-card:hover { border-color: #4a6a42; background: #1a2e1a; }

  .plant-emoji {
    font-size: 2rem;
    width: 52px;
    height: 52px;
    background: #0f1f0f;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .plant-info { flex: 1; min-width: 0; }

  .plant-name {
    font-family: 'Playfair Display', serif;
    color: #c8e6c0;
    font-size: 1.05rem;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .plant-latin {
    color: #5a7a52;
    font-size: 0.78rem;
    font-style: italic;
    margin-top: 0.1rem;
  }

  .plant-tags {
    display: flex;
    gap: 0.4rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
  }

  .tag {
    background: #0f1f0f;
    border-radius: 6px;
    padding: 0.2rem 0.5rem;
    font-size: 0.72rem;
    color: #7a9a72;
  }

  .plant-water {
    flex-shrink: 0;
    text-align: right;
  }

  .water-status {
    font-size: 0.75rem;
    font-weight: 500;
  }

  .water-btn {
    background: transparent;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    margin-top: 0.3rem;
    display: block;
    margin-left: auto;
    opacity: 0.7;
    transition: opacity 0.2s, transform 0.2s;
  }

  .water-btn:hover { opacity: 1; transform: scale(1.2); }

  .empty {
    text-align: center;
    padding: 4rem 2rem;
    color: #4a6a42;
  }

  .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
  .empty p { font-size: 0.9rem; line-height: 1.6; }

  .loading {
    text-align: center;
    padding: 3rem;
    color: #5a7a52;
    font-size: 0.9rem;
  }

  .error-bar {
    background: #3a1a1a;
    border: 1px solid #6a2a2a;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: #f87171;
    font-size: 0.82rem;
    margin: 0 1rem 1rem;
  }

  .urgent-count {
    background: #fb923c;
    color: #1a0a00;
    border-radius: 20px;
    padding: 0.3rem 0.75rem;
    font-size: 0.78rem;
    font-weight: 600;
    margin: 0 1rem 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
`

export default function PlantList({ plants, loading, syncing, error, onAdd, onSelect, onSync, onLogout, onWater }) {
  const urgent = plants.filter(p => waterStatus(p).urgent)

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div>
            <div className="header-title">🌿 Plantes</div>
            <div className="header-count">{plants.length} plante{plants.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={onSync} title="Synchroniser">
              {syncing ? '⏳' : '↻'}
            </button>
            <button className="icon-btn" onClick={onLogout} title="Déconnexion">⚙</button>
            <button className="add-btn" onClick={onAdd}>+ Ajouter</button>
          </div>
        </div>

        {error && <div className="error-bar">⚠️ {error}</div>}

        {urgent.length > 0 && (
          <div style={{ padding: '0 1rem 0.5rem' }}>
            <div className="urgent-count">💧 {urgent.length} plante{urgent.length > 1 ? 's' : ''} à arroser</div>
          </div>
        )}

        <div className="plants-grid">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : plants.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🪴</div>
              <p>Aucune plante encore.<br />Commence par en ajouter une !</p>
            </div>
          ) : (
            plants.map(plant => {
              const ws = waterStatus(plant)
              return (
                <div key={plant.id} className="plant-card" onClick={() => onSelect(plant)}>
                  <div className="plant-emoji">{plant.emoji || '🌿'}</div>
                  <div className="plant-info">
                    <div className="plant-name">{plant.nom}</div>
                    {plant.nomLatin && <div className="plant-latin">{plant.nomLatin}</div>}
                    <div className="plant-tags">
                      {plant.exposition && (
                        <span className="tag">{EXPOSITION[plant.exposition]} {EXPOSITION_LABEL[plant.exposition]}</span>
                      )}
                      {plant.lieu && <span className="tag">📍 {plant.lieu}</span>}
                    </div>
                  </div>
                  <div className="plant-water">
                    <div className="water-status" style={{ color: ws.color }}>{ws.label}</div>
                    <button
                      className="water-btn"
                      onClick={e => { e.stopPropagation(); onWater(plant.id) }}
                      title="Arroser maintenant"
                    >💧</button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
