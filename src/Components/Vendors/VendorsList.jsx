import React from "react";
import Pagination from "../Utils/Pagination";
import axios from "../Utils/AxiosInstance";
import Table from "../Utils/Table";
import DeleteConfirmation from "../Utils/DeleteConfirmation";
import ViewButton from "../Utils/ViewButton";
import { FaPhoneVolume } from "react-icons/fa";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FaHashtag, FaStore, FaUser } from "react-icons/fa6";

function VendorsList({
  vendorsPagination,
  setCurrentPage,
  branchId,
  setVendorInputs,
  setOpen,
  setSaveBtn,
  setEditIdCryptForVendors,
  fetchVendors,
  setLoading,
  loading,
  setGetItems,
  setRequiredFields,
  setGetTds,
  handleFilteredSourceList,
  setIsEditing,
}) {
  const handleViewForVendors = async (e, id_crypt) => {
    e.preventDefault();
    setIsEditing(true);
    setOpen(true);

    const token = localStorage.getItem("token");
    setSaveBtn("update");
    setEditIdCryptForVendors(id_crypt);
    setRequiredFields("");
    setGetItems([]);

    try {
      const responseForEdit = await axios.get(
        `public/api/vendors/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      const vendorEditData = responseForEdit.data;
      console.log(vendorEditData, "vendorEditData");

      // If TDS Detail exists, set it
      if (vendorEditData.tds_detail) {
        const tdsArray = [vendorEditData.tds_detail];
        setGetTds(tdsArray);
      }

      // Populate vendor inputs
      setVendorInputs({
        vendor_name: vendorEditData.vendor_name,
        vendor_code: vendorEditData.vendor_code,
        group_id: vendorEditData?.group_id,
        vendor_group_id: vendorEditData?.vendor_group_id,
        gst_in: vendorEditData?.gst_in,
        pan_number: vendorEditData?.pan_number,
        phone: vendorEditData?.phone_no,
        email: vendorEditData?.email,
        address_line_1: vendorEditData?.address_line_1,
        address_line_2: vendorEditData?.address_line_2,
        area_id: vendorEditData?.area_id,
        city: vendorEditData?.city,
        state: vendorEditData?.state,
        country: vendorEditData?.country,
        pincode_id: vendorEditData?.pincode_id,
        payment_term_id: vendorEditData?.payment_term_id,
        credit_days: vendorEditData?.credit_days,
        credit_limit: vendorEditData?.credit_limit,
        tds_detail_id: vendorEditData?.tds_detail_id,
        gst_applicable: vendorEditData?.gst_applicable == 1 ? "yes" : "no",
        gst_applicable_from: vendorEditData?.gst_applicable_from,
        gst_registration_type_id: vendorEditData?.gst_registration_type_id,
        bank_account_no: vendorEditData?.bank_account_no,
        ifsc_code: vendorEditData?.ifsc_code,
        bank_name: vendorEditData?.bank_name,
        bank_branch_name: vendorEditData?.bank_branch_name,
        upi_id: vendorEditData?.upi_id,
        transport_facility_provided:
          vendorEditData?.transport_facility_provided == 1 ? "yes" : "no",
        remarks: vendorEditData?.remarks,
        referred_source_type: vendorEditData?.referred_source_type,
        referred_source_id: vendorEditData?.referred_source_id,
        items: vendorEditData?.items.map((item) => item.id),
      });

      // 🔥 Call to handle the filtered source list
      handleFilteredSourceList(
        vendorEditData.referred_source_type,
        vendorEditData.referred_source_id
      );
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }
  };

  const headers = [
    "S.No",
    "Vendor Name",
    "Vendor Code",
    "Phone No",
    "Email",
    "Area",
    "Area Code",
    "Credit Days",
    "Actions",
  ];

  const renderRow = (item, index) => (
    // <>
    //   <td className="px-6 py-4 whitespace-nowrap">
    //     {vendorsPagination.from + index}
    //   </td>
    //   <td className="px-6 py-4">{item.vendor_name}</td>
    //   <td className="px-6 py-4">{item.vendor_code}</td>
    //   <td className="px-6 py-4">{item.phone_no}</td>
    //   <td className="px-6 py-4">{item.email}</td>
    //   <td className="px-6 py-4">{item.area?.name}</td>
    //   <td className="px-6 py-4">{item.area?.area_code}</td>
    //   <td className="px-6 py-4">{item.credit_days}</td>
    //   <td className="px-6 py-4">
    //     <div className="flex items-center space-x-2">

    //       <ViewButton onView={handleViewForVendors} item={item} />

    //       <DeleteConfirmation
    //         apiType="vendor"
    //         id_crypt={item.id_crypt}
    //         fetchDatas={fetchVendors}
    //         branchId={branchId}
    //         setLoading={setLoading}
    //         loading={loading}
    //       />
    //     </div>
    //   </td>
    // </>

    <>
      <td className="px-6 py-4 text-sm text-left font-semibold text-gray-700 whitespace-nowrap">
        <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
          <FaHashtag className="text-gray-500" />
          {vendorsPagination.from + index}
        </span>
      </td>

      <td className="px-6 py-4 text-left text-sm font-bold text-gray-900 capitalize">
        <div className="flex items-center gap-2">
          <FaUser className="text-blue-600" />
          {/* example icon for vendor */}
          <span>{item.vendor_name}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-left text-sm">
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded shadow-sm">
          {item.vendor_code}
        </span>
      </td>

      <td className="px-6 py-4 text-left text-sm text-gray-700">
        <div className="flex items-center gap-2">
          {/* <FaPhoneVolume className="w-4 h-4 text-gray-500" /> */}
          <span>{item.phone_no}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600 text-left">
        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
          <div className="flex items-center gap-2">
            <MdOutlineMarkEmailRead className="w-4 h-4 text-gray-500" />
            <span> {item.email}</span>
          </div>
        </span>
      </td>

      <td className="px-6 py-4 text-sm text-left">
        {/* <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full"> */}
        {item.area?.name || "--"}
        {/* </span> */}
      </td>

      <td className="px-6 py-4 text-sm text-left">
        {/* <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md"> */}
        {item.area?.area_code || "--"}
        {/* </span> */}
      </td>

      <td className="px-6 py-4 text-sm text-left">
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold shadow-sm
        ${
          item.credit_days > 30
            ? "bg-red-100 text-red-700"
            : "bg-purple-100 text-purple-700"
        }`}
        >
          {item.credit_days} days
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <ViewButton onView={handleViewForVendors} item={item} />
          <DeleteConfirmation
            apiType="vendor"
            id_crypt={item.id_crypt}
            fetchDatas={fetchVendors}
            branchId={branchId}
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
        data={vendorsPagination?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={vendorsPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default VendorsList;
