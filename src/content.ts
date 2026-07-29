import hilfe from '../content/hilfe.md?raw'
import datenschutz from '../content/datenschutz.md?raw'
import impressum from '../content/impressum.md?raw'
import ueber from '../content/ueber.md?raw'

export type ContentSlug = 'hilfe' | 'datenschutz' | 'impressum' | 'ueber'

/**
 * German legal and help content, bundled at build time. Content is authored in
 * German; the interface language may differ. Rendering disables raw HTML.
 */
export const CONTENT: Record<ContentSlug, string> = {
  hilfe,
  datenschutz,
  impressum,
  ueber,
}
