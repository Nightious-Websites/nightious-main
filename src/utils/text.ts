/**
 * Wraps English pronouns in accent-italic spans for Instrument Serif italic treatment.
 * Input should be plain text (no HTML) — the output is passed to `set:html`.
 */
export function accentPronouns(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
  return escaped.replace(
    /\b(your|you|we|our|us|my)\b/gi,
    '<span class="accent-italic">$1</span>',
  )
}
