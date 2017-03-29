const debounceTimer = {}

export const debounce = (key, fn, delay) => {
  clearTimeout(debounceTimer[key])
  debounceTimer[key] = setTimeout(fn, delay)
}

export const on = (type, selector, func) => {
  document.body.addEventListener(type, e => {
    if (e.target.matches(`${selector}, ${selector} *`)) func(e)
  })
}

export const trigger = (type, detail = {}) => {
  const event = new window.CustomEvent(type, { detail })
  document.body.dispatchEvent(event)
}

