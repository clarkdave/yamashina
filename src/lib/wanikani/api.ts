import { Wanikani, WanikaniApi } from './types'

interface CreateWanikaniClientProps {
  apiKey: string
}

export function createWanikaniClient({ apiKey }: CreateWanikaniClientProps) {
  return new WanikaniClient(apiKey)
}

class WanikaniClient {
  private readonly baseUrl = 'https://api.wanikani.com/v2'

  constructor(private readonly apiKey: string) {}

  async getAllReviewStatistics(params?: {
    subject_types?: readonly Wanikani.SubjectType[]
  }): Promise<WanikaniApi.ReviewStatistic[]> {
    return this.getAll<WanikaniApi.ReviewStatistic>({
      path: '/review_statistics',
      params,
    })
  }

  async getAllSubjects(params?: {
    ids?: number[]
    types?: readonly Wanikani.SubjectType[]
  }): Promise<WanikaniApi.Subject[]> {
    return this.getAll<WanikaniApi.Subject>({
      path: '/subjects',
      params,
    })
  }

  private async getAll<T>(props: {
    path: string
    params?: Record<string, any>
  }): Promise<T[]> {
    let data: T[] = []
    let nextPath = props.path
    let params = props.params ?? {}

    while (true) {
      const res = await this.get<WanikaniApi.Response<T>>({
        path: nextPath,
        params,
      })

      data = [...data, ...res.data]

      const nextUrl = res.pages.next_url
      if (!nextUrl) break

      // the next url will contain all our query params already
      nextPath = nextUrl.replace(this.baseUrl, '')
      params = {}
    }

    return data
  }

  private async get<T>(props: {
    path: string
    params?: Record<string, any>
  }): Promise<T> {
    const path = props.path.replace(/^\//, '')
    const params = new URLSearchParams(props.params ?? {})
    const query = [...params.keys()].length === 0 ? '' : `?${params.toString()}`

    return await fetch(`${this.baseUrl}/${path}${query}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Wanikani-Revision': '20170710',
      },
    }).then(res => res.json() as T)
  }
}
