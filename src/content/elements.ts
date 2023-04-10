export function registerCustomElements() {
  for (const Element of [
    YamashinaReplacementElement,
    YamashinaTooltipElement,
    YamashinaSpanElement,
  ]) {
    if (!customElements.get(Element.tag)) {
      customElements.define(Element.tag, Element)
    }
  }
}

export class YamashinaReplacementElement extends HTMLElement {
  static tag = 'ys-replacement'

  constructor() {
    super()
  }
}

export class YamashinaTooltipElement extends HTMLElement {
  static tag = 'ys-tooltip'

  constructor() {
    super()
  }
}

export class YamashinaSpanElement extends HTMLElement {
  static tag = 'ys-span'

  constructor() {
    super()
  }
}
