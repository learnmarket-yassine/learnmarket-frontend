import { FOOTER_COLUMNS } from '@/lib/Constants'
import FooterColumn from './FooterColumn'
import FooterBrand from './FooterBrand'

function Footer() {
  return (
    <footer className="w-full space-y-12">
      <div className="container space-y-12">
        <FooterBrand />
        {/* Columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <FooterColumn key={column.id} column={column} />
          ))}
        </div>
      </div>
      <p className="border-t-2 border-[#BBCFF9] py-5 text-center text-sm text-[#2563EB]">
        © {new Date().getFullYear()} Yora. All rights reserved.
      </p>
    </footer>
  )
}
export default Footer
