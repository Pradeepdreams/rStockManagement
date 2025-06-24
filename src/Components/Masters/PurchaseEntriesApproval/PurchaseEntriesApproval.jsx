import React, { useEffect, useState } from "react";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import axios from "../../Utils/AxiosInstance";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { triggerGlobalToast } from "../../Utils/GlobalToast";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { usePurchaseOrderEntriesDialogContext } from "../../Context/PurchaseOrderEntriesDialogContext";
import PurchaseOrderEntriesDialogBox from "../../PurchaseOrderEntries/PurchaseOrderEntriesDialogBox";
import { useOutletContext } from "react-router-dom";
import ViewButton from "../../Utils/ViewButton";
import { TiTick } from "react-icons/ti";
import { Tooltip } from "react-tooltip";
import { FaArrowRight, FaCalendarAlt, FaCheckCircle, FaClock, FaDownload, FaExclamation, FaFileAlt, FaFileInvoice, FaHashtag, FaQuestionCircle, FaRupeeSign, FaStore, FaUser } from "react-icons/fa";
import { FaU } from "react-icons/fa6";

function PurchaseEntriesApproval() {
  const { collapsed } = useOutletContext();
  const [approvalDatas, setApprovalDatas] = useState([]);
  const [approvalDataPagination, setApprovalDataPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showApprovalConfimation, setShowApprovalConfimation] = useState(false);
  const [idCryptForApproval, setIdCryptForApproval] = useState(null);
  const [loading,setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [purchaseOrderPendingDatas, setPurchaseOrderPendingDatas] = useState([]);
  const [vendorAndItemData, setVendorAndItemData] = useState([]);
  const [poEntryEditdata, setPoEntryEditdata] = useState([]);
  const [itemsFromVendor, setItemsFromVendor] = useState([]);


  const {
      openDialogForPurchaseOrderEntries,
      toggleDialog,
      setOpenDialogForPurchaseOrderEntries,
      purchaseOrderEntriesPaginationData,
      setPurchaseOrderEntriesPaginationData,
      saveBtnForPurchaseOrderEntries,
      setSaveBtnForPurchaseOrderEntries,
      editIdForPurchaseOrderEntries,
      setEditIdForPurchaseOrderEntries,
      purchaseOrderEntriesInputs,
      setPurchaseOrderEntriesInputs,
      poEntryLatestNumber,
      setPoEntryLatestNumber,
    } = usePurchaseOrderEntriesDialogContext();

  const headers = [
    "S.No",
    "PE-No",
    "Date",
    "Vendor Name",
    "Vendor Invoice",
    "Total Amount",
    "Status",
    "Created By",
    "Actions",
  ];

  const fetchPurchaseEntriesApproval = async () => {
    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const response = await axios.get("public/api/purchase-entries/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      const approvalDataList = response.data.original.pending_entries;
      console.log(approvalDataList, "approvalDataList");
      const showStatusPendingData = approvalDataList?.data.filter((item)=>item.status === "Pending Approval")
      console.log(showStatusPendingData, "showStatusPendingData");
      setApprovalDatas(showStatusPendingData);
      setApprovalDataPagination(approvalDataList)

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPurchaseEntriesApproval();
  }, []);

   const handleViewForPurchaseOrder = async (e, id_crypt) => {
    e.preventDefault();

    setSaveBtnForPurchaseOrderEntries("update");
    setOpenDialogForPurchaseOrderEntries(true);
    setEditIdForPurchaseOrderEntries(id_crypt);
    setLoading(true);
    setIsEditing(true);

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");
    try {
      const responseForPoEditData = await axios.get(
        `public/api/purchase-entries/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForPoEditData.data, "responseForPoEditData.data");

      if (responseForPoEditData.data.against_po == "1") {
        //  const responseForPendingPo = await axios.get(
        //     `public/api/purchase-orders/vendors/${responseForPoEditData.data.vendor.id_crypt}`,
        //     {
        //       headers: {
        //         Authorization: `Bearer ${localStorage.getItem("token")}`,
        //         "X-Branch-Id": branchIds[0],
        //       },
        //     }
        //   );

        //   console.log(responseForPendingPo, "responseForPendingPo");
        let poArray = [];
        poArray.push(responseForPoEditData.data.purchase_order);
        console.log(poArray, "poArray");
        setPurchaseOrderPendingDatas(poArray);

        const res = await axios.get(
          `public/api/purchase-orders/${responseForPoEditData.data.purchase_order.id_crypt}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "X-Branch-Id": branchIds[0],
            },
          }
        );

        // console.log(res.data, "res.data");
        setVendorAndItemData(res.data);
      }

      if (responseForPoEditData.data.against_po == "0") {
        const resFroVendorItems = await axios.get(
          `public/api/vendors/${responseForPoEditData.data.vendor.id_crypt}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "X-Branch-Id": branchIds[0],
            },
          }
        );
        console.log(resFroVendorItems.data.items, "item vendor");
        setItemsFromVendor(resFroVendorItems.data.items);
      }

      // setPurchaseOrderEntriesInputs((prev) => ({
      //   ...prev,
      //   items: responseForPoEditData.data.items,
      // }));

      // setVendorAndItemData(responseForPoEditData.data.items)

      const poEntryEditData = responseForPoEditData.data;
      setPoEntryEditdata(responseForPoEditData.data);

      //   const poentriId = poEntryEditData.purchase_order_id ;

      // try {
      //   const res = await axios.get(
      //     `public/api/public/api/purchase-orders/${poentriId}`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //         "X-Branch-Id": branchIds[0],
      //       },
      //     }
      //   );
      //   console.log(res.data, "view");

      //   setPurchaseOrderPendingDatas(res.data);         // Optional if needed
      //   setVendorAndItemData(res.data);                 // ✅ Set item list for dropdown
      // } catch (error) {
      //   console.error("Error fetching vendor items in view:", error);
      // }

      // Populate Purchase Order Entries Inputs
      setPurchaseOrderEntriesInputs({
        purchase_order_id: poEntryEditData.purchase_order_id,
        purchase_entry_number: poEntryEditData.purchase_entry_number,
        vendor_id: poEntryEditData.vendor_id,
        against_po: poEntryEditData.against_po == 1 ? "1" : "0",
        vendor_invoice_no: poEntryEditData.vendor_invoice_no,
        vendor_invoice_date: poEntryEditData.vendor_invoice_date,
        sub_total_amount: poEntryEditData.sub_total_amount,
        gst_amount: poEntryEditData.gst_amount,
        total_amount: poEntryEditData.total_amount,
        purchase_person_id: poEntryEditData.purchase_person_id,
        mode_of_delivery: poEntryEditData.mode_of_delivery,
        logistic_id: poEntryEditData.logistic_id,
        remarks: poEntryEditData.remarks,
        vendor_invoice_image: poEntryEditData.vendor_invoice_image,
        items: poEntryEditData.items.map((item) => ({
          po_item_id: item.po_item_id,
          vendor_item_name: item.vendor_item_name,
          item_id: item?.item_id,
          gst_percent: item.gst_percent,
          hsn_code: item.hsn_code,
          po_quantity: item.po_quantity,
          quantity: item.quantity,
          po_price: item.po_price,
          vendor_price: item.vendor_price,
          selling_price: item.selling_price,
          sub_total_amount: item.sub_total_amount,
          total_amount: item.total_amount,
          discount: item.discount,
        })),
        gst_details: poEntryEditData?.gst_details?.map((item) => ({
          gst_percent: item.gst_percent,
          igst_percent: item.igst_percent,
          cgst_percent: item.cgst_percent,
          sgst_percent: item.sgst_percent,
          igst_amount: item.igst_amount,
          cgst_amount: item.cgst_amount,
          sgst_amount: item.sgst_amount,
        })),
      });

      // ✅ Fetch Vendor Items for Dropdown
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const handleOpenDialogForApproval = (e,id_crypt) => {
    e.preventDefault();
    setIdCryptForApproval(id_crypt);
    setShowApprovalConfimation(true);
  };

  const handleApprovalSuccess = async(e) => {
    e.preventDefault();
     const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);    
    
    try {
      const response = await axios.put(`public/api/purchase-entries/approve/${idCryptForApproval}`, {},{
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      console.log(response, "response");
      
    fetchPurchaseEntriesApproval();
    setShowApprovalConfimation(false);
    triggerGlobalToast("Success", "Approved Successfully", "success");
  }
  catch (error) {
    console.log(error);
    triggerGlobalToast("Error", "Something went wrong", "error");
  }
  };

  const renderRow = (poEntry, index) => (
//   <>
//     <td className="px-6 py-4 whitespace-nowrap">{approvalDataPagination.from + index}</td>

//     <td className="px-6 py-4">
//       {poEntry.purchase_entry_number || "N/A"}
//     </td>

//     <td className="px-6 py-4">
//       {poEntry.created_at ? poEntry.created_at.split("T")[0] : "N/A"}
//     </td>

//  <td className="px-6 py-4">
//       {poEntry.vendor?.vendor_name || "N/A"}
//     </td>

//     <td className="px-6 py-4">
//       {poEntry.vendor_invoice_no || "N/A"}
//     </td>

//     <td className="px-6 py-4">
//       {poEntry.total_amount != null ? poEntry.total_amount : "N/A"}
//     </td>

//     <td
//       className={`px-6 py-4 font-semibold ${
//         poEntry.status === "Pending Approval"
//           ? "text-red-500"
//           : poEntry.status === "Approved"
//           ? "text-green-700"
//           : poEntry.status === "Direct"
//           ? "text-green-500"
//           : "text-yellow-500"
//       }`}
//     >
//       {poEntry.status || "N/A"}
//     </td>

//     <td className="px-6 py-4">
//       {poEntry.created_by?.name || "N/A"}
//     </td>

//     <td className="px-6 py-4 text-center">
//       <div className="flex justify-center gap-2">
//         {/* <button
//           className="bg-indigo-500 cursor-pointer hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
//           onClick={(e) => handleViewForPurchaseOrder(e, poEntry.id_crypt)}
//         >
//           View
//         </button> */}
//         <ViewButton onView={handleViewForPurchaseOrder} item={poEntry} />
//          <button
//          id="approvePoEntry"
//           className=" bg-green-500 cursor-pointer hover:bg-green-600 text-white px-2 py-1 rounded-md text-xs shadow"
//           onClick={(e) => handleOpenDialogForApproval(e, poEntry.id_crypt)}
//         >
//           <TiTick className="w-5 h-5"/>
//         </button>
//         <Tooltip
//         anchorSelect="#approvePoEntry"
//         content="Approve"
//         place={"top"}/>

//         <DeleteConfirmation
//           apiType="poEntry"
//           id_crypt={poEntry.id_crypt}
//           // fetchDatas={fetchPurchaseOrderEntriesData}
//           // setLoading={setLoading}
//           // loading={loading}
//         />
//       </div>
//     </td>
//   </>

<>
  <td className="px-6 py-4 whitespace-nowrap text-left">
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
      <FaHashtag className="text-gray-500" />
      {approvalDataPagination.from + index}
    </span>
  </td>

  <td className="px-6 py-4 text-left">
    {/* <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium"> */}
      {/* <FaFileInvoice className="text-indigo-600" /> */}
      {poEntry.purchase_entry_number || "N/A"}
    {/* </span> */}
  </td>

  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
      <FaCalendarAlt className="text-yellow-600" />
      {poEntry.created_at ? poEntry.created_at.split("T")[0] : "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1  text-blue-800 px-2 py-1 rounded text-xs font-medium">
      <FaUser className="text-blue-600" />
      {poEntry.vendor?.vendor_name || "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 text-left">
    {/* <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
      <FaFileAlt className="text-orange-600" /> */}
      {poEntry.vendor_invoice_no || "N/A"}
    {/* </span> */}
  </td>

  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
      <FaRupeeSign className="text-purple-600" />
      {poEntry.total_amount != null
        ? Number(poEntry.total_amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 font-semibold text-left">
    {poEntry.status === "Pending Approval" ? (
      <span className="inline-flex items-center gap-1 rounded bg-red-100 text-red-800 px-2 py-1 text-xs font-medium ring-1 ring-red-300">
        <FaClock className="text-red-500" />
        Pending Approval
      </span>
    ) : poEntry.status === "Approved" ? (
      <span className="inline-flex items-center gap-1 rounded bg-green-100 text-green-800 px-2 py-1 text-xs font-medium ring-1 ring-green-300">
        <FaCheckCircle className="text-green-600" />
        Approved
      </span>
    ) : poEntry.status === "Direct" ? (
      <span className="inline-flex items-center gap-1 rounded bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium ring-1 ring-blue-300">
        <FaArrowRight className="text-blue-600" />
        Direct
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium ring-1 ring-yellow-300">
        <FaQuestionCircle className="text-yellow-600" />
        {poEntry.status || "N/A"}
      </span>
    )}
  </td>

  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs font-medium">
      <FaUser className="text-pink-600" />
      {poEntry.created_by?.name || "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 text-center">
    <div className="flex justify-center gap-2">
      <ViewButton onView={handleViewForPurchaseOrder} item={poEntry} />

      <button
        id="approvePoEntry"
        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md text-xs shadow"
        onClick={(e) => handleOpenDialogForApproval(e, poEntry.id_crypt)}
      >
        <TiTick className="w-5 h-5" />
      </button>

      <Tooltip
        anchorSelect="#approvePoEntry"
        content="Approve"
        place="top"
      />

      <DeleteConfirmation
        apiType="poEntry"
        id_crypt={poEntry.id_crypt}
      />
    </div>
  </td>
</>

);

  return (
    <>

       <HeadersAndAddButton
            title={"Purchase Entries Pending Approvals"}
            description={"A list of all purchase entries pending approval"}
            approvalAddButton={true}
             buttonIcon={<FaExclamation />}
                    pdf={true}
                    pdfDownload={<FaDownload />}
                    pdfText={"Download Purchase Order Reports"}
          />

      <Table
        headers={headers}
        data={approvalDatas || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={approvalDataPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />

       {openDialogForPurchaseOrderEntries && (
        <PurchaseOrderEntriesDialogBox
          openDialogForPurchaseOrderEntries={openDialogForPurchaseOrderEntries}
          setOpenDialogForPurchaseOrderEntries={
            setOpenDialogForPurchaseOrderEntries
          }
          purchaseOrderEntriesInputs={purchaseOrderEntriesInputs}
          setPurchaseOrderEntriesInputs={setPurchaseOrderEntriesInputs}
          saveBtnForPurchaseOrderEntries={saveBtnForPurchaseOrderEntries}
          setSaveBtnForPurchaseOrderEntries={setSaveBtnForPurchaseOrderEntries}
          // fetchPurchaseOrderEntriesData={fetchPurchaseOrderEntriesData}/
          setEditIdForPurchaseOrderEntries={setEditIdForPurchaseOrderEntries}
          editIdForPurchaseOrderEntries={editIdForPurchaseOrderEntries}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          purchaseOrderEntriesPaginationData={
            purchaseOrderEntriesPaginationData
          }
          purchaseOrderEntriesFlag={true}
          collapsed={collapsed}
          setPoEntryLatestNumber={setPoEntryLatestNumber}
          poEntryLatestNumber={poEntryLatestNumber}
          purchaseOrderPendingDatas={purchaseOrderPendingDatas}
          setPurchaseOrderPendingDatas={setPurchaseOrderPendingDatas}
          // setPurchasePersonData={setPurchasePersonData}
          // purchasePersonData={purchasePersonData}
          setPoEntryEditdata={setPoEntryEditdata}
          poEntryEditdata={poEntryEditdata}
          setVendorAndItemData={setVendorAndItemData}
          vendorAndItemData={vendorAndItemData}
          setItemsFromVendor={setItemsFromVendor}
          // itemsFromVendor={itemsFromVendor}
        />
      )}

    {showApprovalConfimation && (
       <div>
      <Dialog open={showApprovalConfimation} onClose={() => setShowApprovalConfimation(false)} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded bg-red-100 sm:mx-0 sm:size-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    Approve
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to approve ? 
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleApprovalSuccess}
                  className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                >
                  Approve
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setShowApprovalConfimation(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
    )}
    

    </>
  );
}

export default PurchaseEntriesApproval;
