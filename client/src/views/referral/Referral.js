import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RWebShare } from "react-web-share";
import { baseUrl } from 'src/baseurl';
import {
  cilShareAlt,
  cilEnvelopeLetter,
  cilArrowCircleLeft,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CRow,
  CCol,
  CCard,
  CCardTitle,
  CCardBody,
  CFormInput,
} from '@coreui/react'
const Referral = () => {
  const [resultclient, setResult] = useState("");
  const [resultamount, setResultAmount] = useState("");
  const token = localStorage.getItem("token");
  const client_id = localStorage.getItem("user_id");
  const navigate = useNavigate()
  const handleButtonClickBack = () => {
    navigate(-1)
  }
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  var raw = JSON.stringify({
    id: client_id,
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
    const getapiamount = () => {
      var requestOptionsamount = {
        method: "POST",
        headers: myHeaders,
        body: raw
      };
      fetch(
        baseUrl+"/getRefferalamount",
        requestOptionsamount
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            console.log(result)
            setResultAmount(result.amount.referral_amount);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapiamount();
  }, []);
  return (
    <>
      <CIcon icon={cilArrowCircleLeft} size="xxl" onClick={handleButtonClickBack} style={{cursor:'pointer'}} />
      <CRow>
        <CCol xs={12}>
          <CCard style={{ width: '100%' }}>
            <CCardBody>
              <div className="referalmessagelogodiv">
                <CIcon className="referal-logo-" icon={cilEnvelopeLetter} height={48} alt="Logo" />
              </div>
              <CCardTitle className="discountheading">Referral Link</CCardTitle>
              <CCardTitle className="referl-text">
                Referral And Get <b>{resultamount}$</b> You know you love us, your friends will too
              </CCardTitle>
              <div className="referal-link-div">
                <CFormInput
                  type="text"
                  className="referal-link"
                  placeholder={`Register/${resultclient.username}${resultclient.id}`}
                  aria-label="readonly input example"
                  readOnly
                />
            <RWebShare
                data={{
                    text: "Client Register",
                    url: `https://ryankclient.readyforyourreview.com/#/register?&referralcode=${resultclient.username}${resultclient.id}`,
                    title: "Referral Link",
                }}
                onClick={() => console.log("shared successfully!")}
            >
                <button><CIcon
                  className="referal-logo"
                  icon={cilShareAlt}
                  height={38}
                  alt="Logo"
                /> </button>
            </RWebShare>
        </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Referral
