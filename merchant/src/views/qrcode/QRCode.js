import React,{ useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons'
import { baseUrl } from './../../baseurl'
import {
  CCol,
  CCard,
  CImage,
} from '@coreui/react'
const ViewManageDiscount = () => {
    const handlePrint = () => {
        window.print();
      };
  const [msg, setMessage] = useState('')
  const [qrcode, setQRcode] = useState('')
  const token = localStorage.getItem('token')
  const Id = localStorage.getItem('user_id');
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
      var raw = JSON.stringify({
        "id": Id,
      });
      useEffect(() => {
        const getapi = () => {
    
      var requestOptionsUpdate = {
        method: 'POST',
        headers: myHeaders,
        body: raw
      };
      fetch(baseUrl+"/getMerchantQRCode", requestOptionsUpdate)
        .then(response => response.json())
        .then(result => {
          if(result.status) {
            console.log(result)
            setQRcode(result.qrcode)
            setMessage(result.msg);
          }
        })
        .catch(error => console.log('error', error));
    };
    getapi();
  }, []);
  return (
    <>
      <CCard>
        <CCol xs={12} className="d-flex justify-content-between align-items-center p-3">
            <CCol xs={9}>
            <h2>Merchant QR Code</h2>
        </CCol>
        <CCol xs={3}>
        <FontAwesomeIcon icon={faPrint} size="2x" style={{ marginLeft: '85%', cursor:'pointer' }} className="custom-print-button" onClick={handlePrint}/>
            </CCol>
            </CCol>
            <CCol xs={12} className="">
            <div className="text-center">
            <CImage name="merchant-qrcode" fluid src={qrcode} width={500} height={500}/>
            </div>
        </CCol>
       </CCard>     
    </>
  )
}

export default ViewManageDiscount
