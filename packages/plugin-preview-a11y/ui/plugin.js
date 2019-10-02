document.addEventListener('plugin-preview-a11y:iframe:load', ({ detail }) => {
  const { target, content, iframe, plugin } = detail
  const { axe: axeOpts } = plugin

  let retries = 0

  function setupAxe () {
    const { contentWindow: { axe } } = iframe

    if (axe) {
      console.log('plugin-preview-a11y:iframe:load', detail)
      if (!axe) return console.error('Axe could not be found in preview iframe.')

      if (axeOpts) {
        axe.configure(axeOpts)
      }

      axe.run((error, results) => {
        if (error) return console.error('[UIengine]', 'Error running Axe:', error)

        console.debug('[UIengine]', 'Axe plugin results:', results, { target, content, iframe, plugin })

        let targetInfo = target.querySelector('span.info')
        if (!targetInfo) {
          targetInfo = document.createElement('span')
          targetInfo.setAttribute('class', 'info')
          target.append(targetInfo)
        }
        targetInfo.innerHTML = `(${results.violations.length} violations)`

        content.innerHTML = `<h3>A11y: ${results.violations.length} violations</h3>

        ${results.violations.map(item => `<h4>${item.id} (${item.impact})</h4><p>${item.description}</p>`).join('')}`
      })
    } else if (retries <= 10) {
      setTimeout(setupAxe, 100)
      retries++
    } else {
      console.warn('[UIengine]', 'Could not setup Axe plugin.')
    }
  }

  setupAxe()
}, false)
