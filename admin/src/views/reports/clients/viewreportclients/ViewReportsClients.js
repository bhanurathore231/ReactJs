import React,{ useEffect, useState } from 'react'
import { useLocation,useNavigate } from 'react-router-dom'
import { baseUrl } from 'src/baseurl';
import ReactPaginate from 'react-paginate';
import {ExportToExcel} from './../../../../components/ExportToExcel'
import {
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CForm,
  CFormSelect,
} from '@coreui/react'
const ViewReportsMerchants = () => {
  const [resultdata, setResult] = useState("");
  const [sort, setSort] = useState('')
  const [sortbydiscount, setSortByDiscount] = useState('')
  const [pagecount, setPagecount] = useState()
  const fileName = "Clients Reports";
  const [perpage, setPerpage] = useState(10)
  const [itemOffset, setItemOffset] = useState('');
  const token = localStorage.getItem('token')
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const Id = params.get("id");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  var raw = JSON.stringify({
    client_id: Id,
    sortby:sort,
    sortbydiscount:sortbydiscount,
    offset:itemOffset
  });
  useEffect(() => {
  const getwallethistory = () => {
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch(baseUrl + "/getRedemptionHistorySingleClient", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.status) {
        setResult(result.merchant.data);
        setPagecount(result.merchant.count/10)
      }
    })
    .catch((error) => console.log("error", error));
  };
  getwallethistory();
}, [sort,sortbydiscount,itemOffset]);
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
              <CFormSelect size="sm" className="mb-3 sort-by" onChange={(e) => setSort(e.target.value)}>
                <option value="">Sort By Date</option>
                <option value="asc">Oldest</option>
                 <option value="dsc">Newest</option>
              </CFormSelect>
              <CFormSelect size="sm" className="mb-3 sort-by" onChange={(e) => setSortByDiscount(e.target.value)}>
                <option value="">Discount</option>
                <option value="asc">Low to High</option>
                <option value="dsc">High to Low</option>
              </CFormSelect>
              
            </div>
            <div className="col-6 d-flex gap-2 mt-3 filter">
            <div style={{ float: 'right' }} className="ms-auto">
          <ExportToExcel apiData={resultdata} fileName={fileName} />
          </div>
            </div>
          </CForm>
          <CTable align="middle" hover responsive>
          <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                <CTableHeaderCell scope="col">Promotion</CTableHeaderCell>
                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">Branch Pin</CTableHeaderCell>
                <CTableHeaderCell scope="col">Discount</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Array.isArray(resultdata) &&
                resultdata.map((item) => {
                  return (
                    <CTableRow>
                      <CTableDataCell>{item.created}</CTableDataCell>
                      <CTableDataCell>{item.promotion_name} </CTableDataCell>
                      <CTableDataCell>${item.amount} </CTableDataCell>
                      <CTableDataCell>{item.branch_pin}</CTableDataCell>
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
  )
}

export default ViewReportsMerchants
