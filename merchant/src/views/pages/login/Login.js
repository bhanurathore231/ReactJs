import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { baseUrl } from './../../../baseurl'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errormsg, setErrormsg] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    const redirectTimer = setTimeout(() => {
      if (token) {
        return navigate('/profile')
      }
    })
    return () => clearTimeout(redirectTimer)
  })
  const handleButtonClick = () => {
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");

var raw = JSON.stringify({
  "email": username,
  "password": password
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw
};

fetch(baseUrl+"/merchantLogin", requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result.msg);
    console.log(result.status);
    if(result.status) {
      localStorage.setItem('token', result.token) 
      localStorage.setItem('user_id', result.user_id) 
      navigate('/dashboard')
    }
    setErrormsg(result.msg);
  })
  .catch(error => console.log('error', error));
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="username"
                        name="username"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        name="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton className="px-4-loginprim" onClick={handleButtonClick}>
                          Login
                        </CButton>    
                      </CCol>
                      <span className="show-error-login p-3">{errormsg}</span>
                      <CCol xs={6} className="text-right">
                        <Link to="/forgot">
                          <CButton color="link" className="px-0-textcolor">
                            Forgot password?
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white-black py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Merchant</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
