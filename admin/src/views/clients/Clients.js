import React, { useState,useEffect } from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import ReactPaginate from 'react-paginate';
import { baseUrl } from 'src/baseurl';
import {ExportToExcel} from './../../components/ExportToExcel'
import {
  CTable,
  CFormSelect,
  CTableHead,
  CCard,
  CCol,
  CFormInput,
  CButton,
  CForm,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CModal,
  CModalBody,
  CModalFooter,
  CTableDataCell
} from '@coreui/react'
import { Link,useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faTrash, faFileExport } from '@fortawesome/free-solid-svg-icons'
const Clients = () => {
  const fileName = "Clients Data";
  const [trashvisible, setVisibleTrash] = useState(false)
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("user_id");
  const [resultclient, useResult] = useState('')
  const [searchinput, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [pagecount, setPagecount] = useState()
  const [perpage, setPerpage] = useState(10)
  const [itemOffset, setItemOffset] = useState('');
  const [count, setCount] = useState(1)
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const client_id = params.get("id");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  const deleteapi = () => {
    var clientdata = JSON.stringify({
      id: client_id,
    });
    var deletedata = {
      method: "POST",
      headers: myHeaders,
      body: clientdata
    };
    fetch(
      baseUrl+"/deleteClient",deletedata
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
        body: count
      };
      fetch(
        baseUrl+"/getAllClientAdmin",
        countOption
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            console.log(result);
            useResult(result.allclient.data)
            setPagecount(result.allclient.count/10)
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
              <ExportToExcel apiData={resultclient} fileName={fileName} />
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
                      <div className="p-2">
                      <Link to={`/clients/EditClients?id=${encodeURIComponent(item.id)}`}>
                        <FontAwesomeIcon icon={faEdit} size="2x"/>
                        </Link>
                      </div>
                      <div className="p-2">
                      <Link to={`/clients/ViewClients?id=${encodeURIComponent(item.id)}`}>
                              <FontAwesomeIcon icon={faEye} size="2x"/>
                      </Link>
                      </div>
                      <div className="p-2">
                      <Link to={`/clients?id=${encodeURIComponent(item.id)}`}>
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

export default Clients
