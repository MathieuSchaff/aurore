import globalData from '@csstools/postcss-global-data'
import customMedia from 'postcss-custom-media'
import nesting from 'postcss-nesting'

// Gate :hover rules behind (hover: hover) so taps on touch devices don't leave
// stuck hover states. Inline plugin: postcss-hover-media-feature@1.0.2 hangs on
// :hover inside :has(). Runs after nesting so it sees flat selectors.
// Caveat: substring match, so `:not(:hover)` is gated too (vanishes on touch).
// None exist today; write a plain default state + :hover override if you need one.
const HOVER_MEDIA = /\(\s*hover\s*:\s*hover\s*\)/i
const hoverGate = () => ({
  postcssPlugin: 'hover-media-gate',
  OnceExit(root, { AtRule }) {
    root.walkRules((rule) => {
      if (
        !rule.selector.includes(':hover') ||
        (rule.parent?.type === 'atrule' && rule.parent.name === 'keyframes')
      )
        return
      for (let p = rule.parent; p; p = p.parent) {
        if (p.type === 'atrule' && p.name === 'media' && HOVER_MEDIA.test(p.params)) return
      }
      const hoverSels = rule.selectors.filter((s) => s.includes(':hover'))
      const media = new AtRule({ name: 'media', params: '(hover: hover)', source: rule.source })
      media.append(rule.clone({ selectors: hoverSels }))
      rule.after(media)
      const rest = rule.selectors.filter((s) => !s.includes(':hover'))
      if (rest.length) rule.selectors = rest
      else rule.remove()
    })
  },
})

export default {
  plugins: [
    globalData({ files: ['src/styles/tokens/breakpoints.css'] }),
    customMedia(),
    nesting(),
    hoverGate(),
  ],
}
