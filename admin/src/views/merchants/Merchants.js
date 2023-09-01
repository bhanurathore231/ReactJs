import React, { useState,useEffect } from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import ReactPaginate from 'react-paginate';
import {ExportToExcel} from './../../components/ExportToExcel'
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
import { Link,useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import { baseUrl } from 'src/baseurl'
const Merchants = () => {
  const [visible, setVisible] = useState(false)
  const [trashvisible, setVisibleTrash] = useState(false)
  const fileName = "Merchant Data";
  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [result, useResult] = useState('')
  const [searchinput, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [pagecount, setPagecount] = useState()
  const [perpage, setPerpage] = useState(10)
  const [itemOffset, setItemOffset] = useState('');
  const [count, setCount] = useState(1)
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const merchant_id = params.get("id");
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
  }, [searchinput,sort,itemOffset,count]);
  const handlePageChange = (event) => {
    const newOffset = (event.selected * 10);
    setItemOffset(newOffset);
  };
  const deleteapi = () => {
    var merchantdata = JSON.stringify({
      id: merchant_id,
    });
    var deletedata = {
      method: "POST",
      headers: myHeaders,
      body: merchantdata
    };
    fetch(
      baseUrl+"/deleteMerchant",deletedata
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          setCount(count+ +"1")
        }
      })
      .catch((error) => console.log("error", error));
      setVisibleTrash(false)

  };
  /* const startDate = dateRange[0].startDate;
  const endDate = dateRange[0].endDate;
  const dateStringstart = startDate;
  const dateObjectstart = new Date(dateStringstart);
  const yearstart = dateObjectstart.getFullYear();
  const monthstart = String(dateObjectstart.getMonth() + 1).padStart(2, "0");
  const daystart = String(dateObjectstart.getDate()).padStart(2, "0");
  const hoursstart = String(dateObjectstart.getHours()).padStart(2, "0");
  const minutesstart = String(dateObjectstart.getMinutes()).padStart(2, "0");
  const secondsstart = String(dateObjectstart.getSeconds()).padStart(2, "0");

  const formattedstartDate = `${yearstart}-${monthstart}-${daystart} ${hoursstart}:${minutesstart}:${secondsstart}`;

  const dateStringend = endDate;
  const dateObjectend = new Date(dateStringend);
  const yearend = dateObjectend.getFullYear();
  const monthend = String(dateObjectend.getMonth() + 1).padStart(2, "0");
  const dayend = String(dateObjectend.getDate()).padStart(2, "0");
  const hoursend = String(dateObjectend.getHours()).padStart(2, "0");
  const minutesend = String(dateObjectend.getMinutes()).padStart(2, "0");
  const secondsend = String(dateObjectend.getSeconds()).padStart(2, "0");

  const formattedendDate = `${yearend}-${monthend}-${dayend} ${hoursend}:${minutesend}:${secondsend}`; */
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
                <option value="">Sort By Name</option>
                <option value="asc">A to Z</option>
                <option value="dsc">Z to A</option>
              </CFormSelect>
              <div style={{ float: 'right' }} className="ms-auto">
          <ExportToExcel apiData={result} fileName={fileName} />
          </div>
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
                Array.isArray(result) &&
                result.map((item) => {
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
                      <div className="p-2">
                      <Link to={`/merchants/EditMerchants?id=${encodeURIComponent(item.id)}`}>
                        <FontAwesomeIcon icon={faEdit} size="2x"/>
                        </Link>
                      </div>
                      <div className="p-2">
                      <Link to={`/merchants/viewmerchants?id=${encodeURIComponent(item.id)}`}>
                              <FontAwesomeIcon icon={faEye} size="2x"/>
                      </Link>
                      </div>
                      <div className="p-2">
                      <Link to={`/merchants?id=${encodeURIComponent(item.id)}`}>
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="2x"
                          onClick={() => setVisibleTrash(!trashvisible)}
                        />
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
        </div>
      </CCard>
      <CModal visible={trashvisible} onClose={() => setVisibleTrash(false)}>
        <CModalBody>Are you sure you want to delete this client?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleTrash(false)}>
            No
          </CButton>
          <CButton color="primary" onClick={deleteapi}>Yes</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Merchants
