import React, { useState, useEffect,useRef } from 'react'
import { baseUrl } from 'src/baseurl'
import {
  CModal,
  CModalBody,
  CButton,
  CForm,
  CFormInput,
  CCard,
  CCol,
  CFormTextarea,
  CFormLabel
} from '@coreui/react'
import { useLocation } from 'react-router-dom'
const EditBranchpin = () => {
  const [visible, setVisible] = useState(false)
  const [msg, setMessage] = useState('')
  const [branchpin, setBranchpin] = useState('')
  const [discription, setDiscription] = useState('')
  const[result,setResult]= useState("");
  const userid=localStorage.getItem('user_id')
  const token = localStorage.getItem('token')
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const branchid = params.get("id");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer "+token);
  useEffect(() => {
    const getapi = () => {
      var raw = JSON.stringify({
        id: branchid,
      });
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw
      };
      fetch(
        baseUrl+"/getSingleBranch",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            console.log(result)
            setResult(result.branch[0]);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  },[]);
  const handleButtonClick = () => {
    if (inputValues.some(value => value === '')) {
      setMessage('Please Enter Branch Pin in 6 Digit');
      setVisible(true);
      return;
    }
    const branch = inputValues.join('') || result.branchpin;
    const dis = discription || result.discription;
    const formData = new FormData();
    formData.append('branchpin', branch);
    formData.append('discription', dis);
    formData.append('merchant_id',userid);
    formData.append('id',branchid);
    var requestOptionsUpdate = {
      method: 'POST',
      headers: myHeaders,
      body: formData
    };
    fetch(baseUrl+"/editBranch", requestOptionsUpdate)
      .then(response => response.json())
      .then(result => {
        if(result.status) {
          setMessage(result.msg);
        }
      })
      .catch(error => console.log('error', error));
      setVisible(!visible)
    }
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
      <CCard>
        <CCol xs={6} className="p-3">
            <CForm>
            <CFormLabel>
                Branch Pin
              </CFormLabel>
              <div className="d-flex align-items-center">
                {String(result.branchpin).split('').map((value, index) => (
                  <CFormInput
                    key={index}
                    type="text"
                    min="0"
                    max="9"
                    maxLength="1"
                    className="m-1 text-center"
                    Value={inputValues[index] || value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    ref={inputRefs[index]}
                    required
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <div className="form-group mt-3 col-12">
                <CFormTextarea
                  label="Branch Description"
                  name="branch_discription"
                  placeholder="Leave a text here"
                  defaultValue={result.discription}
                  onChange={(e) => setDiscription(e.target.value)}
                ></CFormTextarea>
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
            </CForm>
        </CCol>
      </CCard>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalBody>{msg}</CModalBody>
      </CModal>
    </>
  )
}

export default EditBranchpin
