import { useState, useEffect, useCallback } from 'react'
import { fetchPlants, savePlants, createGist } from './gist.js'
import PlantList from './components/PlantList.jsx'
import PlantForm from './components/PlantForm.jsx'
import PlantDetail from './components/PlantDetail.jsx'
import Setup from './components/Setup.jsx'

const STORAGE_KEY = 'plant_app_config'

export default function App() {
  const [config, setConfig] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null }
    catch { return null }
  })
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [view, setView] = useState('list') // list | form | detail
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const load = useCallback(async (cfg = config) => {
    if (!cfg) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPlants(cfg.token, cfg.gistId)
      setPlants(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [config])

  useEffect(() => {
    if (config) load()
  }, [config])

  const save = async (updatedPlants) => {
    setSaving(true)
    try {
      await savePlants(config.token, config.gistId, updatedPlants)
      setPlants(updatedPlants)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSetup = async ({ token, gistId }) => {
    const cfg = { token, gistId }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
    setConfig(cfg)
    await load(cfg)
  }

  const handleAddOrEdit = async (plant) => {
    let updated
    if (plant.id) {
      updated = plants.map(p => p.id === plant.id ? plant : p)
    } else {
      updated = [...plants, { ...plant, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]
    }
    await save(updated)
    setView('list')
    setSelectedPlant(null)
  }

  const handleDelete = async (id) => {
    const updated = plants.filter(p => p.id !== id)
    await save(updated)
    setView('list')
    setSelectedPlant(null)
  }

  const handleWater = async (id) => {
    const updated = plants.map(p =>
      p.id === id ? { ...p, lastWatered: new Date().toISOString() } : p
    )
    await save(updated)
    if (selectedPlant?.id === id) {
      setSelectedPlant(updated.find(p => p.id === id))
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    await load()
    setSyncing(false)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setConfig(null)
    setPlants([])
  }

  if (!config) {
    return <Setup onSetup={handleSetup} />
  }

  if (view === 'form') {
    return (
      <PlantForm
        plant={selectedPlant}
        onSave={handleAddOrEdit}
        onCancel={() => { setView('list'); setSelectedPlant(null) }}
        saving={saving}
      />
    )
  }

  if (view === 'detail' && selectedPlant) {
    return (
      <PlantDetail
        plant={plants.find(p => p.id === selectedPlant.id) || selectedPlant}
        onEdit={() => setView('form')}
        onDelete={() => handleDelete(selectedPlant.id)}
        onWater={() => handleWater(selectedPlant.id)}
        onBack={() => { setView('list'); setSelectedPlant(null) }}
        saving={saving}
      />
    )
  }

  return (
    <PlantList
      plants={plants}
      loading={loading}
      syncing={syncing}
      error={error}
      onAdd={() => { setSelectedPlant(null); setView('form') }}
      onSelect={(p) => { setSelectedPlant(p); setView('detail') }}
      onSync={handleSync}
      onLogout={logout}
      onWater={handleWater}
    />
  )
}
