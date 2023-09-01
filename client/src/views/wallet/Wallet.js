import React, { useEffect, useState } from "react";
import {
  CRow,
  CCol,
  CWidgetStatsE,
  CTable,
  CCard,
  CModal,
  CModalHeader,
  CFormCheck,
  CModalBody,
  CModalFooter,
  CButton,
  CFormSelect,
  CTableHead,
  CTableRow,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";
import {
  cilWallet,
  cilFilter,
  cilSwapVertical,
  cilArrowCircleLeft,
} from "@coreui/icons";
import { baseUrl } from "src/baseurl";
const Wallet = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate(-1);
  };

  const [visible, setVisible] = useState(false);
  const [filtervisible, setfilterVisible] = useState(false);
  const [sortby, setSortby] = useState();
  const [filtermerchants, setFilterMerchants] = useState();
  const [result, setResult] = useState("");
  const [nameresult, setNameResult] = useState("");
  const [resulthistory, setResultHistory] = useState("");
  const user = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const currenysymbol = "$";
  const merchantnameButtonClick = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");

    var rawmerchant = JSON.stringify({
      client_id: user,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: rawmerchant,
    };
    fetch(baseUrl + "/getMerchant", requestOptions)
      .then((response) => response.json())
      .then((nameresult) => {
        if (nameresult.status) {
          setNameResult(nameresult.merchant);
        }
      })
      .catch((error) => console.log("error", error));
    setfilterVisible(!filtervisible);
  };

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");

  var raw = JSON.stringify({
    id: user,
  });
  const getapi = () => {
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch(baseUrl + "/getWallet", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          setResult(result.wallet[0]);
        }
      })
      .catch((error) => console.log("error", error));
  };
  useEffect(() => {
    getapi();
    const getwallethistory = () => {
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      fetch(baseUrl + "/getWalletHistory", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResultHistory(result.wallet);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getwallethistory();
  }, []);
const MerchantNameSort=()=>{
  var data = JSON.stringify({
    id: user,
    sortby:sortby
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: data
  };
  fetch(baseUrl + "/getWalletHistory", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.status) {
        setResultHistory(result.wallet);
      }
    })
    .catch((error) => console.log("error", error));
    setVisible(false)
}
const MerchantNameFilter=()=>{
  var filterdata = JSON.stringify({
    id: user,
    merchant_name:filtermerchants
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: filterdata
  };
  fetch(baseUrl + "/getWalletHistory", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.status) {
        setResultHistory(result.wallet);
      }
    })
    .catch((error) => console.log("error", error));
    setfilterVisible(false)
}
  return (
    <>
      <div className="customdiv-class">
        <div className="common-customdiv-class">
          <CIcon
            icon={cilArrowCircleLeft}
            size="xxl"
            onClick={handleButtonClick}
            style={{cursor:'pointer'}}
          />
        </div>
       
      </div>
      <CCard>
        <CRow>
          <CCol xs={12}>
            <CWidgetStatsE
              className="mb-3 walletview"
              icon={<CIcon icon={cilWallet} size="xl" />}
              title="Wallet Balance"
              value={currenysymbol + result.balance}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={6}>
            <h3 className="wallet-heading">Wallet History</h3>
          </CCol>
          <CCol xs={6}>
            <div className="filter-div-wallet">
              <CIcon
                id="show-filter-option"
                icon={cilFilter}
                size="xl"
                onClick={merchantnameButtonClick}
                style={{cursor:'pointer'}}
              />
            </div>
            <div className="sort-div-wallet">
              <CIcon
                id="show-sort-option"
                icon={cilSwapVertical}
                size="xl"
                onClick={()=>setVisible(!visible)}
                style={{cursor:'pointer'}}
              />
            </div>
          </CCol>
        </CRow>
        <div className="wallettranctiontable">
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Merchant</CTableHeaderCell>
                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="description-code">
                  Date and Time
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {Array.isArray(resulthistory) &&
                resulthistory.map((item) => {
                  return (
                    <CTableRow>
                      <CTableDataCell>{item.merchant_name}</CTableDataCell>
                      <CTableDataCell>${item.amount}</CTableDataCell>
                      <CTableDataCell>${item.wallet_balance}</CTableDataCell>
                      <CTableDataCell>{item.created}</CTableDataCell>
                    </CTableRow>
                  );
                })}
            </CTableBody>
          </CTable>
        </div>
      </CCard>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}></CModalHeader>

        <CModalBody>
          <CFormSelect
            onChange={(e) => setSortby(e.target.value)}
            size="sm"
            className="mb-3"
          >
            <option>Sort By</option>
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
            <option value="">All</option>
          </CFormSelect>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={MerchantNameSort}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal visible={filtervisible} onClose={() => setfilterVisible(false)}>
        <CModalHeader onClose={() => setfilterVisible(false)}></CModalHeader>
        <CModalBody>
          <CCol xs={12}>
            <label htmlFor="mercent-select">Mercent Name</label>
            <CFormSelect
              size="sm"
              className="mb-3"
              aria-label="Choose Mercent Name"
              onChange={(e) => setFilterMerchants(e.target.value)}
            >
              <option>Choose Mercent Name</option>
              {Array.isArray(nameresult) &&
                nameresult.map((item) => {
                  return <option value={item.username}>{item.username}</option>;
                })}
            </CFormSelect>
          </CCol>
          <CCol xs={12}>
            <label htmlFor="date-range">Date</label>
            <CFormCheck
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              label="Last 3 Months"
            />
            <CFormCheck
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              label="Last 6 Months"
            />
            <CFormCheck
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              label="Last 12 Months"
            />
            
          </CCol>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={MerchantNameFilter}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Wallet;
