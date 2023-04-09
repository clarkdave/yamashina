import {
  AddIcon,
  Button,
  Pane,
  RefreshIcon,
  RemoveIcon,
  SettingsIcon,
} from 'evergreen-ui'
import { useEffect, useState } from 'react'
import { getActiveTab, openOptionsPage } from '../../lib/utils/browser'
import { extensionSettingsActions, state, wanikaniActions } from '../store'

export const Actions: React.FC = () => {
  const [activeTabDomain, setActiveTabDomain] = useState<string | null>(null)

  useEffect(() => {
    getActiveTab().then(activeTab => {
      if (activeTab?.url) {
        setActiveTabDomain(new URL(activeTab.url).hostname)
      }
    })
  }, [activeTabDomain, setActiveTabDomain])

  const enabledForActiveDomain =
    activeTabDomain &&
    !state.extensionSettings.value.domainDenylist.includes(activeTabDomain)

  const toggleForActiveDomain = () => {
    if (activeTabDomain) {
      extensionSettingsActions.toggleEnabledForDomain(activeTabDomain)
    }
  }

  return (
    <Pane display="flex" gap={10}>
      {activeTabDomain && (
        <Button
          onClick={() => toggleForActiveDomain()}
          iconBefore={enabledForActiveDomain ? RemoveIcon : AddIcon}>
          {enabledForActiveDomain
            ? `Disable for ${activeTabDomain}`
            : `Enable for ${activeTabDomain}`}
        </Button>
      )}
      <Button
        onClick={wanikaniActions.sync}
        isLoading={state.wanikani.syncing.value}
        iconBefore={state.wanikani.syncing.value ? null : RefreshIcon}>
        Sync Wanikani progress
      </Button>
      <Button
        onClick={() => {
          openOptionsPage()
        }}
        iconBefore={SettingsIcon}>
        Options
      </Button>
    </Pane>
  )
}
