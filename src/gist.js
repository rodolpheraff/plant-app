const GIST_FILENAME = 'plants.json'

export async function fetchPlants(token, gistId) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })
  if (!res.ok) throw new Error('Impossible de charger le Gist')
  const data = await res.json()
  const file = data.files[GIST_FILENAME]
  if (!file) return []
  return JSON.parse(file.content)
}

export async function savePlants(token, gistId, plants) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(plants, null, 2),
        },
      },
    }),
  })
  if (!res.ok) throw new Error('Impossible de sauvegarder')
  return true
}

export async function createGist(token) {
  const res = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: 'Mes plantes 🌿',
      public: false,
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify([], null, 2),
        },
      },
    }),
  })
  if (!res.ok) throw new Error('Impossible de créer le Gist')
  const data = await res.json()
  return data.id
}
