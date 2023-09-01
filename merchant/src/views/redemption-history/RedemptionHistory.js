import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "./../../baseurl";
import ReactPaginate from 'react-paginate';
import {
  CTable,
  CCard,
  CFormInput,
  CForm,
  CFormSelect,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
} from "@coreui/react";
const RedemptionHistory = () => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  myHeaders.append("Authorization", "Bearer " + token);
  const [resultdata, setResult] = useState("");
  const [searchinput, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [pagecount, setPagecount] = useState()
  const [perpage, setPerpage] = useState(10)
  const [itemOffset, setItemOffset] = useState('');
  var raw = JSON.stringify({
    id: user_id,
    search:searchinput,
    sortby:sort,
    offset:itemOffset
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
            setResult(result.merchant.data);
            setPagecount(result.merchant.count/10)
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  }, [searchinput,sort,itemOffset]);

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
              <CFormSelect size="sm" className="mb-3 sort-by" onChange={(e) => setSort(e.target.value)}>
                <option value="">Sort By Date</option>
                <option value="asc">Oldest</option>
                 <option value="dsc">Newest</option>
              </CFormSelect>
            </div>
          </CForm>
          <CTable align="middle" hover responsive>
          <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell scope="col">Branch Pin</CTableHeaderCell>
                <CTableHeaderCell scope="col">Discription</CTableHeaderCell>
                <CTableHeaderCell scope="col">Redemptions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Array.isArray(resultdata) &&
              resultdata.map((item) => {
                  return (
                    <CTableRow v-for="item in tableItems"  onClick={() => handleUsernameviewclient(`/#/single-history?branch_pin=${encodeURIComponent(item.branch_pin)}`)}>
                      <CTableDataCell style={{cursor:'pointer'}}>
                        {item.branch_pin}
                      </CTableDataCell>
                      <CTableDataCell>{item.branchpindiscription}</CTableDataCell>
                      <CTableDataCell>{item.branchpincount}</CTableDataCell>
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

export default RedemptionHistory;
