import React, { useState, useEffect } from 'react'
import { baseUrl } from './../../baseurl'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import ReactPaginate from 'react-paginate';
import {
  CTable,
  CPagination,
  CPaginationItem,
  CCard,
  CCol,
  CFormInput,
  CButton,
  CForm,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link } from 'react-router-dom'
const Clients = () => {
  const [visible, setVisible] = useState(false)
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ])

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection])
  }
  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [resultclient, useResult] = useState('')
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
        merchant_id: userid,
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
        baseUrl+"/getClient",
        countOption
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            useResult(result.client.data)
            setPagecount(result.client.count/10)
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
        <div className="data-view container">
          <CForm className="row col-12 pb-3">
            <div className="col-6 d-flex gap-2 mt-3 filter">
              <CFormInput
                type="text"
                size="sm"
                placeholder="Search"
                aria-label="Search"
                className="custom-search-data"
                name="client_search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-6 d-flex gap-2 mt-3 filter">
{/*               <CButton className="choose-but date-filter" size="sm" onClick={() => setVisible(!visible)}>
                Choose Date
              </CButton> */}
              <CFormSelect size="sm" className="mb-3 sort-by" onChange={(e) => setSort(e.target.value)}>
                <option value="">Sort By</option>
                <option value="asc">A to Z</option>
                <option value="dsc">Z to A</option>
              </CFormSelect>
              <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalBody>
                  <DateRangePicker ranges={dateRange} onChange={handleSelect} />
                </CModalBody>

                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Close
                  </CButton>

                  <CButton color="primary">Save changes</CButton>
                </CModalFooter>
              </CModal>
            </div>
          </CForm>
          <CTable align="middle" hover responsive>
          <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="description-code">
                  Created
                </CTableHeaderCell>

                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {
                Array.isArray(resultclient) &&
                resultclient.map((item) => {
                  return (
                    <CTableRow>
                      <CTableDataCell>
                        {item.username}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.email}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.created}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CCol xs={12} className="d-flex flex-row">
                          <Link to={`/clients/ViewClients?id=${encodeURIComponent(item.id)}`}>
                            <div className="p-2">
                              <FontAwesomeIcon icon={faEye} size="2x"/>
                            </div>
                          </Link>
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
        </div>
      </CCard>
    </>
  )
}

export default Clients
