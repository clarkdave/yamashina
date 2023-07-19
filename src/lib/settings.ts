import { storage } from './storage'

export interface ExtensionSettings {
  wanikaniApiKey: string | null
  domainDenylist: string[]
  tooltipDelayMs: number
  useKanjiForNumbers: boolean
}

export function getDefaultExtensionSettings(): ExtensionSettings {
  return {
    wanikaniApiKey: null,
    domainDenylist: [],
    tooltipDelayMs: 1000,
    useKanjiForNumbers: false,
  }
}

export async function getExtensionSettingsFromStorage(): Promise<ExtensionSettings> {
  return {
    ...getDefaultExtensionSettings(),
    ...(await storage.get('extensionSettings')),
  }
}
