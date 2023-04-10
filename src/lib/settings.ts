import { storage } from './storage'

export interface ExtensionSettings {
  wanikaniApiKey: string | null
  domainDenylist: string[]
  tooltipDelayMs: number
}

export function getDefaultExtensionSettings(): ExtensionSettings {
  return {
    wanikaniApiKey: null,
    domainDenylist: [],
    tooltipDelayMs: 1000,
  }
}

export async function getExtensionSettingsFromStorage(): Promise<ExtensionSettings> {
  return {
    ...getDefaultExtensionSettings(),
    ...(await storage.get('extensionSettings')),
  }
}
