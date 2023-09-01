import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CInputGroupText,
  CInputGroup,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser } from "@coreui/icons";

const Forgot = () => {
  return (
    <CContainer>
      <CRow>
        <CCol md={9} className="mt-5">
          <CCard className="mx-4">
            <CCardBody>
              <CForm className="forgot-sec">
                <h1>Forgot Password</h1>

                <CFormInput
                  type="email"
                  placeholder="Please Enter your Email"
                  autoComplete="Email"
                />

                <CButton className="button-sec mt-4" color="success">
                  Send Link
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};
export default Forgot;
