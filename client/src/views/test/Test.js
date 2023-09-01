import React from "react";
import { CCard, CCardBody, CCol, CCardText } from "@coreui/react";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { FaStar } from "react-icons/fa";
import { Container, Radio, Rating } from "./RatingStyles";
import { cilArrowCircleLeft } from "@coreui/icons";

const Test = () => {
  const navigate = useNavigate();
  const handleButtonClickBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="cus-icon">
        <div className="itmecion">
          <CIcon
            icon={cilArrowCircleLeft}
            size="xxl"
            onClick={handleButtonClickBack}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <CCard>
        <CCardBody style={{ textAlign: "center" }}>
          <CCol xs={12}>
            <h4 className="username-rating" style={{marginBottom:10}}>Client Name</h4>
            <CCol xs={12} className="ratingstarprofile">
              <Container>
                { (
                  [...Array(5)].map((item, index) => {
                    const givenRating = index + 1;
                    return (
                      <label>
                        <Radio type="radio" value={givenRating} />
                        <Rating>
                          <FaStar
                            color={
                              givenRating < 5 ||
                              givenRating === 5
                                ? "#FFA41C"
                                : "rgb(255,215,0)"
                            }
                          />
                        </Rating>
                      </label>
                    );
                  })
                ) }
              </Container>
            </CCol>
            <CCol xs={12}>
              <CCardText>
                <strong>test rating</strong>
              </CCardText>
            </CCol>
          </CCol>
        </CCardBody>
      </CCard>
    </>
  );
};
export default Test;
