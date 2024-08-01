import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './Layout.jsx';
import Login from './components/Pages/Login.jsx';
import Home from './components/Pages/Home.jsx';
import UserForm from './components/SuperAdmin/UserForm.jsx';
import ChangePassword from './components/SuperAdmin/ChangePassword.jsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Caste from './components/Admin/Caste.jsx';
import District from './components/SuperAdmin/District.jsx';
import EditDistrictDetails from './components/SuperAdmin/EditDistrictDetails.jsx';
import Tehsil from './components/Admin/Tehsil.jsx';
import Council from './components/Admin/Council.jsx';
import VidhanSabha from './components/Admin/VidhanSabha.jsx';
import WardBlock from './components/Admin/WardBlock.jsx';
import ChakBlock from './components/Admin/ChakBlock.jsx';
import AreaVill from './components/Admin/AreaVill.jsx';
import PollongStationList from './components/Admin/pollingStationList.jsx';
import PollingStationAllotment from './components/Admin/pollingStationAllotment.jsx';
import OutgoingForms from './components/FormsAdmin/OutcomingForm.jsx';
import IncomingForms from './components/FormsAdmin/IncomingForms.jsx';
import UpdateIncomingForm from './components/FormsAdmin/UpdateIncomingForm.jsx';
import AddVoter from './components/FeedingStaff/AddVoter.jsx';
import SearchChakBlock from './components/FeedingStaff/SearchChakBlock.jsx';
import VoterList from './components/SubAdmin/VoterList.jsx';
import Cookies from 'js-cookie';
import Voters from './components/QCStaff/Voters.jsx';
import DispatchLetter from './components/QCStaff/DispatchLetter.jsx';
import SendSMSForm from './components/QCStaff/SendSMSForm.jsx';
import TelecallerUpload from './components/QCStaff/TelecallerUpload.jsx';
import TelecallerData from './components/QCStaff/TelecallerData.jsx';
import MISDistrict from './components/Admin/Reports/MISDistrict.jsx';

const getRoutesForRole = (role) => {
  switch (role) {
    case 'Super Admin':
      return (
        <>
          <Route path="/home" element={<Home />} />
          <Route path="/district" element={<District />} />
          <Route path="/editDistrictDetails" element={<EditDistrictDetails />} />
          <Route path="/userform" element={<UserForm />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/incomingForms" element={<IncomingForms />} />
          <Route path="/outgoingForms" element={<OutgoingForms />} />
        </>
      );
    case 'Forms Admin':
      return (
        <>
          <Route path="/home" element={<Home />} />
          <Route path="/incomingForms" element={<IncomingForms />} />
          <Route path="/outgoingForms" element={<OutgoingForms />} />
        </>
      );
    case 'Admin':
      return (
        <>
          <Route path="/home" element={<Home />} />
          <Route path="/userform" element={<UserForm />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/tehsil" element={<Tehsil />} />
          <Route path="/council" element={<Council />} />
          <Route path="/casteManagement" element={<Caste />} />
          <Route path="/vidhanSabha" element={<VidhanSabha />} />
          <Route path="/wardBlock" element={<WardBlock />} />
          <Route path="/chakBlock" element={<ChakBlock />} />
          <Route path="/areaVill" element={<AreaVill />} />
          <Route path="/pollingStationList" element={<PollongStationList />} />
          <Route path="/pollingStationAllotment" element={<PollingStationAllotment />} />
          <Route path="/MISDistrict" element={<MISDistrict />} />
        </>
      );
    case 'Sub Admin':
      return (
        <>
          <Route path="/home" element={<Home />} />
          <Route path="/userform" element={<UserForm />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/voterList" element={<VoterList />} />
        </>
      );
    case 'Feeding Staff':
      return (
        <>
          <Route path="/home" element={<Home />} />
          <Route path="/addVotersForm" element={<AddVoter />} />
          <Route path="/searchChakBlock" element={<SearchChakBlock />} />
        </>
      );
      case 'QC Staff':
      return (
        <>
          <Route path="/home" element={<Home />} />
          {/* <Route path="/VoterList" element={<Voters />} /> */}
          <Route path="/VoterList" element={<VoterList />} />
          <Route path="/searchChakBlock" element={<SearchChakBlock />} />
          <Route path="/DispatchLetter" element={<DispatchLetter />} />
          <Route path="/TelecallerData" element={<TelecallerData />} />
          <Route path="/TelecallerUpload" element={<TelecallerUpload />} />
          <Route path="/QcForm" element={<SendSMSForm />} />
        </>
      );

    default:
      return <Route path="*" element={<Navigate to="/" />} />;
  }
};

// Get user role from localStorage

const token = Cookies.get('token');
if(!token)
  {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

const user = JSON.parse(localStorage.getItem('user'));
const userRole = token && user ? user.role : '';

// Create the root and render the app
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
          <>
            <Route element={<Layout />}>
              {getRoutesForRole(userRole)}
            </Route>
          </>
        
      </Routes>
    </Router>
    <ToastContainer />
  </React.StrictMode>
);
