import { PROPER_NOUNS } from '../lib/const'
import { Wanikani } from '../lib/wanikani/types'

const TEXT_SELECTOR = 'body *:not(noscript):not(script):not(style)'
const WORD_REGEX = /\b(\S+?)\b/g

export function replaceWordsInDocument(
  dictionaries: Wanikani.Dictionaries,
): void {
  document.querySelectorAll(TEXT_SELECTOR).forEach(element => {
    ;[...element.childNodes]
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .forEach(textNode => {
        const text = textNode.textContent
        if (!text) return

        // const fragment = document.createDocumentFragment()

        textNode.textContent = text.replace(WORD_REGEX, word =>
          replaceWord(word, dictionaries),
        )
      })
  })
}

function replaceWord(
  word: string,
  dictionaries: Wanikani.Dictionaries,
): string {
  const vocab = dictionaries.kanji
  const candidate = PROPER_NOUNS.includes(word) ? word : word.toLowerCase()

  if (!vocab[candidate]) {
    return word
  }

  const subject = vocab[candidate]

  return subject.characters
}
