export function richTextToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isRichTextEmpty(html: string): boolean {
  return richTextToPlainText(html).length === 0
}
