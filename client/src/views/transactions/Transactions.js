import React, { useState } from 'react'
import {
  CTable,
  CRow,
  CPagination,
  CPaginationItem,
  CCard,
  CCol,
  CModal,
  CModalHeader,
  CFormCheck,
  CModalBody,
  CModalFooter,
  CButton,
  CFormSelect,
  CFormRange,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilSwapVertical, cilArrowCircleLeft } from '@coreui/icons'
const Transactions = () => {
  const [visible, setVisible] = useState(false)
  const [filtervisible, setfilterVisible] = useState(false)
  const navigate = useNavigate()
  const handleButtonClick = () => {
    navigate(-1)
  }
  const columns = [
    {
      key: 'ttime',
      label: 'Time',
      _props: { scope: 'col' },
    },
    {
      key: 'merchantname',
      label: 'Name',
      _props: { scope: 'col' },
    },
    {
      key: 'spentamount',
      label: 'Spend',
      _props: { scope: 'col' },
    },
    {
      key: 'discountamount',
      label: 'Discount',
      _props: { scope: 'col' },
    },
  ]
  const items = [
    {
      merchantname: 'Mark',
      spentamount: '$10',
      ttime: '04.15 PM 01-01-1999',
      discountamount: '$5',
    },
    {
      merchantname: 'Jacob',
      spentamount: '$16',
      ttime: '04.15 PM 01-01-1999',
      discountamount: '$5',
    },
    {
      merchantname: 'Mike',
      spentamount: '$20',
      ttime: '04.15 PM 01-01-1999',
      discountamount: '$5',
    },
    {
      merchantname: 'Mike',
      spentamount: '$20',
      ttime: '04.15 PM 01-01-1999',
      discountamount: '$5',
    },
    {
      merchantname: 'Mike',
      spentamount: '$20',
      ttime: '04.15 PM 01-01-1999',
      discountamount: '$5',
    },
    {
      merchantname: 'Mike',
      spentamount: '$20',
      ttime: '04.15 PM 01-01-1999',
      discountamount: '$5',
    },
    {
      merchantname: 'Mike',
      spentamount: '$20',
      ttime: '04.15 PM 01-01-1999',
      discountamount: '$5',
    },
  ]
  return (
    <>
      <CIcon icon={cilArrowCircleLeft} size="xxl" onClick={handleButtonClick} />
      <CCard>
        <CRow className="trancstionheading">
          <CCol xs={6}>
            <h2 className="wallet-heading">Transactions History</h2>
          </CCol>
          <CCol xs={6}>
            <div className="filter-div-wallet">
              <CIcon
                id="transactions-filter"
                icon={cilFilter}
                size="xl"
                onClick={() => setfilterVisible(!filtervisible)}
              />
            </div>
            <div className="sort-div-wallet">
              <CIcon
                id="transactions-sort"
                icon={cilSwapVertical}
                size="xl"
                onClick={() => setVisible(!visible)}
              />
            </div>
          </CCol>
        </CRow>
        <div className="col-12 trancstiondiv">
          <CTable borderless columns={columns} items={items} />
          <CPagination aria-label="Page navigation example">
            <CPaginationItem aria-label="Previous" disabled>
              <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            <CPaginationItem active>1</CPaginationItem>
            <CPaginationItem aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </div>
      </CCard>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}></CModalHeader>

        <CModalBody>
          <CFormCheck
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
            label="Name: A to Z"
          />

          <CFormCheck
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
            label="Name: Z to A"
          />
          <CFormCheck type="radio" name="flexRadioDefault" id="flexRadioDefault3" label="Newest" />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal visible={filtervisible} onClose={() => setfilterVisible(false)}>
        <CModalHeader onClose={() => setfilterVisible(false)}></CModalHeader>

        <CModalBody>
          <CCol xs={12}>
            <label htmlFor="mercent-select">Mercent Name</label>
            <CFormSelect size="sm" className="mb-3" aria-label="Choose Mercent Name">
              <option>Choose Mercent Name</option>

              <option value="1">Nike</option>

              <option value="2">Puma</option>

              <option value="3">Adidas</option>
            </CFormSelect>
          </CCol>
          <CCol xs={12}>
            <label htmlFor="date-range">Date</label>
            <CFormCheck id="flexCheckDefault" label="Last 3 Months" />
            <CFormCheck id="flexCheckChecked1" label="Last 6 Months" />
            <CFormCheck id="flexCheckChecked2" label="Last 12 Months" />
            <CFormCheck id="flexCheckChecked2" label="2021" />
          </CCol>
          <CCol xs={12}>
            <CFormRange min={0} max={5} label="Amount" defaultValue="3" id="customRange2" />
          </CCol>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setfilterVisible(false)}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Transactions
