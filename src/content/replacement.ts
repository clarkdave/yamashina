import { PROPER_NOUNS } from '../lib/const'
import { ExtensionSettings } from '../lib/settings'
import { Wanikani, WanikaniApi } from '../lib/wanikani/types'
import { registerCustomElements } from './elements'
import { logger } from './logger'
import { addTooltipToElement } from './ui/tooltip'

const TEXT_SELECTOR = 'body *:not(noscript):not(script):not(style)'

export function replaceWordsInDocument(
  dictionaries: Wanikani.Dictionaries,
  settings: ExtensionSettings,
): void {
  registerCustomElements()
  processAllTextNodes(dictionaries, settings)
  addReplacementTooltips(dictionaries, settings)
}

function processAllTextNodes(
  dictionaries: Wanikani.Dictionaries,
  settings: ExtensionSettings,
) {
  const processStartedAt = Date.now()
  const processor = new TextNodeProcessor(dictionaries, {
    useKanjiForNumbers: settings.useKanjiForNumbers,
  })
  let nodesReplaced = 0

  document.querySelectorAll(TEXT_SELECTOR).forEach(element => {
    ;[...element.childNodes]
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .forEach(textNode => {
        const text = textNode.textContent
        if (!text) return

        processor.processTextNode(textNode)
        nodesReplaced += 1
      })
  })

  logger.debug(
    `processed ${nodesReplaced} nodes in ${Date.now() - processStartedAt}ms`,
  )
}

function addReplacementTooltips(
  dictionaries: Wanikani.Dictionaries,
  settings: ExtensionSettings,
) {
  const subjectMap = new Map<string, Wanikani.Subject>()

  for (const subject of Object.values(dictionaries.vocabulary)) {
    subjectMap.set(subject.id.toString(), subject)
  }

  document.querySelectorAll(YamashinaReplacementElement.tag).forEach(node => {
    const subjectId = node.getAttribute('subject-id')
    if (!subjectId) return

    const subject = subjectMap.get(subjectId)
    if (!subject) return

    addTooltipToElement(node as HTMLElement, subject, settings)
  })
}

class TextNodeProcessor {
  private vocab: Wanikani.Dictionary
  private multiWordVocab: Wanikani.Dictionary

  constructor(
    dictionaries: Wanikani.Dictionaries,
    private readonly settings: Pick<ExtensionSettings, 'useKanjiForNumbers'>,
  ) {
    this.vocab = dictionaries.vocabulary
    this.multiWordVocab = Object.fromEntries(
      Object.entries(this.vocab).filter(([english]) => english.includes(' ')),
    )
  }

  processTextNode(node: ChildNode) {
    let text = node.textContent
    if (!text) return

    if (/^[0-9]+$/.test(text) && !this.settings.useKanjiForNumbers) {
      return
    }

    const multiWordReplacements: Array<{
      original: string
      characters: string
      subject: Wanikani.Subject
    }> = []

    // replace multi-word subjects first and keep track of them so we can
    // wrap them in our custom element later

    for (const [english, subject] of Object.entries(this.multiWordVocab)) {
      text = text.replace(new RegExp(`${english}`, 'i'), matchedWord => {
        multiWordReplacements.push({
          original: matchedWord,
          characters: subject.characters,
          subject,
        })
        return subject.characters
      })
    }

    const fragment = new DocumentFragment()
    const words = text.split(/\b/)

    for (const word of words) {
      const candidate = createReplacementCandidateForWord(word)
      const subject = this.vocab[candidate]

      const multiWordReplacement = multiWordReplacements.find(
        x => x.characters === word.trim().replace(/['"]/g, ''),
      )

      if (multiWordReplacement) {
        fragment.appendChild(
          createReplacementElement({
            subject: multiWordReplacement.subject,
            original: multiWordReplacement.original,
            text: word,
          }),
        )
        continue
      }

      if (subject) {
        fragment.appendChild(
          createReplacementElement({
            subject,
            original: word,
            text: subject.characters,
          }),
        )
        continue
      }

      fragment.appendChild(document.createTextNode(word))
    }

    node.replaceWith(fragment)
  }
}

function createReplacementElement({
  subject,
  original,
  text,
}: {
  subject: Wanikani.Subject
  original: string
  text: string
}): HTMLElement {
  const element = document.createElement(YamashinaReplacementElement.tag)
  element.setAttribute('original', original)
  element.setAttribute('subject-id', subject.id.toString())
  element.textContent = text

  return element
}

function createReplacementCandidateForWord(word: string): string {
  return PROPER_NOUNS.includes(word) ? word : word.toLowerCase()
}

class YamashinaReplacementElement extends HTMLElement {
  static tag = 'ys-replacement'

  constructor() {
    super()
  }
}
