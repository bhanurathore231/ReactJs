import React, { useState, useRef,useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { Container, Radio, Rating } from "./RatingStyles";
import {
  CForm,
  CFormTextarea,
  CCard,
  CButton,
  CModal,
  CModalBody,
} from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilArrowCircleLeft } from "@coreui/icons";
import { baseUrl } from "src/baseurl";
const LeaveReview = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const handleButtonClickBack = () => {
    navigate(-1);
  };
  const [review, setReview] = useState();
  const [rate, setRate] = useState(0);
  const [msg, setMsg] = useState();
  const [clientname, setUsername] = useState("");
  const userid = localStorage.getItem("user_id");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const Id = params.get("id");
  const token = localStorage.getItem("token");
  const formRef = useRef(null);
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  var clientdata = JSON.stringify({
    id: userid,
  });
  useEffect(() => {
    const getapi = () => {
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: clientdata
      };
      fetch(
        baseUrl+"/getClient",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setUsername(result.client.username);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  }, []);
  const submitreviewclick=()=>{
    var raw = JSON.stringify({
      merchant_id: Id,
      client_id: userid,
      review: review,
      rating: rate,
      client_name:clientname
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    fetch(
      baseUrl+"/merchantReview",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setVisible(!visible)
        setMsg(result.msg);
        formRef.current.reset();
      })
      .catch((error) => console.log("error", error));
  }
  return (
    <>
      <CIcon
        icon={cilArrowCircleLeft}
        size="xxl"
        onClick={handleButtonClickBack}
      />
      <CCard>
        <div className="rating-div">
          <h3>Review</h3>
          <CForm ref={formRef}>
          <Container>
      {[...Array(5)].map((item, index) => {
        const givenRating = index + 1;
        return (
          <label>
            <Radio
              type="radio"
              value={givenRating}
              onClick={() => {
                setRate(givenRating);
              }}
            />
            <Rating>
              <FaStar
                color={
                  givenRating < rate || givenRating === rate
                    ? "#FFA41C"
                    : "rgb(192,192,192)"
                }
              />
            </Rating>
          </label>
        );
      })}
    </Container>
            <CFormTextarea
              id="rating-merchants"
              label="Leave Comment"
              rows={3}
              onChange={(e) => setReview(e.target.value)}
            ></CFormTextarea>
            <div className="rating-rave-div">
              <CButton
                className="rating-save-btn-custom"
                color="primary"
                onClick={submitreviewclick}
              >
                Save
              </CButton>
            </div>
          </CForm>
        </div>
      </CCard>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalBody>{msg}</CModalBody>
      </CModal>
    </>
  );
};

export default LeaveReview;
