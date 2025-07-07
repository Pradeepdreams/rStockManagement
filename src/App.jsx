import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Dashboard from "./Components/Dashboard/Dashboard";
import Employees from "./Components/Employees/EmployeesCreate";
import Login from "./Components/Auth/Login";

import VendorsCreate from "./Components/Vendors/VendorsCreate";
import ProtectedRoutes from "./Components/Utils/ProtectedRoutes";
import Navbar from "./Components/Navbar/Navbar";
import CategoryCreate from "./Components/Masters/Category/CategoryCreate";
import ItemCreate from "./Components/Masters/Items/ItemCreate";
import AttributesCreate from "./Components/Masters/Attributes/AttributesCreate";
import AttributeValuesCreate from "./Components/Masters/AttributeValues/AttributevaluesCreate";
import AreaCreate from "./Components/Masters/Area/AreaCreate";
import GroupCreate from "./Components/Masters/Groups/GroupCreate";
import GstRegistrationCreate from "./Components/Masters/GstRegistration/GstRegistrationCreate";
import TdsDetailsCreate from "./Components/Masters/TdsDetails/TdsDetailsCreate";
import SocialMediaCreate from "./Components/Masters/SocialMedia/SocialMediaCreate";
import PaymentTermsCreate from "./Components/Masters/PaymentTerms/PaymentTermsCreate";
import SectionCreate from "./Components/Masters/Section/SectionCreate";
import AgentCreate from "./Components/Masters/Agents/AgentCreate";
import RoleCreate from "./Components/Settings/Roles/RoleCreate";
import BranchesCreate from "./Components/Masters/Branches/BranchesCreate";
import VendorGroupsCreate from "./Components/Masters/VendorGroups/VendorGroupsCreate";
import PurchaseOrderCreate from "./Components/PurchaseOrder/PurchaseOrderCreate";
import "react-toastify/dist/ReactToastify.css";
import QualificationCreate from "./Components/Masters/Qualification/QualificationCreate";
import PurchaseOrderEntriesCreate from "./Components/PurchaseOrderEntries/PurchaseOrderEntriesCreate";
import PincodeCreate from "./Components/Masters/Pincode/PincodeCreate";
import LogisticsCreate from "./Components/Masters/Logistics/LogisticsCreate";
import axios from "./Components/Utils/AxiosInstance";
import PurchaseEntriesApproval from "./Components/Masters/PurchaseEntriesApproval/PurchaseEntriesApproval";
import DiscountCreate from "./Components/Masters/Discount/DiscountCreate";
import Barcode from "./Components/Barcode/Barcode";
import StockEntryCreate from "./Components/StockEntry/StockEntryCreate";
import Error from "./Components/Error/Error";
import CustomersCreate from "./Components/Customers/CustomersCreate";
import SalesCreate from "./Components/Sales/SalesCreate";

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("token");
  };

  // axios.defaults.baseURL = "http://localhost/pradeep/laravel/lbalasilks/";
  axios.defaults.baseURL = "http://localhost/murugesh/stock_management/lStockManagement/";
  // axios.defaults.baseURL = 'https://balasilks.axninfotech.in/api/1';

  return (
    // <Router>
    <Routes>
      <Route
        path="/"
        element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />}
      />

      <Route path="/barcode" element={<Barcode />} />
      <Route path="*" element={<Error />} />

      <Route element={<Layout />}>
      
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoutes>
              <Employees />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoutes>
              <CustomersCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoutes>
              <SalesCreate/>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/vendors"
          element={
            <ProtectedRoutes>
              <VendorsCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/purchase-order"
          element={
            <ProtectedRoutes>
              <PurchaseOrderCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/purchase-order-entries"
          element={
            <ProtectedRoutes>
              <PurchaseOrderEntriesCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/purchase-entries-approval"
          element={
            <ProtectedRoutes>
              <PurchaseEntriesApproval />
            </ProtectedRoutes>
          }
        />
         <Route
          path="/stock-entry"
          element={
            <ProtectedRoutes>
              <StockEntryCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/categories"
          element={
            <ProtectedRoutes>
              <CategoryCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/items"
          element={
            <ProtectedRoutes>
              <ItemCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/attributes"
          element={
            <ProtectedRoutes>
              <AttributesCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/attribute-values"
          element={
            <ProtectedRoutes>
              <AttributeValuesCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/areas"
          element={
            <ProtectedRoutes>
              <AreaCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/groups"
          element={
            <ProtectedRoutes>
              <GroupCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/vendor-groups"
          element={
            <ProtectedRoutes>
              <VendorGroupsCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/gst-registration"
          element={
            <ProtectedRoutes>
              <GstRegistrationCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/tds-details"
          element={
            <ProtectedRoutes>
              <TdsDetailsCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/social_media"
          element={
            <ProtectedRoutes>
              <SocialMediaCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/payment-terms"
          element={
            <ProtectedRoutes>
              <PaymentTermsCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/sections"
          element={
            <ProtectedRoutes>
              <SectionCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/qualifications"
          element={
            <ProtectedRoutes>
              <QualificationCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/agents"
          element={
            <ProtectedRoutes>
              <AgentCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/pincode"
          element={
            <ProtectedRoutes>
              <PincodeCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/branches"
          element={
            <ProtectedRoutes>
              <BranchesCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/logistics"
          element={
            <ProtectedRoutes>
              <LogisticsCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/masters/discount-on-purchase"
          element={
            <ProtectedRoutes>
              <DiscountCreate />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/settings/roles"
          element={
            <ProtectedRoutes>
              <RoleCreate />
            </ProtectedRoutes>
          }
        />

        {/* other routes */}
      </Route>
    </Routes>
    // </Router>
  );
}

export default App;
