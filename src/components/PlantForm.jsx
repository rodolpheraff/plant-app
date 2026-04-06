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
`

const defaultForm = {
  nom: '', nomLatin: '', emoji: '🌿', lieu: '',
  exposition: 'mi_ombre', arrosageFreq: 7,
  arrosageNote: '', terreType: '', engrais: '',
  rempotage: '', notes: ''
}

export default function PlantForm({ plant, onSave, onCancel, saving }) {
  const [form, setForm] = useState(plant ? { ...defaultForm, ...plant } : defaultForm)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

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

          <div className="section-label">Identité</div>
          <div className="field">
            <label>Nom *</label>
            <input
              value={form.nom}
              onChange={e => set('nom', e.target.value)}
              placeholder="ex. Olivier, Ficus..."
            />
          </div>
          <div className="field">
            <label>Nom latin</label>
            <input
              value={form.nomLatin}
              onChange={e => set('nomLatin', e.target.value)}
              placeholder="ex. Olea europaea"
            />
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
          <div className="field">
            <label>Notes arrosage</label>
            <input
              value={form.arrosageNote}
              onChange={e => set('arrosageNote', e.target.value)}
              placeholder="ex. Peu d'eau en hiver, laisser sécher..."
            />
          </div>

          <div className="section-label">Entretien</div>
          <div className="field">
            <label>Type de terre</label>
            <input
              value={form.terreType}
              onChange={e => set('terreType', e.target.value)}
              placeholder="ex. Terreau universel, sableux..."
            />
          </div>
          <div className="field">
            <label>Engrais</label>
            <input
              value={form.engrais}
              onChange={e => set('engrais', e.target.value)}
              placeholder="ex. Liquide 1x/mois au printemps"
            />
          </div>
          <div className="field">
            <label>Rempotage</label>
            <input
              value={form.rempotage}
              onChange={e => set('rempotage', e.target.value)}
              placeholder="ex. Tous les 2 ans au printemps"
            />
          </div>

          <div className="section-label">Notes libres</div>
          <div className="field">
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Observations, particularités, historique..."
            />
          </div>
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
