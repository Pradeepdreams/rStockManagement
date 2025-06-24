import React from "react";
import DeleteConfirmation from "../Utils/DeleteConfirmation";
import Table from "../Utils/Table";
import Pagination from "../Utils/Pagination";
import { getBranchDataFromBalaSilksDB } from "../Utils/indexDB";
import axios from "../Utils/AxiosInstance";
import { FaHashtag, FaFileInvoice, FaCalendarAlt, FaStore, FaFileAlt, FaRupeeSign, FaUser } from 'react-icons/fa';
import ViewButton from "../Utils/ViewButton";


function PurchaseOrderEntriesList({
  purchaseOrderEntriesPaginationData,
  setOpenDialogForPurchaseOrderEntries,
  setSaveBtnForPurchaseOrderEntries,
  setPurchaseOrderEntriesInputs,
  fetchPurchaseOrderEntriesData,
  setEditIdForPurchaseOrderEntries,
  setCurrentPage,
  setLoading,
  loading,
  setIsEditing,
  setPoEntryEditdata,
  setPurchaseOrderPendingDatas,
  setVendorAndItemData,
  setItemsFromVendor,
}) {
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

  // const handleViewForPurchaseOrder = async (e, id_crypt) => {

  //   e.preventDefault();

  //   setSaveBtnForPurchaseOrderEntries("update");
  //   setOpenDialogForPurchaseOrderEntries(true);
  //   setEditIdForPurchaseOrderEntries(id_crypt);
  //   setLoading(true);
  //   setIsEditing(true);

  //   const branchData = await getBranchDataFromBalaSilksDB();
  //   const branchIds = branchData.map((branch) => branch.branch.id_crypt);

  //   const token = localStorage.getItem("token");
  //   try {
  //     const responseForPoEditData = await axios.get(
  //       `public/api/purchase-entries/${id_crypt}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "X-Branch-Id": branchIds[0],
  //         },
  //       }
  //     );
  //     console.log(responseForPoEditData.data, "responseForPoEditData.data");

  //     const poEntryEditData = responseForPoEditData.data;
  //     setPoEntryEditdata(responseForPoEditData.data);

  //     setPurchaseOrderEntriesInputs({
  //        purchase_order_id:poEntryEditData.purchase_order_id,
  //   purchase_entry_number:poEntryEditData.purchase_entry_number,
  //   vendor_id:poEntryEditData.vendor_id,
  //   against_po:poEntryEditData.against_po === 1 ? true : false,
  //   vendor_invoice_no:poEntryEditData.vendor_invoice_no,
  //   vendor_invoice_date:poEntryEditData.vendor_invoice_date,
  //   sub_total_amount:poEntryEditData.sub_total_amount,
  //   gst_amount:poEntryEditData.gst_amount,
  //   total_amount:poEntryEditData.total_amount,
  //   purchase_person_id:poEntryEditData.purchase_person_id,
  //   mode_of_delivery:poEntryEditData.mode_of_delivery,
  //   logistic_id:poEntryEditData.logistic_id,
  //   remarks:poEntryEditData.remarks,
  //   vendor_invoice_image:poEntryEditData.vendor_invoice_image,
  //         items: poEntryEditData.items.map((item) => ({
  //         vendor_item_name:item.vendor_item_name,
  //         item_id:item.item_id,
  //         gst_percent:item.gst_percent,
  //         hsn_code:item.hsn_code,
  //         po_quantity:item.po_quantity,
  //         quantity:item.quantity,
  //         po_price:item.po_price,
  //         vendor_price:item.vendor_price,
  //         selling_price:item.selling_price,
  //         sub_total_amount:item.sub_total_amount,
  //         total_amount:item.total_amount,
  //         discount:item.discount,
  //         })),
  //       gst_details: poEntryEditData?.gst_details?.map((item) => ({

  //       gst_percent:item.gst_percent,
  //       igst_percent:item.igst_percent,
  //       cgst_percent:item.cgst_percent,
  //       sgst_percent:item.sgst_percent,
  //       igst_amount:item.igst_amount,
  //       cgst_amount:item.cgst_amount,
  //       sgst_amount:item.sgst_amount,
  //       })),
  //     });

  //   } catch (error) {
  //     console.log(error);

  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const renderRow = (poEntry, index) => (
    console.log(purchaseOrderEntriesPaginationData, "poEntry"),
    (
    <>
  <td className="px-6 py-4 whitespace-nowrap text-left">
    <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
      <FaHashtag className="text-gray-500" />
      {purchaseOrderEntriesPaginationData.from + index}
    </span>
  </td>

  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
      <FaFileInvoice className="text-indigo-600" />
      {poEntry.purchase_entry_number || "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 text-left">
    {/* <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium"> */}
      {/* <FaCalendarAlt className="text-yellow-600" /> */}
      {poEntry.created_at ? poEntry.created_at.split("T")[0] : "N/A"}
    {/* </span> */}
  </td>

  <td className="px-6 py-4 text-left">
    {/* <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium"> */}
      {/* <FaUser className="text-green-600" /> */}
      {poEntry.vendor?.vendor_name || "N/A"}
    {/* </span> */}
  </td>

  <td className="px-6 py-4 text-left">
    {/* <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium"> */}
      {/* <FaFileAlt className="text-orange-600" /> */}
      {poEntry.vendor_invoice_no || "N/A"}
    {/* </span> */}
  </td>

  <td className="px-6 py-4 text-left">
    {/* <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium"> */}
      {/* <FaRupeeSign className="text-purple-600" /> */}
      {poEntry.total_amount != null
        ? Number(poEntry.total_amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "N/A"}
    {/* </span> */}
  </td>

  <td className="px-6 py-4 font-semibold text-left">
    {poEntry.status === "Pending Approval" ? (
      <span className="inline-flex items-center rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-300">
        Pending Approval
      </span>
    ) : poEntry.status === "Approved" ? (
      <span className="inline-flex items-center rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-300">
        Approved
      </span>
    ) : poEntry.status === "Direct" ? (
      <span className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-300">
        Direct
      </span>
    ) : (
      <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-300">
        {poEntry.status || "N/A"}
      </span>
    )}
  </td>

  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-2  text-red-800 px-2 py-1 rounded text-xs font-medium">
      <FaUser className="text-red-600" />
      {poEntry.created_by?.name || "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 text-center">
    <div className="flex justify-center gap-2">
      {/* <button
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-md text-xs shadow"
        onClick={(e) => handleViewForPurchaseOrder(e, poEntry.id_crypt)}
      >
        View
      </button> */}
          <ViewButton onView={handleViewForPurchaseOrder} item={poEntry} />

    </div>
  </td>
</>


    )
  );

  return (
    <>
      <Table
        headers={headers}
        data={purchaseOrderEntriesPaginationData?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={purchaseOrderEntriesPaginationData}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default PurchaseOrderEntriesList;
