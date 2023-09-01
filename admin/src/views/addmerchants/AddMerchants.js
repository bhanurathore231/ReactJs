import React, { useState, useRef } from 'react'
import {
  CFormInput,
  CForm,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CCard,
  CCol,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { baseUrl } from 'src/baseurl'
const AddMerchants = () => {
  const navigate = useNavigate()
  const handleButtonClick = () => {
    navigate('/merchants')
  }
  const [showmsg,setErrormsg]=useState('');
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [website,setWebsite]=useState('');
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [about,setAbout]=useState('');
  const [facebook,setFacebook]=useState('');
  const [instagram,setInstagram]=useState('');
  const [youtube,setYoutube]=useState('');
  const [tiktok,setTiktok]=useState('');
  const [email,setEmail]=useState('');
  const [visible, setVisible] = useState(false)
  const token = localStorage.getItem("token");
  const formRef = useRef(null);
  const handleLogoChange = (e) => {
    setSelectedLogoFile(e.target.files[0]);
  };
  const AddMerchantApi = () => {
    var myHeaders = new Headers()
    myHeaders.append("Authorization", "Bearer " + token);
    const formData = new FormData();
    formData.append('logo', selectedLogoFile);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('website', website);
    formData.append('email',email);
    formData.append('facebook',facebook);
    formData.append('youtube',youtube);
    formData.append('tiktok',tiktok);
    formData.append('instagram',instagram);
    formData.append('about',about);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formData
    }

    fetch(baseUrl+"/merchantRegister", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          setErrormsg(result.msg)
          formRef.current.reset();
        }
        setErrormsg(result.msg)
      })
      .catch((error) => console.log('error', error))
      setVisible(!visible)
  }
  return (
    <>
      <CCard>
        <CCol xs={12} className="data-view">
        <CForm ref={formRef}>
            <div className="mb-3">
              <CFormInput
                type="name"
                id="merchant-name"
                label="Name"
                placeholder="Enter Merchant Name"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="email"
                id="merchant-address"
                label="Email"
                placeholder="Enter Merchant Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="password"
                id="merchant-password"
                label="Password"
                placeholder="Enter Merchant Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="text"
                id="merchant-website"
                label="Website"
                placeholder="Enter Merchant Website"
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormInput type="file" id="formFile" label="Merchant Logo" Value={selectedLogoFile ? selectedLogoFile.name : ''} onChange={handleLogoChange}/>
            </div>
            <div className="mb-3">
              <CFormInput
                type="email"
                id="merchant-address"
                label="Social links"
                placeholder="Facebook"
                onChange={(e) => setFacebook(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="text"
                name="youtubemerchants"
                id="youtube-link-merchants"
                placeholder="Youtube "
                onChange={(e) => setYoutube(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="text"
                name="youtubemerchants"
                id="insta-link-merchants"
                placeholder="Instagram"
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="text"
                name="tiktokmerchants"
                id="tiktok-link-merchants"
                placeholder="Tiktok"
                onChange={(e) => setTiktok(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormTextarea
                id="bioTextarea"
                label="About"
                placeholder="Enter Detail for Mercent"
                rows={3}
                onChange={(e) => setAbout(e.target.value)}
              ></CFormTextarea>
            </div>
            <div className="mb-3 create-merchant">
              <CButton color="primary" onClick={AddMerchantApi}>
                Submit
              </CButton>
            </div>
          </CForm>
        </CCol>
      </CCard>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}></CModalHeader>

        <CModalBody>{showmsg}</CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>

          <CButton color="primary" onClick={handleButtonClick}>
            Merchants List
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AddMerchants
