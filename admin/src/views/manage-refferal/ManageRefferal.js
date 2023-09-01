import React, { useState, useEffect } from 'react'
import { baseUrl } from 'src/baseurl'
import { CButton, CFormInput, CForm, CCol, CModal, CModalBody, CCard } from '@coreui/react'
const ManageRefferal = () => {
  const [visible, setVisible] = useState(false)
  const [msg, setMessage] = useState('')
  const [getamount, setGetAmountData] = useState('')
  const [Amount, setAmount] = useState()
  const token = localStorage.getItem('token')
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  useEffect(() => {
    const getapi = () => {
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
      };
      fetch(baseUrl + "/getRefferalAmountAdmin", requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status) {
            setGetAmountData(result.amount.referral_amount);
          }
        })
        .catch(error => console.log('error', error));
    };
    getapi();
  }, []); 
  const UpdateData = () => {
    const updateamount=Amount ? Amount:getamount

    const formData = new FormData();
    formData.append('amount',updateamount);

    var requestOptionsUpdate = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
    };
    fetch(baseUrl + "/addrefferalamount", requestOptionsUpdate)
      .then(response => response.json())
      .then(result => {
        if (result.status) {
          setMessage(result.msg);
        }
        setMessage(result.msg);
      })
      .catch(error => console.log('error', error));
    setVisible(!visible)
  }
  return (
    <>
      <CCard>
        <CCol xs={12} className="data-view">
        <CForm>
          <CCol xs={9}>
          <CCol xs={12} className="d-flex">
        <CCol xs={3} style={{ width: 'fit-content' }}> 
          <h3>Referral Amount <strong>$:</strong></h3>
          </CCol>
              <CFormInput
                type="text"
                id="refferal-amount"
                placeholder="Amount"
                Value={getamount}
                style={{ marginLeft: '1%' }}
                onChange={(e) => setAmount(e.target.value)}
              />
              </CCol>
                <CButton  color="primary" className="mt-4" onClick={UpdateData} style={{ float: 'right' }}>
                  Save
                </CButton>
                </CCol>
          </CForm>
        </CCol>
      </CCard>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalBody>{msg}</CModalBody>
      </CModal>
    </>
  )
}

export default ManageRefferal
