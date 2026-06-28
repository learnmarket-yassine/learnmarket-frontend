import FooterLinkItem, { FooterLink } from './FooterLinkItem'

export type FooterColumn = {
  id: string
  links: FooterLink[]
}

function FooterColumn({ column }: { column: FooterColumn }) {
  return (
    <ul className="space-y-2">
      {column.links.map((link) => (
        <FooterLinkItem key={link.label} link={link} />
      ))}
    </ul>
  )
}
export default FooterColumn
