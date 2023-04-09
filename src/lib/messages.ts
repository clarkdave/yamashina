import { StorageData } from './storage'

interface GetFromStorageMessage {
  command: 'getFromStorage'
  key: keyof StorageData
}

interface IsEnabledForDomainMessage {
  command: 'isEnabledForDomain'
  domain: string
}

interface ReloadActiveTabMessage {
  command: 'reloadTab'
}

export type CommandMessage =
  | GetFromStorageMessage
  | IsEnabledForDomainMessage
  | ReloadActiveTabMessage

export function isCommandMessage(message: unknown): message is CommandMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'command' in message &&
    typeof message.command === 'string'
  )
}
