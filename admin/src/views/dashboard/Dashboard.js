import React, { useState, useEffect } from "react";
import { baseUrl } from "src/baseurl";
import {
  CTableHead,
  CTableRow,
  CCard,
  CTableHeaderCell,
  CTableBody,
  CCol,
  CRow,
  CTable,
  CTableDataCell,
  CAvatar
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
} from "@coreui/icons";
import WidgetsDropdown from '../widgets/WidgetsDropdown'
const Dashboard = () => {
  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [result, setResultClient] = useState("");
  const [resultmerchant, setResultMerchant] = useState("");
  const [resulthistory, setResultHistory] = useState("");
  useEffect(() => {
    const getapi = () => {
      var merchantheader = new Headers();
      merchantheader.append("Authorization", "Bearer " + token);
      merchantheader.append("Content-Type", "application/json");
      merchantheader.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
      var data = JSON.stringify({
        id: userid,
      });
      var merchatoption = {
        method: "POST",
        headers: merchantheader,
        body: data,
      };
      fetch(baseUrl + "/getAllClientAdmin", merchatoption)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResultClient(result.allclient.data);
          }
        })
        .catch((error) => console.log("error", error));

        fetch(baseUrl + "/getAllMerchant", merchatoption)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResultMerchant(result.allmerchant.data);
          }
        })
        .catch((error) => console.log("error", error));
        var merchathistory = {
          method: "POST",
          headers: merchantheader,
          body: data,
        };
        fetch(baseUrl + "/getRedemptionHistoryAdminDashbord", merchathistory)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResultHistory(result.merchant);
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
  const limitedResultMerchant = resultmerchant.slice(0,5);
  return (
    <>
      <WidgetsDropdown />
    </>
  )
}

export default Dashboard
