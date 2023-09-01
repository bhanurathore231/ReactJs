import React, { useEffect, useState } from "react";
import {
  CCard,
  CPaginationItem,
  CPagination,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CFormInput,
  CTableHead,
  CTableHeaderCell,
  CButton,
  CCardImage,
} from "@coreui/react";
import { useNavigate, Link } from "react-router-dom";

import CIcon from "@coreui/icons-react";
import { cilArrowCircleLeft, cilSearch } from "@coreui/icons";
import { baseUrl } from "src/baseurl";
const MerchantsPromotion = () => {
  const navigate = useNavigate();
  const handleButtonClickBack = () => {
    navigate(-1);
  };

  const [searchinput, setSearch] = useState("");
  const [SearchBox, setSearchBox] = useState(false);
  const [result, setResult] = useState("");
  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  const ClickOpenSearchBox = () => {
    setSearchBox((prevState) => !prevState);
  };
  var raw = JSON.stringify({
    id: userid,
    search: searchinput,
  });
  useEffect(() => {
    const getapi = () => {
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      fetch(baseUrl + "/getPromotion", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            console.log(result);
            setResult(result.promotion);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  }, [searchinput]);

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
        <h4 className="headcustom">MerchantsPromotion</h4>
        <div className="itmecionss">
          <CIcon icon={cilSearch} size="xxl" onClick={ClickOpenSearchBox}  style={{cursor:'pointer'}}/>
        </div>
      </div>
      {SearchBox && (
        <div className="col-12 mt-3 mb-3">
          <div className="custom-classs">
            <CFormInput
              type="text"
              size="sm"
              placeholder="Search"
              aria-label="Search"
              className="custom-search-data-custom"
              name="client_search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}
      <CCard>
        <div className="col-12 marchantspromotion">
          <CTable borderless>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" className="offerclass">
                  Offer
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Discription</CTableHeaderCell>
                <CTableHeaderCell scope="col">Discount</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Array.isArray(result) &&
                result.map((item) => {
                  const tierVariable =
                  item.promotionlevel === 1
                  ? `Tier 2\n${item.level2}`+"%"
                  : item.promotionlevel === 2
                  ? `Tier 3\n${item.level3}`+"%"
                  : item.promotionlevel === 3
                  ? `Tier 4\n${item.level4}`+"%"
                  : item.promotionlevel === 4
                  ? `Tier 5\n${item.level5}`+"%"
                  : item.promotionlevel === 5
                  ? `Tier 6\n${item.level6}`+"%"
                  : item.promotionlevel === 6
                  ? `Tier 7\n${item.level7}`+"%"
                  : item.promotionlevel === 7
                  ? `Tier 8\n${item.level8}`+"%"
                  : item.promotionlevel === 8
                  ? `Tier 9\n${item.level9}`+"%"
                  : item.promotionlevel === 9
                  ? `Tier 10\n${item.level10}`+"%"
                  : item.promotionlevel === 10
                  ? `Tier 10\n${item.level10}`+"%"
                  : "N/A";
                  return (
                    <CTableRow className="table-data-div-cus" key={item.id}>
                      <CTableDataCell className="merchants-name-table">
                        <Link className="merchantslinks" to="javascript:void(0);">
                          {item.promotion_name}<br/>
                        </Link>
                        <CCardImage
                          orientation="top"
                          className="Promotion-img"
                          src={item.logo}
                        />
                          <CButton className="cbuttonclass" ><Link to={`/merchantprofile?&merchantid=${encodeURIComponent(item.merchant_id)}`} style={{textDecoration: 'none',color:'white'}}>FIND OUT MORE &#9654;</Link></CButton>
                      </CTableDataCell>
                      <CTableDataCell className="merchants-discription-table">
                        {item.discription}
                      </CTableDataCell>
                      <CTableDataCell className="merchants-discount-table">
                        {tierVariable} 
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
            </CTableBody>
          </CTable>
        </div>
      </CCard>
    </>
  );
};

export default MerchantsPromotion;
