import { ExtensionSettings } from '../../lib/settings'
import { Wanikani } from '../../lib/wanikani/types'
import { YamashinaSpanElement, YamashinaTooltipElement } from '../elements'
import h from 'hyperscript'

export function addTooltipToElement(
  element: HTMLElement,
  subject: Wanikani.Subject,
  settings: ExtensionSettings,
) {
  const original = element.getAttribute('original') ?? '?'

  let timer: number | null = null
  let tooltip: HTMLElement | null = null

  element.addEventListener('mouseover', () => {
    timer = window.setTimeout(() => {
      tooltip = createTooltip(subject, original)
      element.appendChild(tooltip)
    }, settings.tooltipDelayMs)
  })

  element.addEventListener('mouseout', () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (tooltip) {
      element.removeChild(tooltip)
      tooltip = null
    }
  })
}

function createTooltip(
  subject: Wanikani.Subject,
  original: string,
): HTMLElement {
  const reading = subject.readings?.find(x => x.primary)?.reading
  const normalize = {
    padding: '0',
    margin: '0',
    color: 'white',
    'font-family': 'system-ui',
    'font-style': 'normal',
    'font-size': '16px',
    'font-weight': '400',
  }

  return h(
    YamashinaTooltipElement.tag,
    {
      style: {
        position: 'absolute',
        background: 'rgba(0, 0, 0, 0.98)',
        padding: '6px 12px',
        'border-radius': '4px',
      },
    },
    h(
      YamashinaSpanElement.tag,
      {
        style: {
          display: 'flex',
          'flex-direction': 'row',
        },
      },
      h(
        YamashinaSpanElement.tag,
        {
          style: {
            display: 'flex',
            'flex-direction': 'column',
            'border-right': '1px solid #333',
            'padding-right': '10px',
            'margin-right': '10px',
          },
        },
        h(
          YamashinaSpanElement.tag,
          {
            style: {
              ...normalize,
              'font-size': '11px',
              color: '#bbb',
            },
          },
          'reading',
        ),
        h(
          YamashinaSpanElement.tag,
          {
            style: {
              ...normalize,
            },
          },
          reading ?? '',
        ),
      ),
      h(
        YamashinaSpanElement.tag,
        {
          style: {
            display: 'flex',
            'flex-direction': 'column',
          },
        },
        h(
          YamashinaSpanElement.tag,
          {
            style: {
              ...normalize,
              'font-size': '11px',
              color: '#bbb',
            },
          },
          'original',
        ),
        h(
          YamashinaSpanElement.tag,
          {
            style: {
              ...normalize,
              'font-size': '13px',
              'padding-top': '1px',
            },
          },
          original ?? '?',
        ),
      ),
    ),
  )
}
