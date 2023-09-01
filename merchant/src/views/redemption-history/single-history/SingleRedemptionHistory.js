import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { useNavigate,useLocation, Link } from "react-router-dom";
import { baseUrl } from "src/baseurl";
import ReactPaginate from 'react-paginate';
import {
  CTable,
  CCard,
  CFormInput,
  CButton,
  CForm,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
} from "@coreui/react";
const RedemptionHistorySingle = () => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  myHeaders.append("Authorization", "Bearer " + token);
  const [resultdata, setResult] = useState("");
  const [searchinput, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [sortbydiscount, setSortByDiscount] = useState('')
  const [pagecount, setPagecount] = useState()
  const [perpage, setPerpage] = useState(10)
  const [itemOffset, setItemOffset] = useState('');
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const branch_pin = params.get("branch_pin");
  var raw = JSON.stringify({
    branch_pin: branch_pin,
    search:searchinput,
    sortby:sort,
    sortbydiscount:sortbydiscount,
    offset:itemOffset
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  useEffect(() => {
    const getapi = () => {
      fetch(baseUrl + "/getRedemptionSingleHistory", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResult(result.merchant.data);
            setPagecount(result.merchant.count/10)
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  }, [searchinput,sort,sortbydiscount,itemOffset]);
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const [visible, setVisible] = useState(false);
    const handlePageChange = (event) => {
      const newOffset = (event.selected * 10);
      setItemOffset(newOffset);
    };
    const handleUsernameviewclient = (url) => {
      window.location.href = url;
    };
  return (
    <>
      <CCard>
        <div className="data-view container">
          <CForm className="row col-12">
            <div className="col-6 d-flex gap-2 mt-3 filter">
              <CFormInput
                type="text"
                size="sm"
                placeholder="Search"
                aria-label="Search"
                className="custom-search-data"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-6 d-flex gap-2 mt-3 filter">
              {/* <CButton
                className="choose-but date-filter"
                size="sm"
                onClick={() => setVisible(!visible)}
              >
                Choose Date
              </CButton> */}
              <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalBody className="showed-rice">
                  <DateRangePicker ranges={dateRange} onChange={handleSelect} />
                </CModalBody>

                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Close
                  </CButton>
                  <CButton color="primary">Save changes</CButton>
                </CModalFooter>
              </CModal>
              <CFormSelect size="sm" className="mb-3 sort-by" onChange={(e) => setSort(e.target.value)}>
                <option value="">Sort By Date</option>
                <option value="asc">Oldest</option>
                 <option value="desc">Newest</option>
              </CFormSelect>
              <CFormSelect size="sm" className="mb-3 sort-by" onChange={(e) => setSortByDiscount(e.target.value)}>
                <option value="">Discount</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </CFormSelect>
            </div>
          </CForm>
          <CTable align="middle" hover responsive>
          <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                <CTableHeaderCell scope="col">Client</CTableHeaderCell>
                <CTableHeaderCell scope="col">Promotions</CTableHeaderCell>
                <CTableHeaderCell scope="col">Branch Pin</CTableHeaderCell>
                <CTableHeaderCell scope="col">Spend</CTableHeaderCell>
                <CTableHeaderCell scope="col">Discount</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Array.isArray(resultdata) &&
                resultdata.map((item) => {
                  return (
                    <CTableRow>
                      <CTableDataCell>{item.created}</CTableDataCell>
                      <CTableDataCell>  
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleUsernameviewclient(
                            `/#/clients/ViewClients?id=${encodeURIComponent(item.client_id)}`
                          )
                        }
                      >
                        {item.client_name}
                      </div>
                      </CTableDataCell>
                      <CTableDataCell>{item.promotion_name}</CTableDataCell>
                      <CTableDataCell>{item.branch_pin}</CTableDataCell>
                      <CTableDataCell>${item.amount}</CTableDataCell>
                      <CTableDataCell>${item.discount}</CTableDataCell>
                    </CTableRow>
                  );
                })}
            </CTableBody>
          </CTable>
          <ReactPaginate
                  previousLabel="Previous"
                  nextLabel="Next"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  pageCount={pagecount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={perpage}
                  onPageChange={handlePageChange}
                  containerClassName="pagination"
                  activeClassName="active"
      />
        </div>
      </CCard>
    </>
  );
};

export default RedemptionHistorySingle;
