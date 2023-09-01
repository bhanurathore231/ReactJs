import React, { useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import {
  CTable,
  CPagination,
  CPaginationItem,
  CCard,
  CCol,
  CFormInput,
  CButton,
  CForm,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
const ViewWalletHistory = () => {
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
  const columns = [
    {
      key: 'mercentname',
      label: 'Mercent',
      _props: { scope: 'col' },
    },
    {
      key: 'spentamount',
      label: 'Amount',
      _props: { scope: 'col' },
    },
    {
      key: 'balance',
      label: 'Balance',
      _props: { scope: 'col' },
    },
    {
      key: 'ttime',
      label: 'Date & Time',
      _props: { scope: 'col' },
    },
  ]
  const items = [
    {
      spentamount: '$10',
      balance: '$20',
      ttime: '2023-03-27 14.50PM',
      mercentname: 'Adidas',
    },
    {
      spentamount: '$16',
      balance: '$20',
      ttime: '2023-03-17 14.50PM',
      mercentname: 'Nike',
    },
    {
      spentamount: '$20',
      balance: '$20',
      ttime: '2023-03-13 04.50PM',
      mercentname: 'Puma',
    },
    {
      spentamount: '$20',
      balance: '$20',
      ttime: '2023-03-13 04.50PM',
      mercentname: 'Puma',
    },
    {
      spentamount: '$20',
      balance: '$20',
      ttime: '2023-03-13 04.50PM',
      mercentname: 'Puma',
    },
    {
      spentamount: '$20',
      balance: '$20',
      ttime: '2023-03-13 04.50PM',
      mercentname: 'Puma',
    },
    {
      spentamount: '$20',
      balance: '$20',
      ttime: '2023-03-13 04.50PM',
      mercentname: 'Puma',
    },
  ]
  return (
    <>
      <CCard>
        <div className="data-view container">
          <CForm className="row col-12 pb-3">
            <div className="col-6 d-flex gap-2 mt-3">
              <CFormInput
                type="text"
                size="sm"
                placeholder="Search"
                aria-label="Search"
                className="custom-search-data"
              />
              <CButton color="primary" size="sm">
                Search
              </CButton>
            </div>
            <div className="col-6 d-flex gap-2 mt-3">
              <CDropdown>
                <CDropdownToggle color="primary" size="sm">
                  Showed Data
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem href="#">10</CDropdownItem>
                  <CDropdownItem href="#">50</CDropdownItem>
                  <CDropdownItem href="#">100</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
              <CButton onClick={() => setVisible(!visible)}>Choose Date</CButton>
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
          <CTable id="merchantstable" columns={columns} items={items} />
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
    </>
  )
}

export default ViewWalletHistory
