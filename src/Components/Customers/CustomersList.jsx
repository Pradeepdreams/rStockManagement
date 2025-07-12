import axios from "../Utils/AxiosInstance";
import React from "react";
import { getBranchDataFromBalaSilksDB } from "../Utils/indexDB";
import Table from "../Utils/Table";
import Pagination from "../Utils/Pagination";
import DeleteConfirmation from "../Utils/DeleteConfirmation";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBuilding,
  FaVenusMars,
  FaEnvelope,
  FaPhone,
  FaFemale 
} from "react-icons/fa";
import { FaHashtag, FaMars, FaVenus } from "react-icons/fa6";
import { IoMdMale } from "react-icons/io";
import ViewButton from "../Utils/ViewButton";

function CustomersList({
            customersPagination,
            setCurrentPage,
            branchId,
            setCustomerInputs,
            setOpen,
            setLoading,
            loading,
            setStateId,
            setSaveBtn,
            setEditIdCryptForCustomers,
            setCustomerContactDetails,
            itemsPagination,
            setGetItems,
            fetchCustomers,
            setRequiredFields,
            setGetTds,
            setUpi,
            handleFilteredSourceList,
            setIsEditing,
            
}) {


  console.log(customersPagination, "customers");
  

  const navigate = useNavigate();

  const handleEditForCustomers = async (e, id_crypt) => {
    e.preventDefault();
    setOpen(true);
    const token = localStorage.getItem("token");
    setSaveBtn("update");
    setEditIdCryptForCustomers(id_crypt);
    setIsEditing(true);

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForEdit = await axios.get(
        `public/api/customers/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      const customerEditData = responseForEdit.data;
      console.log(customerEditData, "edit");

      setCustomerInputs({
       name: customerEditData.name,
    customer_type: customerEditData.customer_type,
    group_id: customerEditData.group_id,
    // vendor_group_id:
    gst_in: customerEditData.gst_in,
    pan_number: customerEditData.pan_number,
    phone: customerEditData.phone_no,
    email: customerEditData.email,
    address_line_1: customerEditData.address_line_1,
    address_line_2: customerEditData.address_line_2,
    area_id: customerEditData.area_id,  
    city: customerEditData.city,
    state: customerEditData.state,
    country: customerEditData.country,
    pincode: customerEditData.pincode,
    payment_term_id: customerEditData.payment_term_id,
    credit_days: customerEditData.credit_days,
    credit_limit: customerEditData.credit_limit,
    tds_detail_id: customerEditData.tds_detail_id,
    gst_applicable: customerEditData.gst_applicable == 1 ? "yes" : "no",
    gst_applicable_from: customerEditData.gst_applicable,
    gst_registration_type_id: customerEditData.gst_registration_type_id,
   
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/crm/");
        return;
      }
    }
  };

  const headers = [
    "S.No",
    "Name",
    "Email",
    "Phone No",
    "Customer Type",
    "Actions",
  ];

  const renderRow = (item, index) => (
    

    <>
      <td className="px-6 py-4 text-sm text-left text-left font-medium text-gray-700 whitespace-nowrap">
        
         <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                <FaHashtag className="text-gray-500" />
               {customersPagination.from + index}
              </span>
      </td>

      <td className="px-6 py-4 text-sm text-left text-gray-900 font-semibold flex items-center gap-2">
        <FaUser className="text-blue-600" />
        {item.name ? `${item.name}` : "N/A"}
      </td>

      <td className="px-6 py-4 text-sm text-left text-gray-700">
        {/* <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium"> */}
        {/* <FaBuilding /> */}
        {item.email || "N/A"}
        {/* </span> */}
      </td>

      {/* <td className="px-6 py-4 text-sm text-left text-gray-700">
        <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
        <FaVenusMars />
        {item.gender? item.gender.charAt(0).toUpperCase() + item.gender.slice(1) : "N/A"}
        </span>
      </td> */}



      <td className="px-6 py-4 text-sm text-left text-gray-700">
        <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
          {/* <FaEnvelope /> */}
          {item.phone_no || "N/A"}
        </span>
      </td>

      <td className="px-6 py-4 text-sm text-left text-gray-700">
        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          {/* <FaPhone /> */}
          {item.customer_type || "N/A"}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
      
         
          <ViewButton onView={handleEditForCustomers} item={item} />


          <DeleteConfirmation
            apiType="customers"
            id_crypt={item.id_crypt}
            fetchDatas={fetchCustomers}
            setLoading={setLoading}
            loading={loading}
          />
        </div>
      </td>
    </>
  );

  return (
    <>
      <Table
        headers={headers}
        data={customersPagination.data|| []}
        renderRow={renderRow}
      />
      <Pagination
        meta={customersPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default CustomersList;
