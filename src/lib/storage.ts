import browser from 'webextension-polyfill'
import { ExtensionSettings, getDefaultExtensionSettings } from './settings'
import { Wanikani } from './wanikani/types'

export interface StorageData {
  dictionaries: Wanikani.Dictionaries | null
  extensionSettings: ExtensionSettings
}

const defaultData: StorageData = {
  dictionaries: null,
  extensionSettings: getDefaultExtensionSettings(),
}

async function get<T extends keyof StorageData>(
  key: T,
): Promise<StorageData[T]> {
  return await browser.storage.local
    .get(key)
    .then(res => res[key] ?? defaultData[key])
}

async function set<T extends keyof StorageData>(
  key: T,
  value: StorageData[T],
): Promise<void> {
  await browser.storage.local.set({ [key]: value })
}

export const storage = {
  get,
  set,
}
