import React, { useState, useEffect } from "react";
import { baseUrl } from "src/baseurl";
import {
  CRow,
  CCol,
  CWidgetStatsA,
} from "@coreui/react";
import { getStyle } from "@coreui/utils";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import { cilArrowBottom, cilArrowTop, cilOptions } from "@coreui/icons";

const WidgetsDropdown = () => {

  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [totalamount, setResult] = useState();
  const [totalmerchant, setTotalMerchant] = useState();
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
const clickpage = () =>{
      window.location = '/#/wallet';
}
  var raw = JSON.stringify({
    id: userid,
  });
  useEffect(() => {
    const getwallethistory = () => {
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      fetch(baseUrl + "/getWalletAmountTotal", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          setResult(result.wallet);
          setTotalMerchant(result.totalmerchant.length);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getwallethistory();
  }, []);
const showtotal=totalamount?totalamount:"0"
  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          onClick={clickpage}
          className="mb-4"
          color="primary"
          style={{cursor:'pointer'}}
          value={
            <>
           
              ${showtotal}
              <span className="fs-6 fw-normal">
              </span>
            </>
          }
          title="Total Amount Spend"
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: "70px" }}
              data={{
                datasets: [
                  {
                    label: "Spend Amount",
                    backgroundColor: "transparent",
                    borderColor: "rgba(255,255,255,.55)",
                    pointBackgroundColor: getStyle("--cui-primary"),
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
    
    </CRow>
  );
};

export default WidgetsDropdown;
