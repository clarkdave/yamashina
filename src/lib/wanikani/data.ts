import { createWanikaniClient } from './api'
import { Wanikani, WanikaniApi } from './types'
import { PROPER_NOUNS } from '../const'

interface GetWanikaniDictionariesProps {
  apiKey: string
}

export async function getWanikaniDictionaries({
  apiKey,
}: GetWanikaniDictionariesProps): Promise<Wanikani.Dictionaries> {
  const api = createWanikaniClient({ apiKey })
  const types = ['kanji', 'vocabulary'] as const

  const statistics = await api.getAllReviewStatistics({
    subject_types: types,
  })

  const subjects = await api.getAllSubjects({
    types,
  })

  const kanji: Wanikani.Dictionary = {}
  const vocabulary: Wanikani.Dictionary = {}

  for (const dict of [kanji, vocabulary]) {
    addMeaningsToDictionary(dict, statistics, subjects, 'primary')
    addMeaningsToDictionary(dict, statistics, subjects, 'auxiliary')
  }

  return {
    kanji,
    vocabulary,
  }
}

function addMeaningsToDictionary(
  dict: Wanikani.Dictionary,
  stats: readonly WanikaniApi.ReviewStatistic[],
  subjects: readonly WanikaniApi.Subject[],
  kind: 'primary' | 'auxiliary',
): void {
  for (const stat of stats) {
    const subject = subjects.find(x => x.id === stat.data.subject_id)
    if (!subject) continue

    const getMeaningKey = (word: string) => {
      return PROPER_NOUNS.includes(word) ? word : word.toLowerCase()
    }

    const subjectForDict: Wanikani.Subject = {
      id: subject.id,
      ...subject.data,
    }

    switch (kind) {
      case 'primary': {
        for (const meaning of subject.data.meanings) {
          dict[getMeaningKey(meaning.meaning)] = subjectForDict
        }
      }

      case 'auxiliary':
        for (const meaning of subject.data.auxiliary_meanings) {
          const key = getMeaningKey(meaning.meaning)

          if (meaning.type !== 'whitelist') continue
          if (dict[key]) continue

          dict[key] = subjectForDict
        }
    }
  }
}
