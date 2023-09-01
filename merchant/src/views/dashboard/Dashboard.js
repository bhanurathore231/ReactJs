import React, { useState, useEffect } from "react";

import { baseUrl } from "src/baseurl";
import {
  CAvatar,
  CCard,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cilPeople,
} from "@coreui/icons";

import WidgetsDropdown from "../widgets/WidgetsDropdown";

const Dashboard = () => {

  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [result, setResult] = useState("");
  const [resulthistory, setResultHistory] = useState("");
  useEffect(() => {
    const getapi = () => {
      var merchantheader = new Headers();
      merchantheader.append("Authorization", "Bearer " + token);
      merchantheader.append("Content-Type", "application/json");
      merchantheader.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
      var merchantcount = JSON.stringify({
        merchant_id: userid,
      });
      var merchatoption = {
        method: "POST",
        headers: merchantheader,
        body: merchantcount,
      };
      fetch(baseUrl + "/getClient", merchatoption)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResult(result.client.data);
          }
        })
        .catch((error) => console.log("error", error));
        var data = JSON.stringify({
          id: userid,
        });
        var merchathistory = {
          method: "POST",
          headers: merchantheader,
          body: data,
        };
        fetch(baseUrl + "/getRedemptionHistory", merchathistory)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResultHistory(result.merchant.data);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  }, []);
  const handleUsernameviewclient = (url) => {
    window.location.href = url;
  };
  const limitedResult = result.slice(0,5);
  return (
    <>
      <WidgetsDropdown />
      <CRow className="mb-3">
        <CCol xs>
          <CCard>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                    Branch Pin
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Discription</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Redemptions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {Array.isArray(resulthistory) &&
                  resulthistory.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index} onClick={() => handleUsernameviewclient(`/#/single-history?branch_pin=${encodeURIComponent(item.branch_pin)}`)}>
                      <CTableDataCell className="text-center" style={{cursor:'pointer'}}>
                        {item.branch_pin}
                      </CTableDataCell>
                      <CTableDataCell className="text-center" style={{cursor:'pointer'}}>
                        <div>{item.branchpindiscription}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center" style={{cursor:'pointer'}}>
                            <strong>{item.branchpincount}</strong>
                      </CTableDataCell>
                      
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Clients</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {Array.isArray(limitedResult) &&
                  limitedResult.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}  style={{cursor:'pointer'}} onClick={() => handleUsernameviewclient(`/#/clients/ViewClients?id=${encodeURIComponent(item.id)}`)}>
                      <CTableDataCell className="text-center">
                        <CAvatar
                          size="md"
                          src={item.profilepic}
                          status=""
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.username}</div>
                        <div className="small text-medium-emphasis">
                          <span>New</span> |
                          Registered: {item.created}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>{item.email}</strong>
                          </div>
                        </div>
                      </CTableDataCell>
                      
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
