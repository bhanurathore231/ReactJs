import React, { useState, useEffect} from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilBell, cilSettings, cilUser, cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { baseUrl } from 'src/baseurl'
import avatar8 from './../../assets/images/avatars/8.jpg'
const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const handleButtonClickProfile = () => {
    navigate('/profile')
  }
  const handleButtonClickSettings = () => {
    navigate('/settings')
  }
  const handleButtonClickLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("user_id");
    navigate('/login')
  }
  const token = localStorage.getItem('token');
  const user_id=localStorage.getItem('user_id');
  const [resultdata,setResult]=useState('');
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
myHeaders.append("Authorization", "Bearer "+token);
var raw = JSON.stringify({
  "id": user_id,
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw
};
useEffect(() => {
  const getapi = () => {
fetch(baseUrl+"/getMerchant", requestOptions)
  .then(response => response.json())
  .then(result => {
    if(result.status) {
      setResult(result.merchant[0]);
    }
  })
  .catch(error => console.log('error', error));
};
getapi();
}, []);
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        {resultdata.logo?
        <CAvatar src={resultdata.logo} size="md"/>
        :
        <CAvatar src={avatar8} size="md" />
        }
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem href="#" style={{cursor:'pointer'}}>
          <CIcon icon={cilBell} className="me-2" />
          Notifications
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem onClick={handleButtonClickProfile} style={{cursor:'pointer'}}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem onClick={handleButtonClickSettings} style={{cursor:'pointer'}}>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem onClick={handleButtonClickLogout} style={{cursor:'pointer'}}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Log Out
        </CDropdownItem>
        <CDropdownDivider />
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
