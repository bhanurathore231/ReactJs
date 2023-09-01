import React, { useState } from "react";
import imgUrl from "./../../assets/images/avatars/2.jpg";
import {
  CCard,
  CCardImage,
  CListGroup,
  CListGroupItem,
  CCol,
  CInputGroupText,
} from "@coreui/react";
import { baseUrl } from "src/baseurl";
import { cilArrowCircleLeft } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { cilUser, cilMobile,cilDollar, cilPeople, cilLockLocked } from "@coreui/icons";
const Profile = () => {
  const handleButtonClickBack = () => {
    navigate(-1);
  };
  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  const [result, useResult] = useState("");
  var count = JSON.stringify({
    id: userid,
  });
  var countOption = {
    method: "POST",
    headers: myHeaders,
    body: count,
  };
  fetch(
    baseUrl+"/getClient",
    countOption
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.status) {
        useResult(result.client);
      }
    })
    .catch((error) => console.log("error", error));

  return (
    <>
      <CIcon
        icon={cilArrowCircleLeft}
        size="xxl"
        onClick={handleButtonClickBack}
        style={{cursor:'pointer'}}
      />
      <CCard className="card-main-sec">
        <CCol xs={12} className="client-profile-div-custom">
          <CCol xs={12} className="profile-img-div">
            <CCardImage
              orientation="top"
              className="profile-image"
              src={result.profilepic}
            />
          </CCol>
          <CCol  xs={12}>
            <CListGroup flush>
              <CListGroupItem className="group-item-profile-page">
                <CInputGroupText className="user-icon">
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <span className="name-span"> Name:</span>
                <h4 className="client-count-profile-page">{result.username}</h4>
              </CListGroupItem>
              <CListGroupItem className="group-item-profile-page">
                <CInputGroupText className="user-icon">@</CInputGroupText>
                <span className="name-span"> Email:</span>
                <h4 className="client-count-profile-page">{result.email}</h4>
              </CListGroupItem>
              <CListGroupItem className="group-item-profile-page">
                <CInputGroupText className="user-icon">
                  <CIcon icon={cilMobile} />
                </CInputGroupText>
                <span className="name-span"> Phone:</span>
                <h4 className="client-count-profile-page">{result.phone}</h4>
              </CListGroupItem>
            </CListGroup>
          </CCol>
        </CCol>
      </CCard>
    </>
  );
};

export default Profile;
