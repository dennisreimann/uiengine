import merge from 'deepmerge'

const { state: { config: { ui } }, locales } = window.UIengine
const custom = (ui && ui.locales) ? ui.locales : {}

export const LOCALES = merge(locales, custom)
