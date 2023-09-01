import React from 'react'
import { CTable } from '@coreui/react'
import ReactImg from './../../../assets/images/Logo.png'
const ViewTransactions = () => {
  const columns = [
    {
      key: 'ttime',
      label: 'Created Time',
      _props: { scope: 'col' },
    },
    {
      key: 'merchantlogo',
      label: 'Merchant Logo',
      _props: { scope: 'col' },
    },
    {
      key: 'merchantname',
      label: 'Merchant Name',
      _props: { scope: 'col' },
    },
    {
      key: 'spentamount',
      label: 'Spend Amount',
      _props: { scope: 'col' },
    },
    {
      key: 'discountamount',
      label: 'Discount Amount',
      _props: { scope: 'col' },
    },
    {
      key: 'paymentmethod',
      label: 'Payment Method',
      _props: { scope: 'col' },
    },
  ]
  const items = [
    {
      merchantlogo: <img className="merchentspromotion-logos" src={ReactImg}></img>,
      merchantname: 'Mark',
      spentamount: '$10',
      ttime: '04.15 PM 01-01-1999',
      discountamount: '$5',
      paymentmethod: 'Wallet',
      _cellProps: { id: { scope: 'row' }, action: { colSpan: 2 } },
    },
  ]
  return (
    <>
      <div className="col-12 trancstiondiv">
        <CTable columns={columns} items={items} />
      </div>
    </>
  )
}

export default ViewTransactions
