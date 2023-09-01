import React, { useEffect, useState, useRef } from "react";
import CIcon from "@coreui/icons-react";
import { cilArrowCircleLeft } from "@coreui/icons";
import {
  CFormInput,
  CForm,
  CFormLabel,
  CButton,
  CCard,
  CCol,
} from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseUrl } from "src/baseurl";
const PaymentPin = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("PaymentSuccess");
  };
  const handleButtonClickBack = () => {
    navigate(-1);
  };
  const [msg, setMsg] = useState("");
  const [amount, setAmount] = useState("");
  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const PromotionId = params.get("id");
  const Discount = params.get("discount");
  const MerchantID = params.get("merchant_id");
  const discountlevel = params.get("discountlevel");
  const paymentcheck = () => {
    var Paymentheader = new Headers();
    Paymentheader.append("Authorization", "Bearer " + token);
    Paymentheader.append("Content-Type", "application/json");
    Paymentheader.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
    var paymentdata = JSON.stringify({
      id: userid,
      merchant_id: MerchantID,
      promotion_id: PromotionId,
      brachpin: inputValues.join(''),
      amount: amount,
      discountvalue: Discount,
      discountlevel: discountlevel,
    });
    var payment = {
      method: "POST",
      headers: Paymentheader,
      body: paymentdata,
    };
    fetch(baseUrl + "/paymentCheck", payment)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          window.location.href = `/#/afterqrcode/PaymentPin/paymentsuccess?discount=${encodeURIComponent(
            result.discount
          )}&payamount=${encodeURIComponent(
            result.paymentamount
          )}&msg=${encodeURIComponent(result.msg)}&id=${encodeURIComponent(
            MerchantID
          )}`;
        }
        setMsg(result.msg);
      })
      .catch((error) => console.log("error", error));
  };
  const [inputValues, setInputValues] = useState(['', '', '', '', '', '']);
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);

    if (value.length === 0 && index > 0) {
      inputRefs[index - 1].current.focus();
    } else if (value.length === 1 && index < inputValues.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  return (
    <>
      <CIcon
        icon={cilArrowCircleLeft}
        size="xxl"
        onClick={handleButtonClickBack}
      />
      <CCard>
        <CCol xs={12} className="paymentpindiv">
          <CForm>
            <div className="mb-3 branchinput">
              <CFormLabel htmlFor="exampleFormControlInput1">Amount</CFormLabel>
              <CFormInput
                type="number"
                id="amount"
                name="payment_amount"
                placeholder="Please Enter Amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="mb-3 branchinput col-12">
              <CFormLabel htmlFor="exampleFormControlInput2">
                Branch Pin
              </CFormLabel>
              <div className="align-items-center">
              {inputValues.map((value, index) => (
        <CFormInput
          key={index}
          type="text"
          min="0"
          max="9"
          maxLength="1"
          className="m-1 text-center"
          value={value}
          onChange={(e) => handleInputChange(index, e.target.value)}
          ref={inputRefs[index]}
          required
          autoFocus={index === 0}
        />
      ))}
              </div>
            </div>
            <span className="show-error-login">{msg}</span>
            <div className="branchpinsubmit">
              <CButton
                className="custom-button mt-3"
                color="primary"
                onClick={paymentcheck}
              >
                Confirm
              </CButton>
            </div>
          </CForm>
        </CCol>
      </CCard>
    </>
  );
};

export default PaymentPin;
