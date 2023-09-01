import React, { useState, useRef } from 'react'
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
const AddBranchpin = () => {
  const [visible, setVisible] = useState(false)
  const [msg, setMessage] = useState('')
  const [discription, setDiscription] = useState('')
  const userid=localStorage.getItem('user_id')
  const token = localStorage.getItem('token')
  const formRef = useRef(null);
  const handleButtonClick = () => {
    if (inputValues.some(value => value === '')) {
      setMessage('Please Enter Branch Pin in 6 Digit');
      setVisible(true);
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);
    const formData = new FormData();
    formData.append('branchpin', inputValues.join(''));
    formData.append('discription', discription);
    formData.append('merchant_id',userid);

    var requestOptionsUpdate = {
      method: 'POST',
      headers: myHeaders,
      body: formData
    };
    fetch(baseUrl+"/createBranch", requestOptionsUpdate)
      .then(response => response.json())
      .then(result => {
        if(result.status) {
          setMessage(result.msg);
          formRef.current.reset();
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
            <CForm ref={formRef}>
              <CFormLabel>
                Branch Pin
              </CFormLabel>
              <div className="d-flex align-items-center">
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
              <div className="form-group mt-3 col-12">
                <CFormTextarea
                  label="Branch Description"
                  name="branch_discription"
                  placeholder="Leave a text here"
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

export default AddBranchpin
