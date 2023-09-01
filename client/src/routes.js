import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const MerchantsPromotion = React.lazy(() => import('./views/merchantspromotion/MerchantsPromotion'))
const Profile = React.lazy(() => import('./views/profile/Profile'))
const Edit_Profile = React.lazy(() => import('./views/edit_profile/Edit_Profile'))
// const Demo = React.lazy(() => import('./views/demo/Demo'))
const CurrentPromotion = React.lazy(() => import('./views/currentpromotion/CurrentPromotion'))
const AfterQrCode = React.lazy(() => import('./views/afterqrcode/AfterQrCode'))
const PaymentPin = React.lazy(() => import('./views/afterqrcode/Paymentpin/PaymentPin'))
const MerchantsProfile = React.lazy(() => import('./views/merchantprofile/ViewMerchants'))
const PaymentSuccess = React.lazy(() =>
  import('./views/afterqrcode/Paymentpin/paymentsuccess/PaymentSuccess'),
)

const Transactions = React.lazy(() => import('./views/transactions/Transactions'))
const Referral = React.lazy(() => import('./views/referral/Referral'))
const Wallet = React.lazy(() => import('./views/wallet/Wallet'))
const MerchantsReview = React.lazy(() => import('./views/merchantsreview/MerchantsReview'))
const LeaveReview = React.lazy(() => import('./views/merchantsreview/leavereview/LeaveReview'))
const MerchantsView = React.lazy(() => import('./views/merchantsreview/merchantsview/MerchantsView'))
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/merchantspromotion', name: 'MerchantsPromotion', element: MerchantsPromotion },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/edit_profile', name: 'Edit_Profile', element: Edit_Profile },

  { path: '/currentpromotion', name: 'CurrentPromotion', element: CurrentPromotion },
  { path: '/afterqrcode', name: 'AfterQrCode', element: AfterQrCode },
  { path: '/afterqrcode/PaymentPin', name: 'PaymentPin', element: PaymentPin },
  {
    path: '/afterqrcode/PaymentPin/paymentsuccess',
    name: 'PaymentSuccess',
    element: PaymentSuccess,
  },
  { path: '/transactions', name: 'Transactions', element: Transactions },
  { path: '/referral', name: 'Referral', element: Referral },
  { path: '/merchantsreview', name: 'MerchantsReview', element: MerchantsReview },
  { path: '/merchantsreview/leavereview', name: 'LeaveReview', element: LeaveReview },
  { path: '/merchantprofile', name: 'MerchantsProfile', element: MerchantsProfile },
  { path: '/wallet', name: 'Wallet', element: Wallet },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/merchantsreview/merchantsview', name: 'MerchantsView', element: MerchantsView },
]

export default routes
