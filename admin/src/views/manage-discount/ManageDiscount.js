import React,{ useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { baseUrl } from 'src/baseurl'
import { useNavigate, Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate';
import {ExportToExcel} from './../../components/ExportToExcel'
import {
  CTable,
  CForm,
  CFormSelect,
  CCard,
  CCol,
  CFormInput,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
const ManageDiscount = () => {
  const navigate = useNavigate()
  const handleButtonClick = () => {
    navigate('ViewManageDiscount')
  }
  const token = localStorage.getItem('token')
  const[resultpromotion,setResult]= useState("");
  const fileName = "Promotion Data";
  const [searchinput, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [pagecount, setPagecount] = useState() 
  const [perpage, setPerpage] = useState(10)
  const [itemOffset, setItemOffset] = useState('');
  const userid = localStorage.getItem("user_id");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");

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
        baseUrl+"/getPromotionAdmin",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResult(result.promotion.data);
            setPagecount(result.promotion.count/10)
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
              name="search"
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
          <ExportToExcel apiData={resultpromotion} fileName={fileName} />
          </div>
          </div>
          </CForm>
          <CTable align="middle" hover responsive>
          <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell scope="col">Promotions</CTableHeaderCell>
                <CTableHeaderCell scope="col">Discription</CTableHeaderCell>
                <CTableHeaderCell scope="col">Merchants</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
            {
                Array.isArray(resultpromotion) &&
                resultpromotion.map((item) => {
                  return(
                    <CTableRow>
                <CTableDataCell>{item.promotion_name}</CTableDataCell>

                <CTableDataCell>
                {item.discription}
                </CTableDataCell>
                <CTableDataCell>
                {item.username}
                </CTableDataCell>
                <CTableDataCell>
                  <div className="p-2">
                    <Link to={`/manage-discount/ViewManageDiscount?id=${encodeURIComponent(item.id)}`}>
                    <FontAwesomeIcon icon={faEdit} size="2x" />
                    </Link>
                  </div>
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

export default ManageDiscount
