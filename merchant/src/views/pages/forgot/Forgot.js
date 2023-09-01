import React from 'react'
import { Link } from 'react-router-dom'
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

const Forgot = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol className="cardbody-class" md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm className="main-formclass">
                    <h1 className="forgotpaas mb-3">Forgot Password</h1>
                    <div>
                      <CFormInput
                        type="text"
                        className="emailclass"
                        required
                        autoComplete="email"
                        placeholder="Enter Your Email"
                      />
                    </div>
                    <CRow>
                      <CCol xs={6}>
                        <CButton className="mt-3">Sent Password</CButton>
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

export default Forgot
