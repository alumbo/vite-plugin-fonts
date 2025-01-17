import type { HtmlTagDescriptor, Plugin, ResolvedConfig } from 'vite'
import type { GoogleFonts } from './google-fonts'
import injectGoogleFonts from './google-fonts'
import type { TypeKitFonts } from './typekit'
import injectTypekitFonts from './typekit'
import type { CustomFonts } from './custom'
import injectCustomFonts from './custom'

interface VitePluginFontsOptions {
  google?: GoogleFonts
  typekit?: TypeKitFonts
  custom?: CustomFonts
}

let config: ResolvedConfig
const MODULE_ID = 'virtual:fonts.css'
const MODULE_ID_RESOLVED = '/@vite-plugin-fonts/fonts.css'

function VitePluginFonts(options: VitePluginFontsOptions = {}): Plugin {
  return {
    name: 'vite-plugin-fonts',
    enforce: 'pre',

    configResolved(_config) {
      config = _config
    },

    transformIndexHtml: {
      enforce: 'pre',
      transform: () => {
        const tags: HtmlTagDescriptor[] = []
        if (options.typekit)
          tags.push(...injectTypekitFonts(options.typekit))
        if (options.google)
          tags.push(...injectGoogleFonts(options.google))
        if (options.custom)
          tags.push(...injectCustomFonts(options.custom, config).tags)
        return tags
      },
    },

    resolveId(id) {
      if (id === MODULE_ID)
        return MODULE_ID_RESOLVED
    },

    load(id) {
      if (id === MODULE_ID_RESOLVED)
        return options.custom ? injectCustomFonts(options.custom, config).css : ''
    },
  }
}

export {
  VitePluginFonts,
  VitePluginFontsOptions,
}
export default VitePluginFonts
