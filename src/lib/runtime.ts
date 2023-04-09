import browser from 'webextension-polyfill'

import type { StorageData } from './storage'
import { getActiveTab } from './utils/browser'
import { CommandMessage } from './messages'

async function sendMessageToBackground(
  message: CommandMessage,
): Promise<unknown> {
  return await browser.runtime.sendMessage(message)
}

async function sendMessageToTab(
  tabId: number,
  message: CommandMessage,
): Promise<unknown> {
  return await browser.tabs.sendMessage(tabId, message)
}

async function getFromStorage<T extends keyof StorageData>(
  key: T,
): Promise<StorageData[T]> {
  return (await sendMessageToBackground({
    command: 'getFromStorage',
    key,
  })) as StorageData[T]
}

async function isEnabledForDomain(domain: string): Promise<boolean> {
  return (await sendMessageToBackground({
    command: 'isEnabledForDomain',
    domain,
  })) as boolean
}

async function reloadActiveTab(): Promise<void> {
  const tab = await getActiveTab()
  if (!tab?.id) return

  await sendMessageToTab(tab.id, { command: 'reloadTab' })
}

export const runtime = {
  getFromStorage,
  isEnabledForDomain,
  reloadActiveTab,
}
