import React, { useState, useEffect } from "react";
import { baseUrl } from "src/baseurl";
import { useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
const WidgetsDropdown = () => {
  const navigate = useNavigate()
  const handleButtonClient = () => {
    navigate('/clients')
  }
  const handleButtonredeemtion = () => {
    navigate('/redemption-history')
  }
  const handleButtonavargediscount = () => {
    navigate('/average-discount')
  }
  const handleButtontotalvisits = () => {
    navigate('/total-visits')
  }
  const userid = localStorage.getItem("user_id");
const token = localStorage.getItem("token");
const [result, setResult] = useState("");
const [discount, setDiscount] = useState("");
const [clientdata, setAllClient] = useState("");
const [data, setdata] = useState("");
const [discountavg, setDiscountAvg] = useState("");
var merchantheader = new Headers();
merchantheader.append("Authorization", "Bearer " + token);
merchantheader.append("Content-Type", "application/json");
merchantheader.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  useEffect(() => {
    const getapi = () => {
      var merchantcount = JSON.stringify({
        merchant_id: userid,
      });
      var totaldiscount = JSON.stringify({
        id: userid,
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
            setAllClient(result.client)
            setResult(result.client.data);
          }
        })
        .catch((error) => console.log("error", error));
  
      var merchantdiscount = {
        method: "POST",
        headers: merchantheader,
        body: totaldiscount,
      };
      fetch(baseUrl + "/getRedemptionHistoryTotal", merchantdiscount)
        .then((response) => response.json())
        .then((discount) => {
          if (discount.status) {
          
            setDiscount(discount);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
    const getTotalVisits = () => {
      var merchantheader = new Headers();
      merchantheader.append("Authorization", "Bearer " + token);
      merchantheader.append("Content-Type", "application/json");
      merchantheader.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
      var rawtoalvisits = JSON.stringify({
        id: userid,
      });
      var requestOptions = {
        method: "POST",
        headers: merchantheader,
        body: rawtoalvisits
      };
      fetch(baseUrl + "/getTotalVisits", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setdata(result.data.length)
          }
        })
        .catch((error) => console.log("error", error));
    };
    getTotalVisits();
    const getTotalDiscountAvg = () => {
      var discountmerchant = JSON.stringify({
        id: userid,
      });
      var requestOptions = {
        method: "POST",
        headers: merchantheader,
        body: discountmerchant
      };
      fetch(baseUrl + "/getDiscountAvarge", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setDiscountAvg(result.disocunt)
          }
        })
        .catch((error) => console.log("error", error));
    };
    getTotalDiscountAvg();
  }, []);
  const totaldiscountshow=discount.totaldiscount?discount.totaldiscount:"0"
  const clientscount=clientdata.count?clientdata.count:"0"
  const datacount=data?data:"0"
  const avg=discountavg?discountavg:"0"
  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={"$"+totaldiscountshow}
          title="Total Redemptions"
          onClick={handleButtonredeemtion}
          style={{cursor:'pointer'}}
          /*           action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          } */
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
             /*  data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    label: 'Redemptions',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }} */
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
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="info"
          value={clientscount}
          title="Clients"
          onClick={handleButtonClient}
          style={{cursor:'pointer'}}

          /*           action={ 
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          } */
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
             /*  data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: [1, 18, 9, 17, 34, 22, 11],
                  },
                ],
              }} */
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
                    min: -9,
                    max: 39,
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
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={avg+"%"}
          title="Average Discount"
          onClick={handleButtonavargediscount}
          style={{cursor:'pointer'}}

          /*  action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          } */
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
/*               data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
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
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }} */
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="danger"
          value={datacount}
          title="Total Visits"
          onClick={handleButtontotalvisits}
          style={{cursor:'pointer'}}

          /*           action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          } */
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
/*               data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                  'January',
                  'February',
                  'March',
                  'April',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                    barPercentage: 0.6,
                  },
                ],
              }} */
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
