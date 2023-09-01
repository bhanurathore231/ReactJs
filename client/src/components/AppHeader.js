import React,{useState,useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CButton,
  CDropdown,
  CDropdownToggle,
  CAvatar,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilMenu,
  cilWallet,
  cilUser,
  cilSettings,
  cilAccountLogout
} from "@coreui/icons";
import { baseUrl } from "src/baseurl";
import { AppHeaderDropdown } from "./header/index";
import { logo } from "src/assets/brand/logo";
import avatar8 from './../assets/images/avatars/8.jpg'
const AppHeader = () => {
  const userid = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer " + token);
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
const user = localStorage.getItem("user_id");
const [result, setResult] = useState("");
const [clientdata, useClientData] = useState("");
var raw = JSON.stringify({
  id: user,
});
  useEffect(() => {
    const getapi = () => {
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      fetch(
        baseUrl+"/getWallet",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setResult(result.wallet[0]);
          }
        })
        .catch((error) => console.log("error", error));
    };
    getapi();

  const getClient = () => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=bc4i8o5djigk86k1000bnjha2f");
  var count = JSON.stringify({
    id: userid,
  });
  var countOption = {
    method: "POST",
    headers: myHeaders,
    body: count,
  };
  fetch(
    baseUrl+"/getClient",
    countOption
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.status) {
        useClientData(result.client);
      }
    })
    .catch((error) => console.log("error", error));
  };
  getClient();
}, []);
  const navigate = useNavigate();
  const handleButtonClickProfile = () => {
    navigate('/profile')
  }
  const handleButtonClickSettings = () => {
    navigate('/Edit_Profile')
  }
  const handleButtonClickLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("user_id");
    navigate('/login')
  }
  const handleButtonClick = () => {
    navigate("/wallet");
  };
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CHeader position="sticky" className="mb-3">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/dashboard">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
      {clientdata.profilepic?
      <CAvatar src={clientdata.profilepic} size="md" />
      :
      <CAvatar src={avatar8} size="md" />
      }
    </CDropdownToggle>
    <CDropdownMenu className="pt-0" placement="bottom-end">
      <CDropdownItem onClick={handleButtonClickProfile}>
        <CIcon icon={cilUser} className="me-2" />
        Profile
      </CDropdownItem>
      <CDropdownItem onClick={handleButtonClickSettings}>
        <CIcon icon={cilSettings} className="me-2" />
        Settings
      </CDropdownItem>
      <CDropdownItem onClick={handleButtonClickLogout}>
        <CIcon icon={cilAccountLogout} className="me-2" />
        Log Out
      </CDropdownItem>
      <CDropdownDivider />
    </CDropdownMenu>
  </CDropdown>
        <CHeaderNav>
          <CNavItem>
            <CButton
              class="wallet-button"
              color="dark"
              variant="outline"
              onClick={handleButtonClick}
            >
              <CIcon icon={cilWallet} customClassName="nav-icon wallet-icon" />{" "}
              Wallet Balance: ${result.balance}
            </CButton>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
    </CHeader>
  );
};
export default AppHeader;
