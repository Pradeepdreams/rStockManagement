import React, { useEffect, useState } from "react";
import { getBranchDataFromBalaSilksDB } from "../Utils/indexDB";
import axios from "../Utils/AxiosInstance";
import Loader from "../Utils/Loader";
import HeadersAndAddButton from "../Utils/HeadersAndAddButton";
import { errorDialog } from "../Context/ErrorContext";
import { useToast } from "../Context/ToastProvider";
import { useSearch } from "../Context/SearchContext";
import { usePurchaseOrderEntriesDialogContext } from "../Context/PurchaseOrderEntriesDialogContext";
import PurchaseOrderEntriesList from "./PurchaseOrderEntriesList";
import PurchaseOrderEntriesDialogBox from "./PurchaseOrderEntriesDialogBox";
import { useOutletContext } from "react-router-dom";
import { BsCartPlusFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa6";

function PurchaseOrderEntriesCreate() {
  const { collapsed } = useOutletContext();
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

  const { searchTerm } = useSearch();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const { checkAuthError } = errorDialog();
  const [poEntryEditdata, setPoEntryEditdata] = useState([]);

  const [purchaseOrderPendingDatas, setPurchaseOrderPendingDatas] =
    useState("");
  const [purchasePersonData, setPurchasePersonData] = useState([]);
  const [vendorAndItemData, setVendorAndItemData] = useState([]);
  const [itemsFromVendor, setItemsFromVendor] = useState([]);

  const { triggerToast } = useToast();

  const fetchPurchaseOrderEntriesData = async (page = 1) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page,
      // search: searchTerm,
    });

    try {
      const response = await axios.get(`public/api/pincodes/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      const responseForPoEntryList = await axios.get(
        `public/api/purchase-entries?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForPoEntryList, "responseForPoEntryList");
      setPurchaseOrderEntriesPaginationData(
        responseForPoEntryList.data.purchase_entries
      );

      const responseForPoEntryLatestNumber = await axios.get(
        `public/api/purchase-entries/latest-number`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      setPoEntryLatestNumber(
        responseForPoEntryLatestNumber.data.original.purchase_entry_number
      );

      // const responseForPendingPoEntry = await axios.get(
      //   `public/api/purchase-orders/pending`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "X-Branch-Id": branchIds[0],
      //     },
      //   }
      // );
      // console.log(responseForPendingPoEntry, "responseForPendingPoEntry");
      // setPurchaseOrderPendingDatas(responseForPendingPoEntry.data);

      fetchPurchaseOrderPendingData();

      const responseForEmployee = await axios.get(`public/api/employees/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      console.log(responseForEmployee.data, "emploee");
      setPurchasePersonData(responseForEmployee.data);

      // setPoEntryLatestNumber(responseForPendingPoEntry.data.original.purchase_entry_number);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      checkAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrderEntriesData(currentPage);
  }, [currentPage]);

  const fetchPurchaseOrderPendingData = async () => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");
    try {
      const responseForPendingPoEntry = await axios.get(
        `public/api/purchase-orders/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForPendingPoEntry, "responseForPendingPoEntry");
      setPurchaseOrderPendingDatas(responseForPendingPoEntry.data);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      checkAuthError(error);
    }
  };

  const searchPoEntriesFetch = async (searchTerm, page = 1) => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      page,
      search: searchTerm,
    });
    try {
      const responseForPoEntries = await axios.get(
        `public/api/purchase-entries?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setPurchaseOrderEntriesPaginationData(
        responseForPoEntries.data.purchase_entries
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  };
  console.log(currentPage, "current page");

  useEffect(() => {
    searchPoEntriesFetch(searchTerm, currentPage);
  }, [searchTerm]);

  const handleAddForPurchaseOrderEntries = () => {
    setOpenDialogForPurchaseOrderEntries(true);
    setPoEntryEditdata("");
    fetchPurchaseOrderPendingData();
    setSaveBtnForPurchaseOrderEntries("save");
    setEditIdForPurchaseOrderEntries("");
    setIsEditing(false);
    setPurchaseOrderEntriesInputs({
      purchase_order_id: "",
      purchase_entry_number: poEntryLatestNumber,
      vendor_id: "",
      against_po: "1",
      vendor_invoice_no: "",
      vendor_invoice_date: "",
      sub_total_amount: "",
      gst_amount: "",
      total_amount: "",
      purchase_person_id: "",
      mode_of_delivery: "",
      logistic_id: "",
      remarks: "",
      //   "vendor_invoice_image": "uploads/invoices/invoice-4567.png",

      items: [
        {
          po_item_id: "",
          vendor_item_name: "",
          item_id: "",
          gst_percent: "",
          hsn_code: "",
          po_quantity: "",
          quantity: "",
          po_price: "",
          vendor_price: "",
          selling_price: "",
          sub_total_amount: "",
          total_amount: "",
        },
      ],
      gst_details: [
        {
          gst_percent: "",
          igst_percent: "",
          cgst_percent: "",
          sgst_percent: "",
          igst_amount: "",
          cgst_amount: "",
          sgst_amount: "",
        },
      ],
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Purchase Entries"
        description="A list of all purchase entries."
        buttonName="Add Purchase Entry"
        setOpenDialogForPurchaseOrderEntries={
          setOpenDialogForPurchaseOrderEntries
        }
        handleDialogOpen={handleAddForPurchaseOrderEntries}
        buttonIcon={<BsCartPlusFill />}
        // pdf={true}
        // pdfDownload={<FaDownload />}
        // pdfText={"Download Purchase Order Reports"}
      />

      <PurchaseOrderEntriesList
        purchaseOrderEntriesPaginationData={purchaseOrderEntriesPaginationData}
        setOpenDialogForPurchaseOrderEntries={
          setOpenDialogForPurchaseOrderEntries
        }
        setSaveBtnForPurchaseOrderEntries={setSaveBtnForPurchaseOrderEntries}
        setPurchaseOrderEntriesInputs={setPurchaseOrderEntriesInputs}
        fetchPurchaseOrderEntriesData={fetchPurchaseOrderEntriesData}
        setEditIdForPurchaseOrderEntries={setEditIdForPurchaseOrderEntries}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
        setPoEntryEditdata={setPoEntryEditdata}
        setPurchaseOrderPendingDatas={setPurchaseOrderPendingDatas}
        poEntryEditdata={poEntryEditdata}
        setVendorAndItemData={setVendorAndItemData}
        setItemsFromVendor={setItemsFromVendor}
        itemsFromVendor={itemsFromVendor}
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
          fetchPurchaseOrderEntriesData={fetchPurchaseOrderEntriesData}
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
          setPurchasePersonData={setPurchasePersonData}
          purchasePersonData={purchasePersonData}
          setPoEntryEditdata={setPoEntryEditdata}
          poEntryEditdata={poEntryEditdata}
          setVendorAndItemData={setVendorAndItemData}
          vendorAndItemData={vendorAndItemData}
          setItemsFromVendor={setItemsFromVendor}
          itemsFromVendor={itemsFromVendor}
        />
      )}
    </>
  );
}

export default PurchaseOrderEntriesCreate;
