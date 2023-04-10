import { runtime } from '../lib/runtime'
import { addGlobalListeners } from './listeners'
import { replaceWordsInDocument } from './replacement'

export async function startContentApp(): Promise<void> {
  const settings = await runtime.getFromStorage('extensionSettings')
  const dictionaries = await runtime.getFromStorage('dictionaries')
  const isEnabled = await runtime.isEnabledForDomain(window.location.hostname)

  addGlobalListeners()

  if (dictionaries && isEnabled) {
    replaceWordsInDocument(dictionaries, settings)
  }
}
