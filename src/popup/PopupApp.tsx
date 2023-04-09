import * as styles from './PopupApp.css'
import { storage } from '../lib/storage'
import { state } from './store'
import { Actions } from './components/Actions'
import { useEffect, useState } from 'react'
import { Heading, Text } from 'evergreen-ui'
import { openOptionsPage } from '../lib/utils/browser'

export const PopupApp: React.FC = () => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      state.extensionSettings.value = await storage.get('extensionSettings')
      setReady(true)
    })()
  }, [])

  if (!ready) {
    return null
  }

  return (
    <div className={styles.container}>
      {state.extensionSettings.value.wanikaniApiKey ? (
        <Actions />
      ) : (
        <ConfigurationNeeded />
      )}
    </div>
  )
}

const ConfigurationNeeded: React.FC = () => {
  return (
    <>
      <Heading size="500" marginBottom={6}>
        Configuration required
      </Heading>
      <Text>
        You need to{' '}
        <a href="#" onClick={() => openOptionsPage()}>
          add your Wanikani API key
        </a>
      </Text>
    </>
  )
}
