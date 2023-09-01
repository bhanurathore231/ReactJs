import React, { useState, useEffect } from "react";
import {
  CFormInput,
  CForm,
  CButton,
  CModal,
  CModalBody,
  CCard,
  CCol,
  CModalHeader,
  CModalFooter
} from '@coreui/react'
import { baseUrl } from "src/baseurl";
import { useLocation } from 'react-router-dom'
const EditClients = () => {
  const [resultclient, setResult] = useState("");
  const token = localStorage.getItem("token");
  const [visible, setVisible] = useState("");
  const [addvisible, addsetVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const client_id = params.get("id");
  const handleLogoChange = (e) => {
    setSelectedLogoFile(e.target.files[0]);
  };
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  var raw = JSON.stringify({
    id: client_id,
  });
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
  useEffect(() => {
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
    formData.append('id',client_id);
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
  const AddMoneyButtonClick = () => {
    const extbalance = resultclient.walletbalance;
    const balance = parseInt(extbalance) + parseInt(amount);
    var myAmountHeader = new Headers();
    myAmountHeader.append("Authorization", "Bearer " + token);
    myAmountHeader.append("Content-Type", "application/json");
    myAmountHeader.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");

    var res = JSON.stringify({
      id: client_id,
      add_amount: balance,
    });
    var requestOptions = {
      method: "POST",
      headers: myAmountHeader,
      body: res,
    };
    fetch(baseUrl + "/updateClientWalletAmount", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          console.log(result.msg);
        }
      })
      .catch((error) => console.log("error", error));
    getapi();  
    addsetVisible(false); 
  };
  return (
    <>
      <CCard>
        <CCol xs={12} className="data-view">
        <CForm>
        <div className="mb-3">
              <CFormInput
                label="Username"
                className="input-group"
                placeholder="Username"
                autoComplete="username"
                name="username"
                Value={resultclient.username}
                onChange={(e) => setUsername(e.target.value)}
              />
        </div>      
        <div className="mb-3">
              <CFormInput
                label="Email"
                className="input-group"
                placeholder="Email"
                autoComplete="email"
                name="email"
                Value={resultclient.email}
                onChange={(e) => setEmail(e.target.value)}

              />
        </div>
        <div className="mb-3">
              <CFormInput
                label="Phone"
                className="input-group"
                placeholder="Phone"
                autoComplete="phone"
                name="phone"
                Value={resultclient.phone}
                onChange={(e) => setPhone(e.target.value)}
              />
          </div>
          <div className="mb-3">
              <CFormInput
                label="New Password"
                className="input-group"
                placeholder="password"
                autoComplete="password"
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormInput
                label="Profile Picture"
                type="file"
                id="formFile"
                name="file"
                Value={selectedLogoFile ? selectedLogoFile.name : ''} onChange={handleLogoChange}
              />
              </div>
              <div className="col-9 d-flex">
              <CCol xs={6}>
              <div className="mb-3">
              <CFormInput
                label="Wallet Balance"
                type="text"
                className="show-balance"
                value={resultclient.walletbalance+" $"}
                disabled
              />
              </div>
              </CCol>
              <CCol xs={3}>
              <div className="mb-3 d-flex flex-column justify-content-center">
              <CButton color="primary" className="addmoneybtn m-3" onClick={() => addsetVisible(true)}>Add Money</CButton>
              </div>
              </CCol>
              </div>
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
      <CModal visible={addvisible} onClose={() => addsetVisible(false)}>
        <CModalHeader onClose={() => addsetVisible(false)}></CModalHeader>
        <CModalBody>
                <CFormInput
                label="Amount: $"
                type="text"
                className="show-balance"
                onChange={(e) => setAmount(e.target.value)}
              />
        </CModalBody>
        <CModalFooter>
          <CButton
            className="save-classcustom"
            color="primary"
            onClick={AddMoneyButtonClick}
          >
            save
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default EditClients
