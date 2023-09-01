import React, { useState, useRef, useEffect } from 'react'
import { baseUrl } from './../../baseurl'
import {
  CModal,
  CModalBody,
  CButton,
  CForm,
  CFormInput,
  CCard,
  CCol,
  CFormTextarea,
  CFormLabel,
  CFormSelect
} from '@coreui/react'
const AddPromotions = () => {
  const [visible, setVisible] = useState(false)
  const [msg, setMessage] = useState('')
  const [result, setResult] = useState('')
  const [name, setName] = useState('')
  const [discription, setDiscription] = useState('')
  const [startdate, setStartdate] = useState('')
  const [enddate, setEnddate] = useState('')
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
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
  const [branchpin, setBranchpin] = useState("");

  const userid=localStorage.getItem('user_id')
  const token = localStorage.getItem('token')
  const formRef = useRef(null);
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer "+token);
  var raw = JSON.stringify({
    id: userid
  });
  useEffect(() => {
  const getapi = () => {
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    fetch(
      baseUrl+"/getBranchpin",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          setResult(result.branch.data);
        }
      })
      .catch((error) => console.log("error", error));
  };
  getapi();
},[]);
  const handleButtonClick = () => {

    const formData = new FormData();
    formData.append('logo', selectedLogoFile);
    formData.append('promotion_name', name);
    formData.append('promotion_discription', discription);
    formData.append('promotion_startdate', startdate);
    formData.append('promotion_enddate',enddate);
    formData.append('merchant_id',userid);
    formData.append('level1',discountlevel1);
    formData.append('level2',discountlevel2);
    formData.append('level3',discountlevel3);
    formData.append('level4',discountlevel4);
    formData.append('level5',discountlevel5);
    formData.append('level6',discountlevel6);
    formData.append('level7',discountlevel7);
    formData.append('level8',discountlevel8);
    formData.append('level9',discountlevel9);
    formData.append('level10',discountlevel10);
    formData.append('branchpin',branchpin);
  
    var requestOptionsUpdate = {
      method: 'POST',
      headers: myHeaders,
      body: formData
    };
    fetch(baseUrl+"/createPromotion", requestOptionsUpdate)
      .then(response => response.json())
      .then(result => {
        if(result.status) {
          setMessage(result.msg);
          formRef.current.reset();
        }
        setMessage(result.msg); 
      })
      .catch(error => console.log('error', error));
      setVisible(!visible)
    }
    const handleLogoChange = (e) => {
      setSelectedLogoFile(e.target.files[0]);
    };
  return (
    <>
      <CCard>
        <CCol xs={12} className="p-3">
            <CForm ref={formRef}>
              <div className="form-group col-6">
                <CFormInput
                  name="promotion_name"
                  type="text"
                  id="promotion-name"
                  label="Promotion Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <CFormLabel>
                Branch Pin
              </CFormLabel>
              <div className="d-flex align-items-center col-6">
              <CFormSelect
              size="sm"
              className="mb-3"
              aria-label="Choose Branchpin"
              onChange={(e) => setBranchpin(e.target.value)}
            >
              <option>Choose Branch</option>
              {Array.isArray(result) &&
                result.map((item) => {
                  return <option value={item.branchpin}>{item.branchpin}  {item.discription}</option>;
                })}
            </CFormSelect>
              </div>
              <div className="form-group mt-3 col-6">
                <CFormTextarea
                  id="floatingTextarea"
                  label="Promotion description"
                  name="promotion_discription"
                  placeholder="Leave a comment here"
                  onChange={(e) => setDiscription(e.target.value)}
                ></CFormTextarea>
              </div>
              <div className="form-group mt-3 col-6">
                <label className="">Promotion Start Date</label>
                <CFormInput name="promotion_startdate"  type="Date" onChange={(e) => setStartdate(e.target.value)} />
              </div>
              <div className="form-group mt-3 col-6">
                <label className="">Promotion End Date</label>
                <CFormInput name="promotion_enddate" type="Date" onChange={(e) => setEnddate(e.target.value)} />
              </div>
              <div className="mt-3 mb-3 col-6">
            <CFormInput type="file" id="formFile" label="Promotion Thumbnail" Value={selectedLogoFile ? selectedLogoFile.name : ''} onChange={handleLogoChange}/>
          </div>
            <h3>Discount(%) Levels</h3>
            <div className="two-row-convert">
              <div className="col-3">
                <CFormLabel htmlFor="discountlevel1">Discount Level 1</CFormLabel>
                <CFormInput
                  type="number"
                  className="discount-input"
                  name="discountlevel1"
                  placeholder="%"
                  onChange={(e) => setDiscountlevel1(e.target.value)}
                />
              </div>
              <div className="col-3">
                <CFormLabel htmlFor="discountlevel2">Discount Level 2</CFormLabel>
                <CFormInput
                  type="number"
                  className="discount-input"
                  id="discountlevel2"
                  name="discountlevel2"
                  placeholder="%"
                  onChange={(e) => setDiscountlevel2(e.target.value)}
                />
              </div>
              <div className="col-3">
                <CFormLabel htmlFor="discountlevel3">Discount Level 3</CFormLabel>
                <CFormInput
                  type="number"
                  className="discount-input"
                  id="discountlevel3"
                  name="discountlevel3"
                  placeholder="%"
                  onChange={(e) => setDiscountlevel3(e.target.value)}
                />
              </div>
              <div className="col-3">
                <CFormLabel htmlFor="discountlevel4">Discount Level 4</CFormLabel>
                <CFormInput
                  type="number"
                  className="discount-input"
                  id="discountlevel4"
                  name="discountlevel4"
                  placeholder="%"
                  onChange={(e) => setDiscountlevel4(e.target.value)}
                />
              </div>
              <div className="col-3">
                <CFormLabel htmlFor="discountlevel5">Discount Level 5</CFormLabel>
                <CFormInput
                  type="number"
                  className="discount-input"
                  id="discountlevel5"
                  name="discountlevel5"
                  placeholder="%"
                  onChange={(e) => setDiscountlevel5(e.target.value)}
                />
              </div>
            </div>

            <div className="two-row-convert">
              <div className="col-3">
                <CFormLabel htmlFor="discountlevel6">Discount Level 6</CFormLabel>
                <CFormInput
                  type="number"
                  className="discount-input"
                  id="discountlevel6"
                  name="discountlevel6"
                  placeholder="%"
                  onChange={(e) => setDiscountlevel6(e.target.value)}
                />
              </div>
              <div className="col-3">
                <CFormLabel htmlFor="discountlevel7">Discount Level 7</CFormLabel>
                <CFormInput
                  type="number"
                  className="discount-input"
                  id="discountlevel7"
                  name="discountlevel7"
                  placeholder="%"
                  onChange={(e) => setDiscountlevel7(e.target.value)}
                />
              </div>
              <div className="col-3">
                <CFormLabel htmlFor="discountlevel8">Discount Level 8</CFormLabel>
                <CFormInput
                  type="number"
                  className="discount-input"
                  id="discountlevel8"
                  name="discountlevel8"
                  placeholder="%"
                  onChange={(e) => setDiscountlevel8(e.target.value)}
                />
              </div>
              <div className="col-3">
                <CFormLabel htmlFor="discountlevel9">Discount Level 9</CFormLabel>
                <CFormInput
                  type="number"
                  className="discount-input"
                  id="discountlevel9"
                  name="discountlevel9"
                  placeholder="%"
                  onChange={(e) => setDiscountlevel9(e.target.value)}
                />
              </div>
              <div className="col-3">
                <CFormLabel htmlFor="discountlevel10">Discount Level 10</CFormLabel>
                <CFormInput
                  type="number"
                  className="discount-input"
                  id="discountlevel10"
                  name="discountlevel10"
                  placeholder="%"
                  onChange={(e) => setDiscountlevel10(e.target.value)}
                />
              </div>
            </div>
              <div className="d-flex justify-content-end">
                <CButton
                  className="mt-5-primsave mt-5"
                  color="primary"
                  onClick={handleButtonClick}
                >
                  Save
                </CButton>
              </div>
              <span className="show-error-login p-3">{msg}</span>
            </CForm>
        </CCol>
      </CCard>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalBody>{msg}</CModalBody>
      </CModal>
    </>
  )
}

export default AddPromotions
