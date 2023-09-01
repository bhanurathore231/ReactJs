import React, { useState, useEffect} from 'react'
import CIcon from '@coreui/icons-react'
import { cibFacebook, cibInstagram, cibTiktok, cibYoutube } from '@coreui/icons'
import { useNavigate,useLocation } from 'react-router-dom'
import { baseUrl } from 'src/baseurl'
import { Container, Radio, Rating } from './RatingStyles'
import { FaStar } from 'react-icons/fa'
import {
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CListGroup,
  CListGroupItem,
  CCardLink,
  CCol,
  CButton,
} from '@coreui/react'
const ViewMerchants = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const merchant_id = params.get("id");
  const [resultdata,setResult]=useState('');
  const [getreviewdata,setGetreviewdata]=useState('');
  const [promotioncount,setPromotionCount]=useState('');
  const [clientscount,setClientsCount]=useState('');
  const handleButtonViewClick = () => {
    navigate(`/merchants/allpromotions?id=${encodeURIComponent(merchant_id)}`)
  }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer "+token);
  var raw = JSON.stringify({
    "id": merchant_id,
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw
  };
  useEffect(() => {
    const getapi=()=>{
      fetch(baseUrl+"/getMerchant", requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status) {
            setResult(result.merchant[0]);
          }
        })
        .catch(error => console.log('error', error));
    }
      getapi();
      const getreview=()=>{
        fetch(baseUrl+"/getmerchantReview", requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status) {
            setGetreviewdata(result.review);
          }
        })
        .catch(error => console.log('error', error));
      }
      getreview();
      const getpromotion=()=>{
        fetch(baseUrl+"/getPromotionMerchant", requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status) {
            setPromotionCount(result.promotion.count);
          }
        })
        .catch(error => console.log('error', error));
      }
      getpromotion();
      var merchantid = JSON.stringify({
        "merchant_id": merchant_id,
      });
      var Getclients = {
        method: 'POST',
        headers: myHeaders,
        body: merchantid
      };
      const getClients=()=>{
        fetch(baseUrl+"/getClient", Getclients)
        .then(response => response.json())
        .then(result => {
          if(result.status) {
            setClientsCount(result.client.count);
          }
        })
        .catch(error => console.log('error', error));
      }
      getClients();
    },[])
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
              <CCardText>
              <strong>{resultdata.about}</strong>
              </CCardText>
            </CCardBody>
            <CListGroup flush>
              <CListGroupItem className="group-item-profile-page">
                All Promotions:
                <h4 className="all-promo-profile-page">
                <strong>{promotioncount ? promotioncount : 0}</strong>
                  <div className="ml-3 mt-3">
                    <CButton
                      color="primary"
                      size="sm"
                      id="merchant-profile-all-promotions"
                      onClick={handleButtonViewClick}
                    >
                      All Promotions
                    </CButton>
                  </div>
                </h4>
              </CListGroupItem>
              <CListGroupItem className="group-item-profile-page">
                Clients:<h4><strong>{clientscount ? clientscount: 0}</strong></h4>
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
        {
                Array.isArray(getreviewdata) &&
                getreviewdata.map((items) => {
                  return (
                    <CCard>
                    <CCardBody>
                      <CCol xs={12}>
                        <h3 className="username-rating">{items.client_name}</h3>
                        <CCol xs={3} className="ratingstarprofile">
                       <Container>
              {[...Array(5)].map((item, index) => {
                const givenRating = index + 1
                return (
                  <label>
                    <Radio
                      type="radio"
                      value={givenRating}
                    />
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
