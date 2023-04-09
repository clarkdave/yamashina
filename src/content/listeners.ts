import browser from 'webextension-polyfill'
import { isCommandMessage } from '../lib/messages'

export function addGlobalListeners(): void {
  browser.runtime.onMessage.addListener(message => {
    if (!isCommandMessage(message)) {
      return
    }

    switch (message.command) {
      case 'reloadTab': {
        window.location.reload()
        return true
      }
    }
  })
}
