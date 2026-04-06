import { useState } from 'react'
import { createGist } from '../gist.js'

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f1f0f; }

  .setup {
    min-height: 100dvh;
    background: #0f1f0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    font-family: 'DM Sans', sans-serif;
  }

  .setup-logo {
    font-family: 'Playfair Display', serif;
    font-size: 2.8rem;
    color: #c8e6c0;
    margin-bottom: 0.25rem;
    letter-spacing: -0.02em;
  }

  .setup-subtitle {
    color: #5a7a52;
    font-size: 0.9rem;
    margin-bottom: 3rem;
    font-weight: 300;
  }

  .setup-card {
    background: #162416;
    border: 1px solid #2a3d2a;
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    max-width: 420px;
  }

  .setup-card h2 {
    font-family: 'Playfair Display', serif;
    color: #c8e6c0;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    font-weight: 400;
  }

  .field {
    margin-bottom: 1.25rem;
  }

  .field label {
    display: block;
    color: #7a9a72;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .field input {
    width: 100%;
    background: #0f1f0f;
    border: 1px solid #2a3d2a;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: #c8e6c0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .field input:focus { border-color: #5a9a4a; }
  .field input::placeholder { color: #3a5a3a; }

  .hint {
    color: #4a6a42;
    font-size: 0.75rem;
    margin-top: 0.4rem;
    line-height: 1.5;
  }

  .hint a { color: #7ab870; }

  .btn-primary {
    width: 100%;
    background: #3a6a2a;
    color: #c8e6c0;
    border: none;
    border-radius: 10px;
    padding: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.2s;
  }

  .btn-primary:hover { background: #4a7a3a; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
    color: #3a5a3a;
    font-size: 0.8rem;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #2a3d2a;
  }

  .btn-secondary {
    width: 100%;
    background: transparent;
    color: #7ab870;
    border: 1px solid #3a5a3a;
    border-radius: 10px;
    padding: 0.75rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover { background: #1a2e1a; border-color: #5a7a52; }
  .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

  .error { color: #f87171; font-size: 0.82rem; margin-top: 0.75rem; text-align: center; }
`

export default function Setup({ onSetup }) {
  const [token, setToken] = useState('')
  const [gistId, setGistId] = useState('')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  const handleConnect = async () => {
    if (!token.trim() || !gistId.trim()) return
    setLoading(true)
    setError(null)
    try {
      await onSetup({ token: token.trim(), gistId: gistId.trim() })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!token.trim()) { setError('Entre d\'abord ton token GitHub'); return }
    setCreating(true)
    setError(null)
    try {
      const id = await createGist(token.trim())
      setGistId(id)
      alert(`Gist créé ! ID : ${id}\n\nPartage cet ID avec Bérénice pour qu'elle configure l'appli.`)
    } catch (e) {
      setError(e.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="setup">
        <div className="setup-logo">🌿 Plantes</div>
        <div className="setup-subtitle">Notre jardin partagé</div>

        <div className="setup-card">
          <h2>Configuration</h2>

          <div className="field">
            <label>Token GitHub</label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxx"
              value={token}
              onChange={e => setToken(e.target.value)}
            />
            <div className="hint">
              <a href="https://github.com/settings/tokens/new?scopes=gist" target="_blank">
                Créer un token →
              </a>{' '}
              Coche uniquement la scope "gist"
            </div>
          </div>

          <div className="field">
            <label>ID du Gist</label>
            <input
              type="text"
              placeholder="abc123def456..."
              value={gistId}
              onChange={e => setGistId(e.target.value)}
            />
            <div className="hint">
              Crée un Gist ci-dessous ou entre l'ID partagé par l'autre
            </div>
          </div>

          <button
            className="btn-secondary"
            onClick={handleCreate}
            disabled={creating || !token.trim()}
          >
            {creating ? 'Création...' : '✨ Créer un nouveau Gist'}
          </button>

          <div className="divider">ou</div>

          <button
            className="btn-primary"
            onClick={handleConnect}
            disabled={loading || !token.trim() || !gistId.trim()}
          >
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>

          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </>
  )
}
