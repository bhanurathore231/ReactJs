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
const AverageDiscount = () => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  myHeaders.append("Authorization", "Bearer " + token);
  const [discountlvl1, setDiscountlvl1] = useState("");
  const [discountlvl2, setDiscountlvl2] = useState("");
  const [discountlvl3, setDiscountlvl3] = useState("");
  const [discountlvl4, setDiscountlvl4] = useState("");
  const [discountlvl5, setDiscountlvl5] = useState("");
  const [discountlvl6, setDiscountlvl6] = useState("");
  const [discountlvl7, setDiscountlvl7] = useState("");
  const [discountlvl8, setDiscountlvl8] = useState("");
  const [discountlvl9, setDiscountlvl9] = useState("");
  const [discountlvl10, setDiscountlvl10] = useState("");
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
      fetch(baseUrl + "/getDiscountlevelcount", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setDiscountlvl1(result.disocuntlvl.discountlvl1)
            setDiscountlvl2(result.disocuntlvl.discountlvl2)
            setDiscountlvl3(result.disocuntlvl.discountlvl3)
            setDiscountlvl4(result.disocuntlvl.discountlvl4)
            setDiscountlvl5(result.disocuntlvl.discountlvl5)
            setDiscountlvl6(result.disocuntlvl.discountlvl6)
            setDiscountlvl7(result.disocuntlvl.discountlvl7)
            setDiscountlvl8(result.disocuntlvl.discountlvl8)
            setDiscountlvl9(result.disocuntlvl.discountlvl9)
            setDiscountlvl10(result.disocuntlvl.discountlvl10)
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  }, []);
  const handleUsernameviewclient = (url) => {
    window.location.href = url;
  };
  return (
    <>
      <CCard>
        <div className="data-view container mt-3">
        <CTable align="middle" hover responsive>
          <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell scope="col">Promotion Level</CTableHeaderCell>
                <CTableHeaderCell scope="col">Redemptions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
                    <CTableRow v-for="item in tableItems"  onClick={() => handleUsernameviewclient(`/#/single-average?level=1`)}>
                      <CTableDataCell  style={{ cursor: "pointer" }}>Level 1</CTableDataCell>
                      <CTableDataCell>{discountlvl1}</CTableDataCell>
                    </CTableRow>
                    <CTableRow v-for="item in tableItems"  onClick={() => handleUsernameviewclient(`/#/single-average?level=2`)}>
                      <CTableDataCell  style={{ cursor: "pointer" }}>Level 2</CTableDataCell>
                      <CTableDataCell>{discountlvl2} </CTableDataCell>
                    </CTableRow>
                    <CTableRow v-for="item in tableItems"  onClick={() => handleUsernameviewclient(`/#/single-average?level=3`)}>
                      <CTableDataCell  style={{ cursor: "pointer" }}>Level 3</CTableDataCell>
                      <CTableDataCell> {discountlvl3}</CTableDataCell>
                    </CTableRow>
                    <CTableRow v-for="item in tableItems"  onClick={() => handleUsernameviewclient(`/#/single-average?level=4`)}>
                      <CTableDataCell style={{ cursor: "pointer" }}>Level 4</CTableDataCell>
                      <CTableDataCell>{discountlvl4}</CTableDataCell>
                    </CTableRow>
                    <CTableRow v-for="item in tableItems"  onClick={() => handleUsernameviewclient(`/#/single-average?level=5`)}>
                      <CTableDataCell style={{ cursor: "pointer" }}>Level 5</CTableDataCell>
                      <CTableDataCell> {discountlvl5}</CTableDataCell>
                    </CTableRow>
                    <CTableRow v-for="item in tableItems"  onClick={() => handleUsernameviewclient(`/#/single-average?level=6`)}>
                      <CTableDataCell style={{ cursor: "pointer" }}>Level 6</CTableDataCell>
                      <CTableDataCell>{discountlvl6} </CTableDataCell>
                    </CTableRow>
                    <CTableRow v-for="item in tableItems"  onClick={() => handleUsernameviewclient(`/#/single-average?level=7`)}>
                      <CTableDataCell style={{ cursor: "pointer" }}>Level 7</CTableDataCell>
                      <CTableDataCell>  {discountlvl7}</CTableDataCell>
                    </CTableRow>
                    <CTableRow v-for="item in tableItems"  onClick={() => handleUsernameviewclient(`/#/single-average?level=8`)}>
                      <CTableDataCell style={{ cursor: "pointer" }}>Level 8</CTableDataCell>
                      <CTableDataCell>{discountlvl8} </CTableDataCell>
                    </CTableRow>
                    <CTableRow v-for="item in tableItems"  onClick={() => handleUsernameviewclient(`/#/single-average?level=9`)}>
                      <CTableDataCell style={{ cursor: "pointer" }}>Level 9</CTableDataCell>
                      <CTableDataCell>{discountlvl9}</CTableDataCell>
                    </CTableRow>
                    <CTableRow v-for="item in tableItems"  onClick={() => handleUsernameviewclient(`/#/single-average?level=10`)}>
                      <CTableDataCell style={{ cursor: "pointer" }}>Level 10</CTableDataCell>
                      <CTableDataCell>{discountlvl10}</CTableDataCell>
                    </CTableRow>
            </CTableBody>
          </CTable>
        </div>
      </CCard>
    </>
  );
};

export default AverageDiscount;
