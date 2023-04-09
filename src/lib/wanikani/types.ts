export namespace Wanikani {
  export type SubjectType = 'radical' | 'kanji' | 'vocabulary'

  export type Dictionary = {
    [english: string]: WanikaniApi.SubjectData
  }

  export interface Dictionaries {
    kanji: Dictionary
    vocabulary: Dictionary
  }
}

export namespace WanikaniApi {
  export interface ReviewStatisticData {
    created_at: string
    subject_id: number
    subject_type: Wanikani.SubjectType
    meaning_correct: number
    meaning_incorrect: number
    meaning_max_streak: number
    meaning_current_streak: number
    reading_correct: number
    reading_incorrect: number
    reading_max_streak: number
    reading_current_streak: number
    percentage_correct: number
    hidden: boolean
  }

  export interface ReviewStatistic {
    id: number
    object: 'review_statistic'
    url: string
    data_updated_at: string
    data: ReviewStatisticData
  }

  export interface PageLinks {
    per_page: number
    next_url: string | null
    previous_url: string | null
  }

  export interface Response<T> {
    object: 'collection'
    url: string
    pages: PageLinks
    total_count: number
    data_updated_at: string
    data: T[]
  }

  export type ReviewStatisticsResponse = Response<ReviewStatistic>

  export interface SubjectMeaning {
    meaning: string
    primary: boolean
    accepted_answer: boolean
  }

  export interface AuxiliaryMeaning {
    meaning: string
    type: 'whitelist' | 'blacklist'
  }

  export interface CharacterImageMetadata {
    inline_styles: boolean
    color?: string
    dimensions?: string
    style_name?: string
  }

  export interface CharacterImage {
    url: string
    metadata: CharacterImageMetadata
    content_type: string
  }

  export interface SubjectData {
    created_at: string
    level: number
    slug: string
    hidden_at: string | null
    document_url: string
    characters: string
    character_images: CharacterImage[]
    meanings: SubjectMeaning[]
    auxiliary_meanings: AuxiliaryMeaning[]
    amalgamation_subject_ids: number[]
    meaning_mnemonic: string
    lesson_position: number
    spaced_repetition_system_id: number
  }

  export interface Subject {
    id: number
    object: Wanikani.SubjectType
    url: string
    data_updated_at: string
    data: SubjectData
  }

  export type SubjectsResponse = Response<Subject>
}
