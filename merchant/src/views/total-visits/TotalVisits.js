import React, { useState, useEffect } from "react";
import { baseUrl } from "src/baseurl";
import {
  CTable,
  CCard,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
} from "@coreui/react";
const TotalVisits = () => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  myHeaders.append("Authorization", "Bearer " + token);
  const [resultdata, setBranchpin] = useState("");
  var raw = JSON.stringify({
    id: user_id,
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  useEffect(() => {
    const getapi = () => {
      fetch(baseUrl + "/getRedemptionHistory", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setBranchpin(result.merchant.data)
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  }, []);
  return (
    <>
      <CCard>
        <div className="data-view container mt-3">
        <CTable align="middle" hover responsive>
          <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell scope="col">Branch Pin</CTableHeaderCell>
                <CTableHeaderCell scope="col">Visits</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
            {Array.isArray(resultdata) &&
              resultdata.map((item) => {
                  return (
                    <CTableRow v-for="item in tableItems">
                      <CTableDataCell>
                        {item.branch_pin}
                      </CTableDataCell>
                      <CTableDataCell>{item.branchpincount}</CTableDataCell>
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

export default TotalVisits;
