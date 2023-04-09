import {
  Button,
  Card,
  CogIcon,
  Pane,
  TextInputField,
  toaster,
} from 'evergreen-ui'
import logo from '../assets/icons/128.png'
import classNames from 'classnames'
import * as styles from './styles/OptionsApp.css'
import { useEffect, useState } from 'react'
import { ExtensionSettings } from '../lib/settings'
import { storage } from '../lib/storage'
import { sleep } from '../lib/utils/time'
import { createWanikaniClient } from '../lib/wanikani/api'

export const OptionsApp: React.FC = () => {
  const [ready, setReady] = useState(false)
  const [wanikaniApiKey, setWanikaniApiKey] = useState<string | null>('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    storage.get('extensionSettings').then(settings => {
      setReady(true)
      setWanikaniApiKey(settings.wanikaniApiKey)
    })
  }, [])

  const saveChanges = async () => {
    try {
      setIsSaving(true)

      if (!wanikaniApiKey || !(await validateWanikaniApiKey(wanikaniApiKey))) {
        toaster.danger('Wanikani API key appears to be invalid', {
          id: 'error',
        })
        return
      }

      await storage.set('extensionSettings', {
        ...(await storage.get('extensionSettings')),
        wanikaniApiKey,
      })
      await sleep(500) // stop excessive clicking
      toaster.success('Saved changes', { id: 'success' })
    } catch (err) {
      console.error(err)
      toaster.danger('Could not save changes', { id: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  if (!ready) {
    return null
  }

  return (
    <div className={styles.page}>
      <div className={styles.floatingContainer}>
        <div className={styles.topBar}>
          <img src={logo} width={24} height={24} />
          <div className={styles.navBar}>
            <a className={classNames(styles.navLink, styles.navLinkActive)}>
              <CogIcon size={12} /> Settings
            </a>
          </div>
        </div>
        <div className={styles.formContainer}>
          <TextInputField
            label="Wanikani API key"
            value={wanikaniApiKey ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWanikaniApiKey(e.target.value.trim())
            }
          />
          <div className={styles.formActions}>
            <Button
              onClick={() => saveChanges()}
              appearance="primary"
              disabled={isSaving}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

async function validateWanikaniApiKey(apiKey: string): Promise<boolean> {
  const client = createWanikaniClient({ apiKey })

  try {
    await client.getAllReviewStatistics({
      subject_types: ['radical'],
    })

    return true
  } catch {
    return false
  }
}
