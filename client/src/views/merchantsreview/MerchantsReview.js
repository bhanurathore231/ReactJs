import React, { useState, useEffect } from "react";
import CIcon from "@coreui/icons-react";
import { cilArrowCircleLeft,cilSearch } from "@coreui/icons";
import {
  CTable,
  CButton,
  CCard,
  CCol,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CFormInput
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "src/baseurl";
const Clients = () => {
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
    client_id: userid,
    checkstatus:userid,
    search: searchinput,
  });
  useEffect(() => {
    const getapi = () => {
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      fetch(baseUrl + "/getmerchantReview", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResult(result.review);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  }, [searchinput]);
  return (
    <>
      <div className="maindiv-heading">
        <CIcon
          icon={cilArrowCircleLeft}
          size="xxl"
          onClick={handleButtonClickBack}
          style={{ cursor: "pointer" }}
        />
        <h4 className="headcustom">Reviews</h4>
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
        <CCol xs={12} className="marchantsreviewlist">
          <CTable borderless>
            <CTableBody>
              {Array.isArray(result) &&
                result.map((item) => {
                  return (
                    <CTableRow className="table-data-div">
                      <CTableDataCell className="merchants-name-table">
                        <Link className="merchantslinks" to="/dashboard">
                          {item.username}
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell className="merchants-discription-table">
                       {
                        item.reviewstatus==1?
                      <Link to={`/merchantsreview/merchantsview?id=${encodeURIComponent(item.merchant_id)}`}>
                      <CButton
                    className="custom-button-reviewclass"
                    color="primary"
                    size="sm"
                  >
                    View Review
                  </CButton>
                    </Link>
                    : 
                    <Link to={`/merchantsreview/leavereview?id=${encodeURIComponent(item.merchant_id)}`}>
                    <CButton
                  className="custom-button-reviewclass"
                  color="primary"
                  size="sm"
                >
                  Leave Review
                </CButton>
                  </Link>
                       }
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
            </CTableBody>
          </CTable>
        </CCol>
      </CCard>
    </>
  );
};

export default Clients;
