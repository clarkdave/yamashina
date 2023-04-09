import browser from 'webextension-polyfill'

import { storage } from './lib/storage'
import { isCommandMessage } from './lib/messages'

browser.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed', {
    settings: await storage.get('extensionSettings'),
  })
})

browser.runtime.onMessage.addListener(
  (message, _sender, sendResponse: (response: unknown) => void) => {
    if (!isCommandMessage(message)) {
      return
    }

    switch (message.command) {
      case 'getFromStorage': {
        storage.get(message.key).then(value => sendResponse(value))

        return true
      }

      case 'isEnabledForDomain': {
        ;(async () => {
          const domain = message.domain as string
          const extSettings = await storage.get('extensionSettings')

          return sendResponse(!extSettings.domainDenylist.includes(domain))
        })().catch(console.error)

        return true
      }
    }
  },
)
