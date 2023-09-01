import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Clients = React.lazy(() => import('./views/clients/Clients'))
const ViewClients = React.lazy(() => import('./views/clients/viewclients/ViewClients'))
const ManageDiscount = React.lazy(() => import('./views/manage-discount/ManageDiscount'))
const ViewManageDiscount = React.lazy(() =>
  import('./views/manage-discount/ViewManageDiscount/ViewManageDiscount'),
)
const RedemptionHistory = React.lazy(() => import('./views/redemption-history/RedemptionHistory'))
const RedemptionHistorySingle = React.lazy(() => import('./views/redemption-history/single-history/SingleRedemptionHistory'))
const AverageSingle = React.lazy(() => import('./views/average-discount/single-average/SingleAverageHistory'))
const AverageDiscount = React.lazy(() => import('./views/average-discount/AverageDiscount'))
const TotalVisits = React.lazy(() => import('./views/total-visits/TotalVisits'))
const AddPromotions = React.lazy(() => import('./views/addpromotions/AddPromotions'))
const Profile = React.lazy(() => import('./views/profile/ViewMerchants'))
const Settings = React.lazy(() => import('./views/settings/EditMerchants'))
const Branchs = React.lazy(() => import('./views/branchs/Branchs'))
const AddBranchs = React.lazy(() => import('./views/branchs/addbranchpin/AddBranchpin'))
const EditBranchs = React.lazy(() => import('./views/branchs/editbranchpin/EditBranchpin'))
const QRCode= React.lazy(() => import('./views/qrcode/QRCode'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/clients', name: 'Clients', element: Clients },
  { path: '/clients/viewclients', name: 'ViewClients', element: ViewClients },
  { path: '/manage-discount', name: 'ManageDiscount', element: ManageDiscount },
  { path: '/addpromotions', name: 'AddPromotions', element: AddPromotions },
  { path: '/settings', name: 'Settings', element: Settings },
  {
    path: '/manage-discount/ViewManageDiscount',
    name: 'ViewManageDiscount',
    element: ViewManageDiscount,
  },
  { path: '/redemption-history', name: 'RedemptionHistory', element: RedemptionHistory },
  { path: '/single-history', name: 'RedemptionHistorySingle', element: RedemptionHistorySingle },
  { path: '/average-discount', name: 'AverageDiscount', element: AverageDiscount },
  { path: '/single-average', name: 'AverageSingle', element: AverageSingle },
  { path: '/total-visits', name: 'TotalVisits', element: TotalVisits },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/qrcode', name: 'QRCode', element: QRCode },
  { path: '/branchs', name: 'Branchs', element: Branchs },
  { path: '/addbranchpin', name: 'Branchs', element: AddBranchs },
  { path: '/editbranchpin', name: 'Branchs', element: EditBranchs },
]

export default routes
