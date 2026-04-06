import { useState } from 'react'

const EMOJIS = ['🌿', '🌱', '🪴', '🌵', '🌴', '🌳', '🌾', '🍀', '🌺', '🌸', '🌻', '🌹', '🍃', '🎋', '🎍', '🪷', '🌼', '🌷', '🍁', '🫐']

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f1f0f; }

  .form-page {
    min-height: 100dvh;
    background: #0f1f0f;
    font-family: 'DM Sans', sans-serif;
    max-width: 480px;
    margin: 0 auto;
    padding-bottom: 6rem;
  }

  .form-header {
    padding: 3.5rem 1.5rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .back-btn {
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
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .form-title {
    font-family: 'Playfair Display', serif;
    color: #c8e6c0;
    font-size: 1.6rem;
    font-weight: 400;
  }

  .form-body { padding: 0 1.5rem; }

  .search-block {
    background: #162416;
    border: 1px solid #2a3d2a;
    border-radius: 16px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .search-block label {
    display: block;
    color: #7a9a72;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }

  .search-row {
    display: flex;
    gap: 0.6rem;
  }

  .search-input {
    flex: 1;
    background: #0f1f0f;
    border: 1px solid #2a3d2a;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: #c8e6c0;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .search-input:focus { border-color: #5a9a4a; }
  .search-input::placeholder { color: #3a5a3a; }

  .btn-identify {
    background: #3a6a2a;
    border: none;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: #c8e6c0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .btn-identify:hover { background: #4a7a3a; }
  .btn-identify:disabled { opacity: 0.5; cursor: not-allowed; }

  .ai-status {
    margin-top: 0.75rem;
    font-size: 0.82rem;
    color: #7ab870;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .ai-status.error { color: #f87171; }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #3a6a2a;
    border-top-color: #7ab870;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .identified-badge {
    background: rgba(122,184,112,0.12);
    border: 1px solid rgba(122,184,112,0.3);
    border-radius: 10px;
    padding: 0.6rem 0.9rem;
    margin-top: 0.75rem;
    font-size: 0.82rem;
    color: #7ab870;
  }

  .emoji-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .emoji-opt {
    width: 44px;
    height: 44px;
    background: #162416;
    border: 1px solid #2a3d2a;
    border-radius: 10px;
    font-size: 1.4rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .emoji-opt.selected {
    border-color: #5a9a4a;
    background: #1e341e;
    transform: scale(1.1);
  }

  .field { margin-bottom: 1.25rem; }

  .field label {
    display: block;
    color: #7a9a72;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .field input,
  .field select,
  .field textarea {
    width: 100%;
    background: #162416;
    border: 1px solid #2a3d2a;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: #c8e6c0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .field input:focus,
  .field select:focus,
  .field textarea:focus { border-color: #5a9a4a; }
  .field input::placeholder,
  .field textarea::placeholder { color: #3a5a3a; }
  .field select option { background: #162416; }
  .field textarea { resize: vertical; min-height: 80px; }

  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .section-label {
    color: #5a7a52;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 1.5rem 0 0.75rem;
    font-weight: 500;
  }

  .form-actions {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    padding: 1rem 1.5rem;
    background: #0f1f0f;
    border-top: 1px solid #1a2e1a;
    display: flex;
    gap: 0.75rem;
  }

  .btn-cancel {
    flex: 1;
    background: transparent;
    border: 1px solid #2a3d2a;
    border-radius: 12px;
    padding: 0.875rem;
    color: #7a9a72;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    cursor: pointer;
  }

  .btn-save {
    flex: 2;
    background: #3a6a2a;
    border: none;
    border-radius: 12px;
    padding: 0.875rem;
    color: #c8e6c0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-save:hover { background: #4a7a3a; }
  .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

  .details-toggle {
    background: transparent;
    border: 1px dashed #2a3d2a;
    border-radius: 10px;
    padding: 0.6rem 1rem;
    color: #5a7a52;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    cursor: pointer;
    width: 100%;
    margin-bottom: 1rem;
    transition: all 0.2s;
  }

  .details-toggle:hover { border-color: #4a6a42; color: #7a9a72; }
`

const defaultForm = {
  nom: '', nomLatin: '', emoji: '🌿', lieu: '',
  exposition: 'mi_ombre', arrosageFreq: 7,
  arrosageNote: '', terreType: '', engrais: '',
  rempotage: '', notes: ''
}

export default function PlantForm({ plant, onSave, onCancel, saving }) {
  const [form, setForm] = useState(plant ? { ...defaultForm, ...plant } : defaultForm)
  const [searchName, setSearchName] = useState(plant?.nom || '')
  const [identifying, setIdentifying] = useState(false)
  const [aiStatus, setAiStatus] = useState(null)
  const [identified, setIdentified] = useState(!!plant)
  const [showDetails, setShowDetails] = useState(!!plant)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const identify = async () => {
    if (!searchName.trim()) return
    setIdentifying(true)
    setAiStatus('loading')
    setIdentified(false)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Tu es un expert en botanique. L'utilisateur a une plante nommée "${searchName}".
Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après, sans backticks.
Format exact :
{
  "nom": "nom commun français",
  "nomLatin": "nom latin",
  "emoji": "emoji le plus adapté parmi : 🌿 🌱 🪴 🌵 🌴 🌳 🌾 🍀 🌺 🌸 🌻 🌹 🍃 🎋 🪷 🌼 🌷",
  "exposition": "plein_soleil" ou "mi_ombre" ou "ombre",
  "arrosageFreq": nombre de jours entre chaque arrosage (nombre entier),
  "arrosageNote": "conseil arrosage court",
  "terreType": "type de terre idéal",
  "engrais": "conseil engrais court",
  "rempotage": "fréquence rempotage",
  "notes": "1-2 phrases de conseils essentiels pour un débutant en ville"
}`
          }]
        })
      })

      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const info = JSON.parse(clean)

      setForm(f => ({ ...f, ...info }))
      setSearchName(info.nom)
      setIdentified(true)
      setAiStatus('success')
      setShowDetails(true)
    } catch (e) {
      setAiStatus('error')
    } finally {
      setIdentifying(false)
    }
  }

  const handleSubmit = () => {
    if (!form.nom.trim()) return
    onSave(form)
  }

  return (
    <>
      <style>{styles}</style>
      <div className="form-page">
        <div className="form-header">
          <button className="back-btn" onClick={onCancel}>←</button>
          <div className="form-title">{plant ? 'Modifier' : 'Nouvelle plante'}</div>
        </div>

        <div className="form-body">
          <div className="search-block">
            <label>Nom de la plante</label>
            <div className="search-row">
              <input
                className="search-input"
                value={searchName}
                onChange={e => { setSearchName(e.target.value); set('nom', e.target.value) }}
                placeholder="ex. Olivier, Ficus, Aloe..."
                onKeyDown={e => e.key === 'Enter' && identify()}
              />
              <button
                className="btn-identify"
                onClick={identify}
                disabled={identifying || !searchName.trim()}
              >
                {identifying ? <><span className="spinner" /> Analyse...</> : '✨ Identifier'}
              </button>
            </div>

            {aiStatus === 'loading' && (
              <div className="ai-status">
                <span className="spinner" />
                Identification en cours...
              </div>
            )}
            {aiStatus === 'success' && identified && (
              <div className="identified-badge">
                ✅ Fiche remplie automatiquement — vérifie et ajuste si besoin
              </div>
            )}
            {aiStatus === 'error' && (
              <div className="ai-status error">
                ⚠️ Identification échouée — remplis manuellement
              </div>
            )}
          </div>

          {(identified || plant) && (
            <>
              <div className="section-label">Icône</div>
              <div className="emoji-picker">
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    className={`emoji-opt${form.emoji === e ? ' selected' : ''}`}
                    onClick={() => set('emoji', e)}
                  >{e}</button>
                ))}
              </div>

              <div className="field">
                <label>Emplacement</label>
                <input
                  value={form.lieu}
                  onChange={e => set('lieu', e.target.value)}
                  placeholder="ex. Terrasse, Salon, Chambre..."
                />
              </div>

              <div className="section-label">Lumière & Arrosage</div>
              <div className="row">
                <div className="field">
                  <label>Exposition</label>
                  <select value={form.exposition} onChange={e => set('exposition', e.target.value)}>
                    <option value="plein_soleil">☀️ Plein soleil</option>
                    <option value="mi_ombre">⛅ Mi-ombre</option>
                    <option value="ombre">🌑 Ombre</option>
                  </select>
                </div>
                <div className="field">
                  <label>Arrosage (jours)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={form.arrosageFreq}
                    onChange={e => set('arrosageFreq', parseInt(e.target.value) || 7)}
                  />
                </div>
              </div>

              {!showDetails && (
                <button className="details-toggle" onClick={() => setShowDetails(true)}>
                  + Voir tous les détails (terre, engrais, rempotage...)
                </button>
              )}

              {showDetails && (
                <>
                  <div className="field">
                    <label>Notes arrosage</label>
                    <input
                      value={form.arrosageNote}
                      onChange={e => set('arrosageNote', e.target.value)}
                      placeholder="ex. Laisser sécher entre deux arrosages"
                    />
                  </div>

                  <div className="section-label">Entretien</div>
                  <div className="field">
                    <label>Type de terre</label>
                    <input value={form.terreType} onChange={e => set('terreType', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Engrais</label>
                    <input value={form.engrais} onChange={e => set('engrais', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Rempotage</label>
                    <input value={form.rempotage} onChange={e => set('rempotage', e.target.value)} />
                  </div>

                  <div className="section-label">Notes</div>
                  <div className="field">
                    <textarea
                      value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                      placeholder="Observations, conseils..."
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="form-actions">
          <button className="btn-cancel" onClick={onCancel}>Annuler</button>
          <button className="btn-save" onClick={handleSubmit} disabled={saving || !form.nom.trim()}>
            {saving ? 'Sauvegarde...' : plant ? 'Mettre à jour' : 'Ajouter la plante'}
          </button>
        </div>
      </div>
    </>
  )
}
