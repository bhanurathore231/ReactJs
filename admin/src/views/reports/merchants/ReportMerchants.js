import React, { useState,useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { baseUrl } from 'src/baseurl'
import {
  CTable,
  CTableHead,
  CTableRow,
  CCard,
  CCol,
  CFormInput,
  CButton,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
const ReportMerchants = () => {
  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [result, useResult] = useState('')
  const [searchinput, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [pagecount, setPagecount] = useState()
  const [perpage, setPerpage] = useState(10)
  const [itemOffset, setItemOffset] = useState('');
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  useEffect(() => {
    const getapi = () => {
      var count = JSON.stringify({
        id: userid,
        search:searchinput,
        sortby:sort,
        offset:itemOffset
      });
      var countOption = {
        method: "POST",
        headers: myHeaders,
        body: count,
      };
      fetch(
        baseUrl+"/getAllMerchant",
        countOption
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            useResult(result.allmerchant.data)
            setPagecount(result.allmerchant.count/10)
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
  return (
    <>
      <CCard>
        <CCol xs={12} className="data-view">
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
                <option value="">Sort By Name</option>
                <option value="asc">A to Z</option>
                <option value="dsc">Z to A</option>
              </CFormSelect>
            </div>
          </CForm>
          <CTable align="middle" hover responsive>
          <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="description-code">
                  Created
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {
                Array.isArray(result) &&
                result.map((item) => {
                  return (
                    <CTableRow>
                      <CTableDataCell>
                        {item.username}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.created}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CCol xs={12} className="d-flex flex-row">
                      <div className="p-2">
                      <Link to={`/viewreportsmerchants?id=${encodeURIComponent(item.id)}`}>
                              <FontAwesomeIcon icon={faEye} size="2x"/>
                      </Link>
                      </div>
                        </CCol>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              }
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
        </CCol>
      </CCard>
    </>
  )
}

export default ReportMerchants
