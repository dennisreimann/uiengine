const debounceTimer = {}

export const debounce = (key, fn, delay) => {
  clearTimeout(debounceTimer[key])
  debounceTimer[key] = setTimeout(fn, delay)
}

export const relativePath = (source, target) => {
  const sep = (source.indexOf('/') !== -1) ? '/' : '\\'
  const targetArr = target.split(sep)
  const targetFile = targetArr.pop()
  const targetPath = targetArr.join(sep) + sep
  const sourceArr = source.split(sep)
  sourceArr.pop() // sourceFile

  let relativePath = ''
  while (targetPath.indexOf(sourceArr.join(sep)) === -1) {
    sourceArr.pop()
    relativePath += `..${sep}`
  }

  const relPathArr = targetArr.slice(sourceArr.length)
  if (relPathArr.length) {
    relativePath += relPathArr.join(sep) + sep
  }

  return relativePath + targetFile
}
