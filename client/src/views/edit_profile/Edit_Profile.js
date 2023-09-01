import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CModalBody,
  CModal,
} from "@coreui/react";
import { baseUrl } from "src/baseurl";
const EditProfile = () => {
  const [resultclient, setResult] = useState("");
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [visible, setVisible] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const handleLogoChange = (e) => {
    setSelectedLogoFile(e.target.files[0]);
  };
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  var raw = JSON.stringify({
    id: userid,
  });
  useEffect(() => {
    const getapi = () => {
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw
      };
      fetch(
        baseUrl+"/getClient",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResult(result.client);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  }, []);
  const handleUpdateClick = () => {
    const name=username ? username:resultclient.username
    const newemail=email ? email:resultclient.email
    const newphone=phone ? phone:resultclient.phone
    const logo=selectedLogoFile ? selectedLogoFile:resultclient.logo
    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('username', name);
    formData.append('password', password);
    formData.append('phone',newphone);
    formData.append('email',newemail);
    formData.append('id',userid);
    var requestOptionsedit = {
      method: "POST",
      headers: myHeaders,
      body: formData,
    };
    fetch(
      baseUrl+"/editClient",
      requestOptionsedit
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          setMsg(result.msg);
          setVisible(!visible)
        }
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <div>
      <CCard>
        <CCol xs={12} className="p-3">
          <CForm>
            <CInputGroup>
              <CFormInput
                label="Username"
                className="input-group"
                placeholder="Username"
                autoComplete="username"
                name="username"
                Value={resultclient.username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </CInputGroup>
            <CInputGroup>
              <CFormInput
                label="Email"
                className="input-group"
                placeholder="Email"
                autoComplete="email"
                name="email"
                Value={resultclient.email}
                onChange={(e) => setEmail(e.target.value)}

              />
            </CInputGroup>
            <CInputGroup>
              <CFormInput
                label="Phone"
                className="input-group"
                placeholder="Phone"
                autoComplete="phone"
                name="phone"
                Value={resultclient.phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </CInputGroup>
            <CInputGroup>
              <CFormInput
                label="New Password"
                className="input-group"
                placeholder="password"
                autoComplete="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </CInputGroup>
              <CFormInput
                label="Profile Picture(150x150px)"
                type="file"
                id="formFile"
                name="file"
                Value={selectedLogoFile ? selectedLogoFile.name : ''} onChange={handleLogoChange}
              />
            <div className="d-grid-custom">
              <CButton className="savebutton" color="primary" onClick={handleUpdateClick}>
                save
              </CButton>
            </div>
          </CForm>
        </CCol>
      </CCard>
      <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalBody>{msg}</CModalBody>
    </CModal>
    </div>
  );
};
export default EditProfile;
