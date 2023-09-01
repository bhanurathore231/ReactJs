import React, { useState, useEffect } from "react";
import { CCard, CCardBody, CCol, CCardText } from "@coreui/react";
import { FaStar } from "react-icons/fa";
import { cilArrowCircleLeft } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { baseUrl } from "src/baseurl";
import { useNavigate,useLocation } from "react-router-dom";
import { Container, Radio, Rating } from "./RatingStyles";
const MerchantReviewView = () => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const [review, setGetreviewdata] = useState(0);
  const [AvgReviewTrue, setAvgReviewTrue]=useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const Id = params.get("id");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  myHeaders.append("Authorization", "Bearer " + token);
  var raw = JSON.stringify({
    id: Id,
    client_id: user_id,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  useEffect(() => {
    const getreview = () => {
      fetch(baseUrl + "/getmerchantReview", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setGetreviewdata(result.review);
            setAvgReviewTrue(true)
          }
        })
        .catch((error) => console.log("error", error));
    };
    getreview();
  }, [review]);

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
          style={{cursor:'pointer'}}
        />
      </div>
    </div>
      <CCard>
        <CCardBody style={{textAlign:'center'}}>
          <CCol xs={12}>
            <h4 className="username-rating">{review.client_name}</h4>
            <CCol xs={12} className="ratingstarprofile">
            <Container>
              
              { AvgReviewTrue ? 
                [...Array(5)].map((item, index) => {
                const givenRating = index + 1
                return (
                  <label>
                    <Radio
                      type="radio"
                      value={givenRating}
                    />
                    <Rating>
                      <FaStar
                        color={givenRating < review.rating || givenRating === review.rating ? '#FFA41C' : 'rgb(192,192,192)'}
                      />
                    </Rating>
                  </label>
                )
              }): <h6>No Rating...</h6>
            }
            </Container>
            </CCol>
            <CCol xs={12}>
              <CCardText><strong>{review.review}</strong></CCardText>
            </CCol>
          </CCol>
        </CCardBody>
      </CCard>
      </>
  );
};
export default MerchantReviewView;
