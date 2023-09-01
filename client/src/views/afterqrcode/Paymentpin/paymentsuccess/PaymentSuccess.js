import React from 'react'
import { CCard, CCardImage, CCardBody,CCardTitle } from '@coreui/react'
import { Link } from 'react-router-dom'
import ReactImg from './../../../../assets/images/paymentsucess.png'
import { useLocation} from 'react-router-dom'
const PaymentSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const payamount = params.get("payamount");
  const Discount = params.get("discount");
  const msg = params.get("msg");
  const merchant_id = params.get("id");
  return (
    <>
      <CCard style={{ width: '100%' }}>
        <CCardImage className="Payment-success" orientation="top" src={ReactImg} />
        <CCardBody>
          <CCardTitle className="payment-success-title">{msg}</CCardTitle>
          <div className="payment-success-details-div">
            <CCardTitle className="payment-success-amount">Amount: ${payamount}</CCardTitle>
            <CCardTitle className="payment-success-amount">Discount: ${Discount}</CCardTitle>
          </div>
          <div className="payment-success-button-div">
            <Link to={`/merchantsreview/leavereview?id=${encodeURIComponent(merchant_id)}`} className="btn btn-primary">
            MerchantsReview
            </Link>
          </div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default PaymentSuccess
