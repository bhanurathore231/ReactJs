import React, { useState, useEffect } from "react";
import Reactimg from "./../../assets/images/Logo.png";
import CIcon from "@coreui/icons-react";
import { cilArrowCircleLeft } from "@coreui/icons";
import { baseUrl } from "src/baseurl";
import {
  CCard,
  CCol,
  CCardImage,
  CButton,
} from "@coreui/react";
import { useNavigate, Link, useLocation } from "react-router-dom";
const AfterQrCode = () => {
  const navigate = useNavigate();
  const handleButtonClickBack = () => {
    navigate(-1);
  };
  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const merchantId = params.get('merchantid');
  const [resultdata, setResult] = useState("");
  var promotionheader = new Headers();
  promotionheader.append("Authorization", "Bearer " + token);
  promotionheader.append("Content-Type", "application/json");
  promotionheader.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  var promotioncount = JSON.stringify({
    id: merchantId,
    clientid:userid
  });
  useEffect(() => {
    const getapi = () => {
      var countOption = {
        method: "POST",
        headers: promotionheader,
        body: promotioncount
      };
      fetch(
        baseUrl+"/getPromotionAfterqrcode",
        countOption
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResult(result.promotion);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  }, []);
  return (
    <>
      <CIcon
        icon={cilArrowCircleLeft}
        size="xxl"
        onClick={handleButtonClickBack}
      />
              {Array.isArray(resultdata) &&
                resultdata.map((item) => {
                  const DiscountLevel =
                   item.discountlevel === 2
                  ? item.level2
                  : item.discountlevel === 3
                  ? item.level3
                  : item.discountlevel === 4
                  ? item.level4
                  : item.discountlevel === 5
                  ? item.level5
                  : item.discountlevel === 6
                  ? item.level6
                  : item.discountlevel === 7
                  ? item.level7
                  : item.discountlevel === 8
                  ? item.level8
                  : item.discountlevel === 9
                  ? item.level9
                  : item.discountlevel === 10
                  ? item.level10
                  : item.level1;
                  return (
                    <CCard className="p-3" style={{ width: "100%" }}>
                      <CCol xs={12} style={{ display: "flex" }}>
                      <CCol xs={4}>
                      <CCardImage orientation="top" src={item.logo} />
                      </CCol>
                      <CCol xs={4}>
                        <Link className="merchantslinks" to="javascript:void(0);">
                        {item.promotion_name}
                        </Link><br/>
                        {item.discription}
                        </CCol>
                        <CCol xs={4}>
                        Discount: {DiscountLevel}%<br/>
                        <Link to={`/afterqrcode/Paymentpin?id=${encodeURIComponent(item.id)}&merchant_id=${encodeURIComponent(merchantId)}&discount=${encodeURIComponent(DiscountLevel)}&discountlevel=${encodeURIComponent(item.discountlevel?item.discountlevel:"1")}`}>
                        <CButton color="primary" className="m-3">
                          Redeem
                        </CButton>
                        </Link>
                        </CCol>
                        </CCol>
                    </CCard>
                  );
                })}
    </>
  );
};

export default AfterQrCode;
