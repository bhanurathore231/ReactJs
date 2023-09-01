import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { baseUrl } from 'src/baseurl'
import {
  CFormInput,
  CForm,
  CFormLabel,
  CButton,
  CCol,
  CCard,
  CModal,
  CModalBody,
  CFormTextarea
} from '@coreui/react'
const ViewManageDiscount = () => {
  const [visible, setVisible] = useState(false)
  const [msg, setMessage] = useState('')
  const [discountlevel1, setDiscountlevel1] = useState()
  const [discountlevel2, setDiscountlevel2] = useState()
  const [discountlevel3, setDiscountlevel3] = useState()
  const [discountlevel4, setDiscountlevel4] = useState()
  const [discountlevel5, setDiscountlevel5] = useState()
  const [discountlevel6, setDiscountlevel6] = useState()
  const [discountlevel7, setDiscountlevel7] = useState()
  const [discountlevel8, setDiscountlevel8] = useState()
  const [discountlevel9, setDiscountlevel9] = useState()
  const [discountlevel10, setDiscountlevel10] = useState()
  const [result, setPromotionData] = useState('')
  const token = localStorage.getItem('token')
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const Id = params.get("id");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  useEffect(() => {
    const getapi = () => {
      var get = JSON.stringify({
        "id": Id,
      });

      var requestOptionsUpdate = {
        method: 'POST',
        headers: myHeaders,
        body: get
      };
      fetch(baseUrl + "/getSinglePromotion", requestOptionsUpdate)
        .then(response => response.json())
        .then(result => {
          if (result.status) {
            setPromotionData(result.promotion[0]);
          }
        })
        .catch(error => console.log('error', error));
    };
    getapi();
  }, []); 
  const UpdatePromotion = () => {
    const level1=discountlevel1 ? discountlevel1:result.level1
    const level2=discountlevel2 ? discountlevel2:result.level2
    const level3=discountlevel3 ? discountlevel3:result.level3
    const level4=discountlevel4 ? discountlevel4:result.level4
    const level5=discountlevel5 ? discountlevel5:result.level5
    const level6=discountlevel6 ? discountlevel6:result.level6
    const level7=discountlevel7 ? discountlevel7:result.level7
    const level8=discountlevel8 ? discountlevel8:result.level8
    const level9=discountlevel9 ? discountlevel9:result.level9
    const level10=discountlevel10 ? discountlevel10:result.level10

    const formData = new FormData();
    formData.append('promotion_id',Id);
    formData.append('level1',level1);
    formData.append('level2',level2);
    formData.append('level3',level3);
    formData.append('level4',level4);
    formData.append('level5',level5);
    formData.append('level6',level6);
    formData.append('level7',level7);
    formData.append('level8',level8);
    formData.append('level9',level9);
    formData.append('level10',level10);

    var requestOptionsUpdate = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
    };
    fetch(baseUrl + "/editPromotionLevelAdmin", requestOptionsUpdate)
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
            <h2>Discount Levels %</h2>
            <div className="manage-levels d-flex">
              <div className="col-6">
                <div className="col-6">
                  <CFormLabel htmlFor="discountlevel1">Discount Level 1</CFormLabel>
                  <CFormInput
                    type="number"
                    className="discount-input"
                    id="discountlevel1"
                    placeholder="%"
                    Value={result.level1}
                    onChange={(e) => setDiscountlevel1(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <CFormLabel htmlFor="discountlevel2">Discount Level 2</CFormLabel>
                  <CFormInput
                    type="number"
                    className="discount-input"
                    id="discountlevel2"
                    placeholder="%"
                    Value={result.level2}
                  onChange={(e) => setDiscountlevel2(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <CFormLabel htmlFor="discountlevel3">Discount Level 3</CFormLabel>
                  <CFormInput
                    type="number"
                    className="discount-input"
                    id="discountlevel3"
                    placeholder="%"
                    Value={result.level3}
                  onChange={(e) => setDiscountlevel3(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <CFormLabel htmlFor="discountlevel4">Discount Level 4</CFormLabel>
                  <CFormInput
                    type="number"
                    className="discount-input"
                    id="discountlevel4"
                    placeholder="%"
                    Value={result.level4}
                  onChange={(e) => setDiscountlevel4(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <CFormLabel htmlFor="discountlevel5">Discount Level 5</CFormLabel>
                  <CFormInput
                    type="number"
                    className="discount-input"
                    id="discountlevel5"
                    placeholder="%"
                    Value={result.level5}
                  onChange={(e) => setDiscountlevel5(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="col-6">
                  <CFormLabel htmlFor="discountlevel6">Discount Level 6</CFormLabel>
                  <CFormInput
                    type="number"
                    className="discount-input"
                    id="discountlevel6"
                    placeholder="%"
                    Value={result.level6}
                  onChange={(e) => setDiscountlevel6(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <CFormLabel htmlFor="discountlevel7">Discount Level 7</CFormLabel>
                  <CFormInput
                    type="number"
                    className="discount-input"
                    id="discountlevel7"
                    placeholder="%"
                    Value={result.level7}
                  onChange={(e) => setDiscountlevel7(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <CFormLabel htmlFor="discountlevel8">Discount Level 8</CFormLabel>
                  <CFormInput
                    type="number"
                    className="discount-input"
                    id="discountlevel8"
                    placeholder="%"
                    Value={result.level8}
                  onChange={(e) => setDiscountlevel8(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <CFormLabel htmlFor="discountlevel9">Discount Level 9</CFormLabel>
                  <CFormInput
                    type="number"
                    className="discount-input"
                    id="discountlevel9"
                    placeholder="%"
                    Value={result.level9}
                  onChange={(e) => setDiscountlevel9(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <CFormLabel htmlFor="discountlevel10">Discount Level 10</CFormLabel>
                  <CFormInput
                    type="number"
                    className="discount-input"
                    id="discountlevel10"
                    placeholder="%"
                    Value={result.level10}
                  onChange={(e) => setDiscountlevel10(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 mb-3 col-12">
              <CButton className="manage-discount-save" color="primary" onClick={UpdatePromotion}>
                Save
              </CButton>
            </div>
          </CForm>
        </CCol>
      </CCard>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalBody>{msg}</CModalBody>
      </CModal>
    </>
  )
}

export default ViewManageDiscount
