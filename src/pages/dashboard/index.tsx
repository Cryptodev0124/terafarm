import { CHAIN_IDS } from 'utils/wagmi'
import Dashboard from 'views/Dashboard'

const DashboardPage = () => {
	return <Dashboard />
}

DashboardPage.chains = CHAIN_IDS

export default DashboardPage
