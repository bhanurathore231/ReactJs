import React, { useState } from 'react'
import { baseUrl } from 'src/baseurl'
import { useNavigate } from "react-router-dom";
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

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errormsg, setErrormsg] = useState("");
  const navigate = useNavigate();
  const handleButtonClick = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
    var raw = JSON.stringify({
      username: username,
      password: password,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    fetch(
      baseUrl+"/adminlogin",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          const userid = result.user_id;
          localStorage.setItem("user_id", userid);
          const res = result.token;
          localStorage.setItem("token", res);
          navigate("/dashboard");
          setErrormsg(result.msg);
        }
        setErrormsg(result.msg);
      })
      .catch((error) => console.log("error", error));
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1 style={{ textAlign: 'center' }}>Admin Login</h1>
                    <CInputGroup className="mb-3 mt-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup> 
                    <span className="show-error-login p-3">{errormsg}</span>
                    <CRow>
                      <CCol xs={12}>
                        <CButton
                          color="primary"
                          className="px-4-loginadmin"
                          onClick={handleButtonClick}
                        >
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default AdminLogin
