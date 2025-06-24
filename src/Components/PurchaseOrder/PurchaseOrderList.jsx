import React from "react";
import Table from "../Utils/Table";
import Pagination from "../Utils/Pagination";
import DeleteConfirmation from "../Utils/DeleteConfirmation";
import axios from "../Utils/AxiosInstance";
import {
  getBranchDataFromBalaSilksDB,
  getDecryptedPosData,
} from "../Utils/indexDB";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaUserTie, FaClipboardCheck, FaMoneyBill, FaTruck, FaUser } from "react-icons/fa";
import ViewButton from "../Utils/ViewButton";
import { FaHashtag } from "react-icons/fa6";

function PurchaseOrderList({
  poPaginationDatas,
  setCurrentPage,
  fetchPurchaseOrderDatas,
  setLoading,
  loading,
  setSaveBtn,
  setIsEditing,
  setEditIdCrypt,
  setOpenDialogForPurchaseOrder,
  setPoInputs,
  setModeDeliveryShow,
  setExpectedDeliveryShow,
  setLogisticsShow,
  fetchItemsByVendor,
  fetchVendorsByArea,
  setOverallTotalDialog,
  setPoEditDatas,
  setRequiredFields,
  setPendingStatusError,
  setShowInward,
}) {
  const headers = [
    "S.No",
    "PO-No",
    "PO-Date",
    "Vendor",
    // "Mode of Delivery",
    "Expected Delivery",
    "Total Amount",
    "Status",
    "Created By",
    "Actions",
  ];

  const handleViewForPurchaseOrder = async (e, id_crypt) => {
    e.preventDefault();
    setRequiredFields("");

    const result = await getDecryptedPosData();
    console.log("Test Decrypted Data:", result);
    setShowInward(true);
    setSaveBtn("update");
    setOpenDialogForPurchaseOrder(true);
    setEditIdCrypt(id_crypt);
    setLoading(true);
    setIsEditing(true);

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");
    try {
      const responseForPoEditData = await axios.get(
        `public/api/purchase-orders/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      const poEditDatas = responseForPoEditData.data;
      setPoEditDatas(poEditDatas);
      console.log(poEditDatas, "poEditDatas");

      setPoInputs({
        date: poEditDatas.date.split("T")[0],
        po_number: poEditDatas.po_number,
        area_id: poEditDatas.area_id,
        vendor_id: poEditDatas.vendor_id,
        payment_terms_id: poEditDatas.payment_terms_id,
        expected_delivery_date: poEditDatas.expected_delivery_date,
        is_polished: String(poEditDatas.is_polished),
        mode_of_delivery: poEditDatas.mode_of_delivery,
        logistics: poEditDatas.logistic_id,

        order_amount: poEditDatas.order_amount,
        discount_percent: poEditDatas.discount_percent,
        discount_amount: poEditDatas.discount_amount,
        discounted_total: poEditDatas.discounted_total,
        minimum_discount: poEditDatas.minimum_discount,
        gst_amount: poEditDatas.gst_amount,
        cgst_amount: poEditDatas.cgst_amount,
        sgst_amount: poEditDatas.sgst_amount,
        igst_amount: poEditDatas.igst_amount,
        total_amount: poEditDatas.total_amount,
        remarks: poEditDatas.remarks,
        items: poEditDatas.purchase_items.map((item) => ({
          id: item.id,
          item_id: item.item_id,
          quantity: item.quantity,
          cgst_percent: item.cgst_percent,
          sgst_percent: item.sgst_percent,
          igst_percent: item.igst_percent,
          cgst_amount: item.cgst_amount,
          sgst_amount: item.sgst_amount,
          igst_amount: item.igst_amount,
          item_price: item.item_price,
          gst_percent: item.gst_percent,
          item_gst_amount: item.item_gst_amount,
          total_item_price: item.total_item_price,
          discount_price: item.discount_price,
          item_status: item.item_status,
          discounted_amount: item.discounted_amount,
          overall_item_price: item.overall_item_price,
          inward_quantity: item.inward_quantity,
          pending_quantity: item.pending_quantity,
          hsn_code: item.hsn_code,
          images: item.images.map((item) => item.image),
          uploaded_images: item.uploaded_images,
        })),
        gst_entries: poEditDatas?.purchase_order_gst?.map((item) => ({
          gst_percent: item.gst_percent,
          cgst_percent: item.cgst_percent,
          cgst_amount: item.cgst_amount,
          sgst_percent: item.sgst_percent,
          sgst_amount: item.sgst_amount,
          igst_percent: item.igst_percent,
          igst_amount: item.igst_amount,
        })),
      });
      fetchVendorsByArea(poEditDatas.area.id_crypt);
      fetchItemsByVendor(poEditDatas.vendor.id_crypt);

      if (poEditDatas.is_polished === 1) {
        setModeDeliveryShow(true);
      }

      if (poEditDatas.mode_of_delivery === "hand") {
        setExpectedDeliveryShow(true);
        setLogisticsShow(false);
      } else if (poEditDatas.mode_of_delivery === "parcel") {
        setExpectedDeliveryShow(true);
        setLogisticsShow(true);
      }
      setOverallTotalDialog(true);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRow = (po, index) => (
    // <>
    //   <td className="px-6 py-4 whitespace-nowrap">
    //     {poPaginationDatas.from + index}
    //   </td>
    //   <td className="px-6 py-4">{po.po_number}</td>
    //   <td className="px-6 py-4">{po.date}</td>
    //   <td className="px-6 py-4">{po.vendor?.vendor_name}</td>
    //   {/* <td className="px-6 py-4">{po.mode_of_delivery}</td> */}
    //   <td className="px-6 py-4">{po.expected_delivery_date}</td>
    //   <td className="px-6 py-4">{po.total_amount}</td>
    //   <td className="px-6 py-4 font-bold">
    //     {po.po_status === "Pending" ? (
    //       <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
    //         Pending
    //       </span>
    //     ) : po.po_status === "Partially Pending" ? (
    //       <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-600/10 ring-inset">
    //         Partially Pending
    //       </span>
    //     ) : po.po_status === "Discount Approval" ? (
    //       <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
    //         Discount Approval
    //       </span>
    //     ) : (
    //       <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/10 ring-inset">
    //         {po.po_status || "N/A"}
    //       </span>
    //     )}
    //   </td>

    //   <td className="px-6 py-4">{po.created_by.name}</td>

    //   <td className="px-6 py-4 text-center">
    //     <div className="flex justify-center gap-2">
    //       <button
    //         className="bg-indigo-500 cursor-pointer hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
    //         onClick={(e) => handleViewForPurchaseOrder(e, po.id_crypt)}
    //       >
    //         View
    //       </button>

    //       <DeleteConfirmation
    //         apiType="po"
    //         id_crypt={po.id_crypt}
    //         fetchDatas={fetchPurchaseOrderDatas}
    //         setLoading={setLoading}
    //         loading={loading}
    //       />
    //     </div>
    //   </td>
    // </>

    
<>
  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-left">
 
   <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
        <FaHashtag className="text-gray-500" />
        {poPaginationDatas.from + index}
      </span>

  </td>

  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-left">
    <span className="inline-flex items-center gap-2">
      <FaClipboardCheck className="text-blue-600" />
      {po.po_number}
    </span>
  </td>

  <td className="px-6 py-4 text-sm text-gray-700 text-left">
    <span className="inline-flex items-center gap-2">
      <FaCalendarAlt className="text-purple-600" />
      {po.date}
    </span>
  </td>

  <td className="px-6 py-4 text-sm text-gray-700 text-left">
    <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
      <FaUserTie />
      {po.vendor?.vendor_name || "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 text-sm text-gray-700 text-left">
    <span className="inline-flex items-center gap-2">
      <FaTruck className="text-green-600" />
      {po.expected_delivery_date || "N/A"}
    </span>
  </td>

 <td className="px-6 py-4 text-sm text-gray-700 text-left">
  <span className="inline-flex items-center gap-2">
    {/* <FaMoneyBill className="text-yellow-600" /> */}
    ₹{Number(po.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </span>
</td>



  <td className="px-6 py-4 font-bold text-sm">
    {po.po_status === "Pending" ? (
      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
        Pending
      </span>
    ) : po.po_status === "Partially Pending" ? (
      <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-600/10 ring-inset">
        Partially Pending
      </span>
    ) : po.po_status === "Discount Approval" ? (
      <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
        Discount Approval
      </span>
    ) : (
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/10 ring-inset">
        {po.po_status || "N/A"}
      </span>
    )}
  </td>

  <td className="px-6 py-4 text-sm text-gray-700 text-left">
    <span className="inline-flex items-center gap-2">
      <FaUser className="text-indigo-600" />
      {po.created_by?.name || "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 text-center">
    <div className="flex justify-center gap-2">
      {/* <button
        className="bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white border border-indigo-600 px-4 py-1 rounded-md text-xs font-semibold transition duration-200"
        onClick={(e) => handleViewForPurchaseOrder(e, po.id_crypt)}
      >
        View
      </button> */}

          <ViewButton onView={handleViewForPurchaseOrder} item={po} />


      <DeleteConfirmation
        apiType="po"
        id_crypt={po.id_crypt}
        fetchDatas={fetchPurchaseOrderDatas}
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
        data={poPaginationDatas?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={poPaginationDatas}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default PurchaseOrderList;
