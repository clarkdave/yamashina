export interface ExtensionSettings {
  wanikaniApiKey: string | null
  domainDenylist: string[]
}

export const defaultExtensionSettings: ExtensionSettings = {
  wanikaniApiKey: null,
  domainDenylist: [],
}
