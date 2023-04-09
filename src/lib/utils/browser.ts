import browser from 'webextension-polyfill'

export async function getActiveTab(): Promise<browser.Tabs.Tab | undefined> {
  return await browser.tabs
    .query({
      active: true,
      currentWindow: true,
    })
    .then(tabs => tabs[0] as browser.Tabs.Tab | undefined)
}

export async function getActiveTabDomain(): Promise<string | null> {
  const tab = await getActiveTab()

  return tab?.url ? new URL(tab.url).hostname : null
}

export async function openOptionsPage() {
  browser.runtime.openOptionsPage()
  window.close()
}
