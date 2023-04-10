import { ExtensionSettings, getDefaultExtensionSettings } from '../lib/settings'
import { storage } from '../lib/storage'
import { getWanikaniDictionaries } from '../lib/wanikani/data'
import { signal } from '@preact/signals-react'
import { runtime } from '../lib/runtime'

export const state = {
  extensionSettings: signal(getDefaultExtensionSettings()),
  wanikani: {
    syncing: signal(false),
  },
}

export const extensionSettingsActions = {
  async update(newSettings: Partial<ExtensionSettings>) {
    const settings = {
      ...(await storage.get('extensionSettings')),
      ...newSettings,
    }

    await storage.set('extensionSettings', settings)
    state.extensionSettings.value = settings
  },

  async toggleEnabledForDomain(domain: string) {
    const denylist = (await storage.get('extensionSettings')).domainDenylist
    const newDenylist = denylist.includes(domain)
      ? denylist.filter(x => x !== domain)
      : [...denylist, domain]

    await extensionSettingsActions.update({
      domainDenylist: newDenylist,
    })
    await runtime.reloadActiveTab()
  },
}

export const wanikaniActions = {
  async sync() {
    const { syncing } = state.wanikani

    try {
      const apiKey = state.extensionSettings.value.wanikaniApiKey
      if (!apiKey) return

      syncing.value = true

      const dictionaries = await getWanikaniDictionaries({
        apiKey,
      })

      await storage.set('dictionaries', dictionaries)
    } finally {
      syncing.value = false
    }
  },
}
