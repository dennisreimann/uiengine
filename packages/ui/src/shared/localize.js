module.exports = (dict, key, interpolations) => {
  const localized = key.split('.').reduce((a, b) => a && a[b], dict)

  if (localized && interpolations) {
    return localized.replace(/%\{(.+?)\}/g, (match, name) => {
      const str = interpolations[name]

      if (str) {
        return str
      } else {
        console.warn('[UIengine]', `Missing interpolation "${name}" for key "${key}"!`)
        return `[${name}]`
      }
    })
  } else if (localized) {
    return localized
  } else {
    console.warn('[UIengine]', `Missing localization for key "${key}"!`)
    return `[${key}]`
  }
}
