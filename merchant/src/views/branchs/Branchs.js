import React,{ useState, useEffect } from 'react'
import { baseUrl } from 'src/baseurl'
import {
  CTable,
  CCol,
  CCard,
  CFormInput,
  CButton,
  CTableRow,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CCardImage,
} from '@coreui/react'
import { Link,useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit,faTrash,faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import ReactPaginate from 'react-paginate';
const Branchs = () => {
  const token = localStorage.getItem('token')
  const[result,setResult]= useState("");
  const [searchinput, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [pagecount, setPagecount] = useState()
  const [perpage, setPerpage] = useState(10)
  const [itemOffset, setItemOffset] = useState('');
  const [trashvisible, setVisibleTrash] = useState(false)
  const [count, setCount] = useState(1)
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const branchpin = params.get("id");
  const userid = localStorage.getItem("user_id");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  const deleteapi = () => {
    var data = JSON.stringify({
      id: branchpin,
    });
    var deletedata = {
      method: "POST",
      headers: myHeaders,
      body: data
    };
    fetch(
      baseUrl+"/deleteBranch",deletedata
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
  var raw = JSON.stringify({
    id: userid,
    search:searchinput,
    sortby:sort,
    offset:itemOffset
  });
  useEffect(() => {
    const getapi = () => {
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw
      };
      fetch(
        baseUrl+"/getBranchpin",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResult(result.branch.data);
            setPagecount(result.branch.count/10)
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();
  },[searchinput,sort,itemOffset,count]);
  const handlePageChange = (event) => {
    const newOffset = (event.selected * 10);
    setItemOffset(newOffset);
  };
  return (
    <>
      <CCard>
        <CCol xs={12} className="p-3">
        <CForm className="row col-12">
            <div className="col-6 d-flex gap-2 filter">
            <CFormInput
              type="text"
              size="sm"
              placeholder="Search"
              aria-label="Search"
              className="custom-search-data"
              name="search"
              onChange={(e) => setSearch(e.target.value)}
            />
            </div>
            <div className="col-6 d-flex gap-2 filter">
            <CFormSelect size="sm" className="mb-3 sort-by" onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort By Date</option>
            <option value="asc">Oldest</option>
            <option value="dsc">Newest</option>
            </CFormSelect>
            <div style={{ float: 'right' }}>
            <Link to="/addbranchpin">
            <FontAwesomeIcon icon={faSquarePlus} size="2x" onClick={() => setVisibleTrash(!trashvisible)}/>
            </Link>
            </div>
          </div>
          </CForm>
          <CTable align="middle" hover responsive>
          <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell scope="col">Branch Pin</CTableHeaderCell>

                <CTableHeaderCell scope="col" className="description-code">
                  Description
                </CTableHeaderCell>

                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {
                Array.isArray(result) &&
                result.map((item) => {
                  return(
                    <CTableRow>
                <CTableDataCell>
                {item.branchpin}
                </CTableDataCell>
                <CTableDataCell>
                {item.discription}
                </CTableDataCell>

                <CTableDataCell>
                <CCol xs={12} className="d-flex flex-row">
                  <div className="p-2">
                    <Link to={`/editbranchpin?id=${encodeURIComponent(item.id)}`}>
                    <FontAwesomeIcon icon={faEdit} size="2x" />
                    </Link>
                  </div>
                  <div className="p-2">
                    <Link to={`/branchs?id=${encodeURIComponent(item.id)}`}>
                    <FontAwesomeIcon icon={faTrash} size="2x" onClick={() => setVisibleTrash(!trashvisible)}/>
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
      <CModal visible={trashvisible} onClose={() => setVisibleTrash(false)}>
        <CModalBody>Are you sure you want to delete this Promotion?</CModalBody>
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

export default Branchs
