import Navbar from '@/components/layout/Navbar/Navbar'

const MyProfilePage = () => {
  return (
    <Navbar
      user={{ name: 'Amine Ben Khaled', role: 'Teacher', isOnline: true }}
      notificationCount={2}
    />
  )
}

export default MyProfilePage
