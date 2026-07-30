import NavGroupItem from '@/features/settings/components/ui/NavGroupItem'
import MyEarningsSection from '@/features/payments/components/MyEarningsSection'
import MyPaymentsSection from '@/features/payments/components/MyPaymentsSection'
import SparksSection from '@/features/sparks/components/SparksSection'
import { useStore } from '@/store/store'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const ProfileSettingsPage = () => {
  const location = useLocation()
  const initialSection = (location.state as { section?: number } | null)?.section ?? 1
  const [selectedSection, setSelectedSection] = useState(initialSection)
  const user = useStore((state) => state.auth.user)
  const isTutor = user?.role === 'TUTOR'
  const NAV_GROUPS = [
    {
      label: 'Account',
      items: [
        {
          stepNumber: 1,
          label: 'Contact Info',
          component: <h1>Contact Info</h1>,
          show: true,
        },
        {
          stepNumber: 3,
          label: 'Password & Security',
          component: <h1>Password & Security</h1>,
          show: true,
        },
      ],
    },
    {
      label: 'Billing',
      items: [
        {
          stepNumber: 4,
          label: 'Earnings',
          component: <MyEarningsSection />,
          show: isTutor,
        },
        {
          stepNumber: 5,
          label: 'Sparks',
          component: <SparksSection />,
          show: isTutor,
        },
        {
          stepNumber: 6,
          label: 'Payments',
          component: <MyPaymentsSection />,
          show: !isTutor,
        },
      ],
    },
  ]

  const selectedItem = NAV_GROUPS.flatMap((group) => group.items).find(
    (item) => item.show && item.stepNumber === selectedSection
  )

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-semibold">Settings</h1>
      <div className="grid grid-cols-[240px_1fr] gap-8">
        <nav className="space-y-6">
          {NAV_GROUPS.map(({ label, items }) => (
            <NavGroupItem
              key={label}
              label={label}
              items={items}
              selectedItem={selectedSection}
              onSelectItem={setSelectedSection}
            />
          ))}
        </nav>
        <div>{selectedItem?.component}</div>
      </div>
    </div>
  )
}

export default ProfileSettingsPage
