const STORAGE_KEY = 'skrzydla_save'

const SaveSystem = {
  _load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
    } catch {
      return {}
    }
  },

  _save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },

  setLastLevel(level) {
    const data = this._load()
    data.lastLevel = level
    this._save(data)
  },

  getLastLevel() {
    return this._load().lastLevel ?? 1
  },

  setLevelComplete(level) {
    const data = this._load()
    data.completedLevels = data.completedLevels ?? []
    if (!data.completedLevels.includes(level)) {
      data.completedLevels.push(level)
    }
    this._save(data)
  },

  isLevelComplete(level) {
    return (this._load().completedLevels ?? []).includes(level)
  },

  setFeatherCollected(levelId, featherId) {
    const data = this._load()
    data.feathers = data.feathers ?? {}
    data.feathers[`${levelId}_${featherId}`] = true
    this._save(data)
  },

  isFeatherCollected(levelId, featherId) {
    return !!(this._load().feathers ?? {})[`${levelId}_${featherId}`]
  },

  clearAll() {
    localStorage.removeItem(STORAGE_KEY)
  },
}

export default SaveSystem
