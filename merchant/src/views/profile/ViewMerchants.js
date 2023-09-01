import React, { useState, useEffect} from 'react'
import { FaStar,FaStarHalfAlt } from 'react-icons/fa'
import { Container, Radio, Rating } from './RatingStyles'
import CIcon from '@coreui/icons-react'
import { baseUrl } from './../../baseurl'
import { cibFacebook, cibInstagram, cibTiktok, cibYoutube } from '@coreui/icons'
import {
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CListGroup,
  CListGroupItem,
  CCol,
  CCardLink,
} from '@coreui/react'
const ViewMerchants = () => {
  const token = localStorage.getItem('token');
  const user_id=localStorage.getItem('user_id');
  const [resultdata,setResult]=useState('');
  const [getreviewdata,setGetreviewdata]=useState('');
  const [AvgReview, setAvgReview]=useState('');
  const [AvgReviewTrue, setAvgReviewTrue]=useState(false);
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
myHeaders.append("Authorization", "Bearer "+token);
var raw = JSON.stringify({
  "id": user_id,
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw
};
useEffect(() => {
  const getapi = () => {
fetch(baseUrl+"/getMerchant", requestOptions)
  .then(response => response.json())
  .then(result => {
    if(result.status) {
      setResult(result.merchant[0]);
    }
  })
  .catch(error => console.log('error', error));
};
getapi();
const getreview=()=>{
  fetch(baseUrl+"/getmerchantReview", requestOptions)
  .then(response => response.json())
  .then(result => {
    if(result.status) {
      setGetreviewdata(result.review);
      setAvgReview(result.totalratingavg)
      setAvgReviewTrue(true)

    }
  })
  .catch(error => console.log('error', error));
}
getreview();
}, [AvgReview]);

const facebooklink = () => {
  window.open(resultdata.facebook, '_blank');
};
const instagramlink = () => {
  window.open(resultdata.instagram, '_blank');
};
const tiktoklink = () => {
  window.open(resultdata.tiktok, '_blank');
};
const youttubelink = () => {
  window.open(resultdata.youtube, '_blank');
};
  return (
    <>
      <CCard>
        <CCol xs={12} className="merchant-profile-div">
          <CCol xs={3} className="merchant-profile-image-div">
            <CCardImage orientation="top" className="merchant-profile-image" src={resultdata.logo} />
          </CCol>
          <CCol xs={9}>
            <CCardBody>
              <CCardTitle className="profile-name">{resultdata.username}</CCardTitle>
              <CCardText value={resultdata.about}>
                {resultdata.about}
              </CCardText>
            </CCardBody>
            <CListGroup flush>
              <CListGroupItem className="group-item-profile-page">
                <h4 className="current-promo-profile-page"></h4>
              </CListGroupItem>
              <CListGroupItem className="group-item-profile-page">
                <h4 className="all-promo-profile-page"></h4>
              </CListGroupItem>
              <CListGroupItem className="group-item-profile-page">
                <h4 className="client-count-profile-page"></h4>
              </CListGroupItem>
            </CListGroup>
            <CCardBody className='d-flex'>
                {resultdata.facebook?
                <div onClick={facebooklink} className="m-1">
                <CIcon icon={cibFacebook} className="facebook-icon" size="xl"  style={{cursor:'pointer'}}/>
                </div>
                :
                <div className="m-1">
                <CIcon icon={cibFacebook}  size="xl"  style={{cursor:'pointer'}}/>
                </div>
                }
              
              {resultdata.instagram?
              <div onClick={instagramlink} className="m-1">
               <CIcon icon={cibInstagram} className="instagram-icon" size="xl" style={{cursor:'pointer'}} />
               </div>
               :
               <div className="m-1">
               <CIcon icon={cibInstagram} size="xl" style={{cursor:'pointer'}} />
               </div>
              }
              {resultdata.tiktok?
                   <div onClick={tiktoklink} className="m-1">         
                <CIcon icon={cibTiktok} size="xl" className="tiktok-icon" style={{cursor:'pointer'}} />
                </div>
                :
                <div  className="m-1">
                <CIcon icon={cibTiktok} size="xl" style={{cursor:'pointer'}} />
                </div>
              }  
              
              {resultdata.youtube?
              <div onClick={youttubelink} className="m-1">
                <CIcon icon={cibYoutube} size="xl" className="youtube-icon" style={{cursor:'pointer'}} />
                </div>
                :
                <div className="m-1">
                <CIcon icon={cibYoutube} size="xl" style={{cursor:'pointer'}} />
                </div>
              }
            </CCardBody>
          </CCol>
        </CCol>
        <CCardTitle className="raitng&reviewprofile">Rating & Review</CCardTitle>
        <CCol xs={12} className="showratingdiv">
          <h4 style={{ fontWeight: 'bold' }}>Average Rating: {AvgReview}</h4>
          <Container>
              {
                AvgReviewTrue?
              [...Array(5)].map((item, index) => {
                const givenRating = index + 1;
                const avgFloor = Math.floor(AvgReview); // Integer part of AvgReview
                const avgDecimal = AvgReview - avgFloor; // Decimal part of AvgReview
                return (
                  <label>
                  <Rating>
                  {givenRating <= avgFloor ? (
                    <FaStar color="#FFA41C" />
                  ) : givenRating === avgFloor + 1 && avgDecimal >= 0.5 ? (
                    <FaStarHalfAlt color="#FFA41C" />
                  ) : (
                    <FaStar color="rgb(192,192,192)" />
                  )}
                 </Rating>
                  </label>
                )
              })
              : <h6>No Rating...</h6>
            }
            </Container>
        </CCol>
        <CCol xs={12} className="showratingdiv">
        {
                Array.isArray(getreviewdata) &&
                getreviewdata.map((items) => {
                  return (
                    <CCard>
                    <CCardBody>
                      <CCol xs={12}>
                        <h4 className="username-rating">{items.client_name}</h4>
                        <CCol xs={3} className="ratingstarprofile">
                       <Container>
              {[...Array(5)].map((item, index) => {
                const givenRating = index + 1
                return (
                  <label>
                    <Rating>
                      <FaStar
                        color={givenRating < items.rating || givenRating === items.rating ? '#FFA41C' : 'rgb(192,192,192)'}
                      />
                    </Rating>
                  </label>
                )
              })}
            </Container>
                        </CCol>
                        <CCol xs={9}>
                          <CCardText className="review-profile">
                            {items.review}
                          </CCardText>
                        </CCol>
                        <CCol xs={3} style={{float: 'right'}}>
                        <CCardText className="review-profile" style={{textAlign:'end'}}>
                          {items.created}
                        </CCardText>
                      </CCol>
                      </CCol>
                    </CCardBody>
                  </CCard>
                  )
                })
              }
        </CCol>
      </CCard>
    </>
  )
}

export default ViewMerchants
