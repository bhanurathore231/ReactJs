import React,{ useState, useEffect } from 'react'
import { baseUrl } from 'src/baseurl'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
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
  CCardImage,
} from '@coreui/react'
import { useNavigate, Link,useLocation } from 'react-router-dom'
import ReactPaginate from 'react-paginate';
const MerchatsAllPromotions = () => {
  const token = localStorage.getItem('token')
  const[result,setResult]= useState("");
  const [searchinput, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [pagecount, setPagecount] = useState()
  const [perpage, setPerpage] = useState(10)
  const [itemOffset, setItemOffset] = useState('');
  const [count, setCount] = useState(1)
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const user_id = params.get("id");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  var raw = JSON.stringify({
    id: user_id,
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
        baseUrl+"/getPromotionMerchant",
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
  },[searchinput,sort,itemOffset,count]);
  const handlePageChange = (event) => {
    const newOffset = (event.selected * 10);
    setItemOffset(newOffset);
  };

  return (
    <>
      <CCard>
      <CCol xs={12} className="p-3">
        <CForm className="row col-12 pb-3">
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
                <option value="">Sort By</option>
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
                  Description
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {
                Array.isArray(result) &&
                result.map((item) => {
                  return(
                    <CTableRow>
                <CTableDataCell>
                {item.promotion_name}<br/>
                <CCardImage orientation="top" className="promotion-image" src={item.logo} />
                </CTableDataCell>
                <CTableDataCell>
                {item.discription}
                </CTableDataCell>
                <CTableDataCell>
                {item.start_date}
                </CTableDataCell>
                <CTableDataCell>
                {item.end_date}
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

export default MerchatsAllPromotions
