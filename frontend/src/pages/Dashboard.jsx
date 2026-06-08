import BusinessForm from '../components/BusinessForm'
import HeroBanner from '../components/HeroBanner'
import PreviewCard from '../components/PreviewCard'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="lg:pl-[260px]">
        <Topbar />
        <main
          className="space-y-6 px-4 py-6 sm:px-6 lg:px-8"
          id="dashboard"
        >
          <HeroBanner />
          <div className="grid gap-6 xl:grid-cols-2">
            <BusinessForm />
            <PreviewCard />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
