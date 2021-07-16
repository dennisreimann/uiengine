function renderImpact(impact) {
  switch (impact) {
    case 'minor':
      return `<span class="a11y-issue__tag a11y-issue__tag--minor">${impact}</span>`
    case 'moderate':
      return `<span class="a11y-issue__tag a11y-issue__tag--moderate">${impact}</span>`
    case 'serious':
      return `<span class="a11y-issue__tag a11y-issue__tag--serious">${impact}</span>`
    case 'critical':
      return `<span class="a11y-issue__tag a11y-issue__tag--critical">${impact}</span>`
    default:
      break;
  }
}

function setupAxe(iframe, axeOpts, target, content, retries = 0) {
  if (iframe.contentWindow && iframe.contentWindow.axe) {
    const { contentWindow: { axe } } = iframe

    if (axeOpts) {
      axe.configure(axeOpts)
    }

    axe.run((error, results) => {
      if (error) return console.error('[UIengine]', 'Error running Axe:', error)

      let targetInfo = target.querySelector('span.info')
      if (!targetInfo) {
        targetInfo = document.createElement('span')
        targetInfo.setAttribute('class', 'a11y-info')
        target.append(targetInfo)
      }
      targetInfo.innerHTML = `(${results.violations.length} violations)`

      content.innerHTML = `<h3>A11y: ${results.violations.length} violations</h3>

      ${results.violations.map(item => {
        return `<div class="a11y-issue">${renderImpact(item.impact)} <p class="a11y-issue__description">${item.description}</p><a href="${item.helpUrl}" class="a11y-issue__link" target="_blank" rel="noopener">More info...</a></div>`
      }).join('')}`
    })
  } else if (retries <= 10) {
    setTimeout(() => { setupAxe(iframe, axeOpts, target, content, retries + 1) }, 100)
  } else {
    console.warn('[UIengine]', 'Could not setup Axe plugin.')
  }
}

document.addEventListener('plugin-preview-a11y:iframe-load', ({ detail }) => {
  const { target, content, iframe, plugin: { axe: axeOpts } } = detail

  if (!target.dataset.axeSetup) {
    target.dataset.axeSetup = true

    setupAxe(iframe, axeOpts, target, content)
  }
}, false)
