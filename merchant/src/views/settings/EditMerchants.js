import React, { useEffect, useState } from 'react'
import { CFormInput, CCard, CForm, CFormTextarea, CButton, CModal, CModalBody } from '@coreui/react'
import { baseUrl } from './../../baseurl'
const EditMerchants = () => {
  const user_id=localStorage.getItem('user_id')
  const [visible, setVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [facebook, setFacebook] = useState('')
  const [youtube, setYoutube] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [instagram, setInstagram] = useState('')
  const [about, setAbout] = useState('')
  const token = localStorage.getItem('token')
  const [merchantdata,setResult]=useState('')
  const [msg,setMessage]=useState('')
  
  var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer "+token);
var raw = JSON.stringify({
  "id": user_id,
});
useEffect(() => {
  const getapi=()=>{
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };
    fetch(baseUrl+"/getMerchant", requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result.status) {
          setResult(result.merchant[0]);
        }
      })
      .catch(error => console.log('error', error));
  }
    getapi();
  },[])
  ///update api
  const handleLogoChange = (e) => {
    setSelectedLogoFile(e.target.files[0]);
  };
  const handleButtonClick = () => {
    const name=username ? username:merchantdata.username
    const newemail=email ? email:merchantdata.email
    const newwebsite=website ? website:merchantdata.website
    const newfacebook=facebook ? facebook:merchantdata.facebook
    const newyoutube=youtube ? youtube:merchantdata.youtube
    const newtiktok=tiktok ? tiktok:merchantdata.tiktok
    const newinstagram=instagram ? instagram:merchantdata.instagram
    const newabout=about ? about:merchantdata.about
    const logo=selectedLogoFile ? selectedLogoFile:merchantdata.logo
    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('username', name);
    formData.append('password', password);
    formData.append('website', newwebsite);
    formData.append('email',newemail);
    formData.append('facebook',newfacebook);
    formData.append('youtube',newyoutube);
    formData.append('tiktok',newtiktok);
    formData.append('instagram',newinstagram);
    formData.append('about',newabout);
    formData.append('id',user_id);
  var requestOptionsUpdate = {
    method: 'POST',
    headers: myHeaders,
    body: formData
  };
  fetch(baseUrl+"/editMerchant", requestOptionsUpdate)
    .then(response => response.json())
    .then(result => {
      if(result.status) {
        setMessage(result.msg);
      }
    })
    .catch(error => console.log('error', error));
    setVisible(!visible)
  }
  return (
    <>
      <CCard>
        <CForm className="main-form-custom-class">
          <h2>Edit Mercent Detail</h2>
          
          <><div className="mb-3">
              <CFormInput
                type="text"
                id="merchant-name"
                label="Name"
                placeholder="Enter Merchant Name"
                Value={merchantdata.username}
                onChange={(e) => setUsername(e.target.value)} />
            </div><div className="mb-3">
                <CFormInput type="password" id="merchant-password" label="New Password" placeholder="" onChange={(e) => setPassword(e.target.value)} />
              </div><div className="mb-3">
                <CFormInput type="text" id="merchant-website" label="Website" placeholder="Link" Value={merchantdata.website} onChange={(e) => setWebsite(e.target.value)} />
              </div><div className="mb-3">
                <CFormInput
                  type="email"
                  id="merchant-email"
                  label="Email"
                  placeholder="Enter Merchant Email"
                  Value={merchantdata.email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div><div className="mb-3">
                <CFormInput type="file" id="formFile" label="Merchant Logo  150x150 p" Value={selectedLogoFile ? selectedLogoFile.name : ''} onChange={handleLogoChange} />
              </div><div className="mb-3">
                <CFormInput
                  type="text"
                  id="merchant-facebook"
                  label="Social links"
                  placeholder="Facebook"
                  Value={merchantdata.facebook}
                  onChange={(e) => setFacebook(e.target.value)} />
              </div><div className="mb-3">
                <CFormInput type="text" id="Youtube-link-merchants" placeholder="Youtube" Value={merchantdata.youtube}
                  onChange={(e) => setYoutube(e.target.value)} />
              </div><div className="mb-3">
                <CFormInput type="text" id="Tiktok-link-merchants" placeholder="Tiktok" Value={merchantdata.tiktok}
                  onChange={(e) => setTiktok(e.target.value)} />
              </div><div className="mb-3">
                <CFormInput type="text" id="insta-link-merchants" placeholder="Instagram" Value={merchantdata.instagram}
                  onChange={(e) => setInstagram(e.target.value)} />
              </div><div className="mb-3">
                <CFormTextarea
                  id="bioTextarea"
                  label="About"
                  placeholder="Enter Detail for Mercent"
                  rows={3}
                  onChange={(e) => setAbout(e.target.value)}
                  defaultValue={merchantdata.about}>
                </CFormTextarea>
              </div><div className="mb-3 create-merchant">
                <CButton className="mt-5-primsave" color="primary" onClick={handleButtonClick}>
                  Save
                </CButton>
              </div></>
        </CForm>
      </CCard>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalBody>{msg}</CModalBody>
      </CModal>
    </>
  )
}

export default EditMerchants
