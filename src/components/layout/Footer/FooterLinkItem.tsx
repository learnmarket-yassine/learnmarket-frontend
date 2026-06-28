export interface FooterLink {
  href: string
  label: string
}

function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <li>
      <a
        href={link.href}
        className="text-sm text-[#2563EB] transition-colors hover:text-[#2563EB]/90"
      >
        {link.label}
      </a>
    </li>
  )
}
export default FooterLinkItem
