import classNames from 'classnames'
import {
  Button,
  CogIcon,
  TextInputField,
  toaster,
  Text,
  Paragraph,
  Small,
  FormFieldDescription,
} from 'evergreen-ui'
import { useEffect, useState } from 'react'
import logo from '../assets/icons/128.png'
import { getExtensionSettingsFromStorage } from '../lib/settings'
import { storage } from '../lib/storage'
import { sleep } from '../lib/utils/time'
import { createWanikaniClient } from '../lib/wanikani/api'
import * as styles from './styles/OptionsApp.css'

export const OptionsApp: React.FC = () => {
  const [ready, setReady] = useState(false)
  const [wanikaniApiKey, setWanikaniApiKey] = useState<string | null>('')
  const [tooltipDelay, setTooltipDelay] = useState<number | string>(0)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    getExtensionSettingsFromStorage().then(settings => {
      setReady(true)
      setWanikaniApiKey(settings.wanikaniApiKey)
      setTooltipDelay(settings.tooltipDelayMs)
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

      const parsedTooltipDelay = parseInt(String(tooltipDelay))

      if (Number.isNaN(parsedTooltipDelay) || parsedTooltipDelay < 0) {
        toaster.danger('Tooltip delay must be a valid number', {
          id: 'error',
        })
        return
      }

      await storage.set('extensionSettings', {
        ...(await storage.get('extensionSettings')),
        wanikaniApiKey,
        tooltipDelayMs: parsedTooltipDelay,
      })

      await sleep(500) // stop excessive clicking

      setTooltipDelay(parsedTooltipDelay)
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
            description={
              <FormFieldDescription>
                Can be created in{' '}
                <a
                  href="https://www.wanikani.com/settings/personal_access_tokens"
                  target="_blank">
                  your Wanikani settings
                </a>
              </FormFieldDescription>
            }
            value={wanikaniApiKey ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWanikaniApiKey(e.target.value.trim())
            }
          />
          <TextInputField
            label="Tooltip delay"
            description="Delay, in milliseconds, before the tooltip is displayed when hovering over a replaced word"
            value={tooltipDelay}
            type="number"
            min={0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTooltipDelay(e.target.value)
            }}
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
