import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowPathRoundedSquareIcon,
  CalendarDateRangeIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  NumberedListIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Select from "react-select";
import { getBranchDataFromBalaSilksDB } from "../Utils/indexDB";
import axios from "../Utils/AxiosInstance";
import { triggerGlobalToast } from "../Utils/GlobalToast";
import { useToast } from "../Context/ToastProvider";
import SaveButton from "../Utils/SaveButton";

function PurchaseOrderEntriesDialogBox({
  openDialogForPurchaseOrderEntries,
  setOpenDialogForPurchaseOrderEntries,
  purchaseOrderEntriesInputs,
  setPurchaseOrderEntriesInputs,
  saveBtnForPurchaseOrderEntries,
  editIdForPurchaseOrderEntries,
  fetchPurchaseOrderEntriesData,
  isEditing,
  setIsEditing,
  collapsed,
  purchaseOrderPendingDatas,
  setPurchaseOrderPendingDatas,
  purchasePersonData,
  poEntryLatestNumber,
  poEntryEditdata,
  setVendorAndItemData,
  vendorAndItemData,
  setItemsFromVendor,
  itemsFromVendor,
}) {
  const [requiredFields, setRequiredFields] = useState({
    against_po: "",
    purchase_order_id: "",
    purchase_entry_number: "",
    vendor_id: "",
    igst_amount: "",
    sgst_amount: "",
    cgst_amount: "",
    sub_total_amount: "",
    gst_amount: "",
    total_amount: "",
    purchase_person_id: "",
    mode_of_delivery: "",
    logistics: "",
  });

  const [activeTab, setActiveTab] = useState("purchase");
  const [showPoNumber, setShowPoNumber] = useState(true);
  const [showPurchasePerson, setShowPurchasePerson] = useState(true);
  const [vendorsData, setVendorsData] = useState([]);
  const [logisticsDatas, setLogisticsDatas] = useState([]);

  const [openWarningDialogForVendor, setOpenWarningDialogForVendor] =
    useState(false);
  const [showFileName, setShowFileName] = useState(null);
  const [previousVendorId, setPreviousVendorId] = useState(null);
  const [poEntryIdNumber, setPoEntryIdNumber] = useState(null);
  const [vendorIdCrypt, setVendorIdCrypt] = useState(null);

  const { triggerToast } = useToast();

  const imageRef = useRef(null);

  useEffect(() => {
    if (poEntryEditdata && poEntryEditdata.vendor_invoice_image) {
      console.log(poEntryEditdata, "poEntryEditdata create");

      setPurchaseOrderEntriesInputs((prev) => ({
        ...prev,
        vendor_invoice_image: poEntryEditdata.vendor_invoice_image,

        // ... other fields
      }));

      // ✅ Extract file name from backend path and set
      const fileName = poEntryEditdata.vendor_invoice_image.split("/").pop();
      setShowFileName(fileName); // <-- This is the missing part
    }
  }, [poEntryEditdata]);

  // useEffect(() => {

  //   if (poEntryEditdata) {
  //     setPoEntryIdNumber(poEntryEditdata.purchase_order_id);

  //     const getPoEntryMatcheddata = purchaseOrderPendingDatas.filter(
  //       (item) => Number(item.id) === Number(poEntryEditdata.purchase_order_id)
  //     );
  //     setPurchaseOrderPendingDatas(getPoEntryMatcheddata);

  //     // You can do something with getPoEntryMatcheddata if needed
  //     console.log(getPoEntryMatcheddata, "Matched PO Entry Data");
  //   }
  // }, [poEntryEditdata]);

  const fetchPoEntiresRelatedDatas = async () => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");

    try {
      const responseForVendors = await axios.get(`public/api/vendors/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      setVendorsData(responseForVendors.data);

      console.log(responseForVendors.data, "responseForVendors.data");

      const responseForLogisticsList = await axios.get(
        `public/api/logistics/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      setLogisticsDatas(responseForLogisticsList.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    try {
      fetchPoEntiresRelatedDatas();
    } catch (err) {
      console.log("Effect error:", err);
    }
  }, []);

  useEffect(() => {
    if (openDialogForPurchaseOrderEntries) {
      fetchPoEntiresRelatedDatas();
    }
  }, [openDialogForPurchaseOrderEntries]);

  const modeOfDeliveryData = [
    { value: "hand", label: "By Hand" },
    { value: "parcel", label: "Parcel" },
  ];

  const handleCloseForDialog = () => {
    setOpenDialogForPurchaseOrderEntries(false);
  };

  const vendorFunction = async (id_crypt) => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    setVendorIdCrypt(id_crypt);

    console.log(vendorIdCrypt, "vendorIdCrypt");

    try {
      if (purchaseOrderEntriesInputs?.purchase_order_id) {
        if (!openWarningDialogForVendor) {
          setPreviousVendorId(purchaseOrderEntriesInputs.vendor_id);
        }
        setOpenWarningDialogForVendor(true);
      } else {
        if (purchaseOrderEntriesInputs?.against_po == "1") {
          const res = await axios.get(
            `public/api/purchase-orders/vendors/${id_crypt}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "X-Branch-Id": branchIds[0],
              },
            }
          );
          setPurchaseOrderPendingDatas(res.data);
        } else {
           const resFroVendorItems = await axios.get(
            `public/api/vendors/${id_crypt}`,
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
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }

    return;
  };

  const handleChangeForPurchaseOrderEntries = async (e, index) => {
    const { name, value, id_crypt, files, type, item } = e.target;
    console.log(name, value);
    console.log(item, "item");

    setVendorIdCrypt(id_crypt);

    // 📸 File Upload
    if (type === "file" && files?.length > 0) {
      const file = files[0];
      setShowFileName(file.name);
      setPurchaseOrderEntriesInputs((prevState) => ({
        ...prevState,
        vendor_invoice_image: file,
      }));
      return;
    }

    // 🌿 Get Branch Data
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((b) => b.branch.id_crypt);

    // Clone items array
    let updatedItems = [...purchaseOrderEntriesInputs.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };

    if (name === "vendor_id") {
      setVendorIdCrypt(id_crypt);
      vendorFunction(id_crypt);
    }

    if (name === "purchase_order_id") {
      setPurchaseOrderEntriesInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
      try {
        const res = await axios.get(`public/api/purchase-orders/${id_crypt}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Branch-Id": branchIds[0],
          },
        });

        const getGstIn = res.data?.vendor?.gst_in || "";

        setVendorAndItemData(res.data);

        setPurchaseOrderEntriesInputs((prev) => ({
          ...prev,
          logistic_id: res.data.logistic_id,
          mode_of_delivery: res.data.mode_of_delivery,
          purchase_person_id: res.data.created_by?.id,
          vendor_id: res.data.vendor?.id,
          vendor_gst_in: getGstIn,
        }));
      } catch (err) {
        console.error("Error fetching PO details:", err);
      }

      return;
    }

    // 🧾 Against PO logic
    if (name === "against_po") {
      setShowPurchasePerson(true);
      if (value == "0") {
        try {
        console.log(vendorIdCrypt, "vendorIdCrypt");

          const resFroVendorItems = await axios.get(
            `public/api/vendors/${vendorIdCrypt}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "X-Branch-Id": branchIds[0],
              },
            }
          );
          console.log(resFroVendorItems.data.items, "item vendor");
          setItemsFromVendor(resFroVendorItems.data.items);
        } catch (error) {
          console.log(error);
        }

        setPurchaseOrderEntriesInputs((prev) => ({
          ...prev,
          // [name]: value,
          purchase_order_id: null,
        }));
      } else {
        console.log(vendorIdCrypt, "vendorIdCrypt");
         vendorFunction(vendorIdCrypt);
      }
    }

    // 🔄 General fallback update
    setPurchaseOrderEntriesInputs((prev) => ({
      ...prev,
      items: updatedItems,
      ...((name === "item_id" ||
        name === "quantity" ||
        name === "vendor_price") && {
        sub_total_amount: updatedItems.reduce(
          (acc, i) => acc + (i.sub_total_amount || 0),
          0
        ),
      }),
      [name]: value,
    }));

    // 🧾 ITEM_ID selection
    if (name === "item_id") {
      let gstPercent = 0;
      if (purchaseOrderEntriesInputs?.against_po === "0") {
        const itembasedGst = itemsFromVendor.find((item) => item.id == value);

        gstPercent = Number(
          itembasedGst?.category?.active_gst_percent?.gst_percent || 0
        );
      } else {
        gstPercent = Number(item?.gst_percent || 0);
      }

      const getGstIn = purchaseOrderEntriesInputs?.vendor_gst_in || "";
      const gstFirstTwo = getGstIn.substring(0, 2);

      let cgst = 0,
        sgst = 0,
        igst = 0,
        gstType = "";

      if (gstFirstTwo === "33") {
        cgst = gstPercent / 2;
        sgst = gstPercent / 2;
        gstType = "cgst_sgst";
      } else {
        igst = gstPercent;
        gstType = "igst";
      }

      const quantity = 0;
      const vendorPrice = 0;
      const discount = 0;

      const baseAmount = quantity * vendorPrice;
      const discountAmount = discount > 0 ? (baseAmount * discount) / 100 : 0;
      const finalSubTotal = baseAmount - discountAmount;

      const cgstAmount = (finalSubTotal * cgst) / 100;
      const sgstAmount = (finalSubTotal * sgst) / 100;
      const igstAmount = (finalSubTotal * igst) / 100;

      const totalAmount = finalSubTotal + cgstAmount + sgstAmount + igstAmount;
      const gstAmount = cgstAmount + sgstAmount + igstAmount;

      updatedItems[index] = {
        ...updatedItems[index],
        [name]: value,
        id_crypt,
        po_item_id: item?.id,
        vendor_item_name: "",
        gst_percent: gstPercent,
        gst_amount: gstAmount?.toFixed(2),
        hsn_code: item?.hsn_code
          ? item?.hsn_code
          : item.category?.active_hsn_code?.hsn_code,
        po_quantity: item?.pending_quantity ? item?.pending_quantity : 0,
        quantity: "",
        po_price: item?.item_price ? item?.item_price : 0,
        vendor_price: "",
        selling_price: "",
        sub_total_amount: finalSubTotal?.toFixed(2),
        total_amount: totalAmount?.toFixed(2),
      };

      let updatedGstDetails = [
        ...(purchaseOrderEntriesInputs.gst_details || []),
      ];
      updatedGstDetails[index] = {
        gst_percent: gstPercent,
        igst_percent: igst,
        cgst_percent: cgst,
        sgst_percent: sgst,
        igst_amount: Number(igstAmount.toFixed(2)),
        cgst_amount: Number(cgstAmount.toFixed(2)),
        sgst_amount: Number(sgstAmount.toFixed(2)),
      };

      setPurchaseOrderEntriesInputs((prev) => ({
        ...prev,
        items: updatedItems,
        // gst_details: updatedGstDetails,
        // gst_type: gstType,
        // sub_total_amount: updatedItems.reduce(
        //   (acc, i) => acc + Number(i.sub_total_amount || 0),
        //   0
        // ),
        // total_amount:
        //   updatedItems.reduce(
        //     (acc, i) => acc + Number(i.sub_total_amount || 0),
        //     0
        //   ) +
        //   updatedGstDetails.reduce(
        //     (acc, i) => acc + Number(i.igst_amount || 0),
        //     0
        //   ) +
        //   updatedGstDetails.reduce(
        //     (acc, i) => acc + Number(i.cgst_amount || 0),
        //     0
        //   ) +
        //   updatedGstDetails.reduce(
        //     (acc, i) => acc + Number(i.sgst_amount || 0),
        //     0
        //   ),
      }));

      return;
    }

    // 🔁 QUANTITY / VENDOR_PRICE / DISCOUNT change
    if (["quantity", "vendor_price", "discount"].includes(name)) {
      const selectedItem = updatedItems[index];

      console.log(selectedItem, "selectedItem");

      const quantity =
        name === "quantity"
          ? Number(value)
          : Number(selectedItem?.quantity || 0);
      const vendorPrice =
        name === "vendor_price"
          ? Number(value)
          : Number(selectedItem?.vendor_price || 0);
      const discount =
        name === "discount"
          ? Number(value)
          : Number(selectedItem?.discount || 0);

      const baseAmount = quantity * vendorPrice;
      const discountAmount = discount > 0 ? (baseAmount * discount) / 100 : 0;
      const finalSubTotal = baseAmount - discountAmount;

      const gstPercent = Number(selectedItem?.gst_percent || 0);
      let getGstIn = "";
      console.log(vendorAndItemData, "vendorAndItemData");

      if (editIdForPurchaseOrderEntries) {
        getGstIn = vendorAndItemData?.vendor.gst_in || "";
      } else {
        getGstIn = purchaseOrderEntriesInputs?.vendor_gst_in || "";
      }

      console.log(getGstIn, "getGstIn");

      const gstFirstTwo = getGstIn.substring(0, 2);
      console.log(gstFirstTwo, "gstFirstTwo");

      let cgst = 0,
        sgst = 0,
        igst = 0,
        gstType = "";

      if (gstFirstTwo === "33") {
        cgst = gstPercent / 2;
        sgst = gstPercent / 2;
        gstType = "cgst_sgst";
      } else {
        igst = gstPercent;
        gstType = "igst";
      }

      const cgstAmount = (finalSubTotal * cgst) / 100;
      const sgstAmount = (finalSubTotal * sgst) / 100;
      const igstAmount = (finalSubTotal * igst) / 100;
      const totalAmount = finalSubTotal + cgstAmount + sgstAmount + igstAmount;
      const gstAmount = cgstAmount + sgstAmount + igstAmount;
      console.log(gstAmount, "gstAmount");

      updatedItems[index] = {
        ...selectedItem,
        [name]: value,
        sub_total_amount: finalSubTotal?.toFixed(2),
        total_amount: totalAmount?.toFixed(2),
        gst_amount: gstAmount?.toFixed(2),
      };

      let updatedGstDetails = [
        ...(purchaseOrderEntriesInputs.gst_details || []),
      ];
      updatedGstDetails[index] = {
        gst_percent: gstPercent,
        igst_percent: igst,
        cgst_percent: cgst,
        sgst_percent: sgst,
        igst_amount: Number(igstAmount.toFixed(2)),
        cgst_amount: Number(cgstAmount.toFixed(2)),
        sgst_amount: Number(sgstAmount.toFixed(2)),
      };

      setPurchaseOrderEntriesInputs((prev) => {
        const subTotal = updatedItems.reduce(
          (acc, i) => acc + Number(i.sub_total_amount || 0),
          0
        );

        const gstIgst = updatedGstDetails.reduce(
          (acc, i) => acc + Number(i.igst_amount || 0),
          0
        );
        const gstCgst = updatedGstDetails.reduce(
          (acc, i) => acc + Number(i.cgst_amount || 0),
          0
        );
        const gstSgst = updatedGstDetails.reduce(
          (acc, i) => acc + Number(i.sgst_amount || 0),
          0
        );

        const totalAmount = parseFloat(
          (subTotal + gstIgst + gstCgst + gstSgst)?.toFixed(2)
        );

        const gsttotal = updatedItems.reduce(
          (acc, item) => acc + Number(item.gst_amount),
          0
        );

        return {
          ...prev,
          items: updatedItems,
          gst_details: updatedGstDetails,
          gst_amount: gsttotal,
          gst_type: gstType,
          sub_total_amount: parseFloat(subTotal?.toFixed(2)),
          total_amount: totalAmount,
        };
      });

      return;
    }
  };

  const handleAddItems = () => {
    const poEntriesItems = Array.isArray(purchaseOrderEntriesInputs.items)
      ? purchaseOrderEntriesInputs.items
      : [];

    const newEntry = [
      ...poEntriesItems,
      {
        item_id: "",
        quantity: "",
        item_price: "",
      },
    ];

    setPurchaseOrderEntriesInputs((prev) => ({
      ...prev,
      items: newEntry,
    }));
  };

  // const handleDeleteItem = (index) => {
  //   const previousItems = Array.isArray(purchaseOrderEntriesInputs.items)
  //     ? purchaseOrderEntriesInputs.items
  //     : [];

  //   const previousGstDetails = Array.isArray(
  //     purchaseOrderEntriesInputs.gst_details
  //   )
  //     ? purchaseOrderEntriesInputs.gst_details
  //     : [];

  //   const updatedItems = [...previousItems];
  //   updatedItems.splice(index, 1);

  //   const updatedGstDetails = [...previousGstDetails];
  //   updatedGstDetails.splice(index, 1);

  //   setPurchaseOrderEntriesInputs((prev) => ({
  //     ...prev,
  //     items: updatedItems,
  //     gst_details: updatedGstDetails,
  //     sub_total_amount: updatedItems.reduce(
  //       (acc, i) => acc + (i.sub_total_amount || 0),
  //       0
  //     ),
  //     total_amount:
  //       updatedItems.reduce((acc, i) => acc + (i.sub_total_amount || 0), 0) +
  //       (updatedGstDetails.reduce((acc, i) => acc + (i.igst_amount || 0), 0) +
  //         updatedGstDetails.reduce((acc, i) => acc + (i.cgst_amount || 0), 0) +
  //         updatedGstDetails.reduce((acc, i) => acc + (i.sgst_amount || 0), 0)),
  //   }));
  // };

  const handleDeleteItem = (index) => {
    const previousItems = Array.isArray(purchaseOrderEntriesInputs.items)
      ? purchaseOrderEntriesInputs.items
      : [];

    const previousGstDetails = Array.isArray(
      purchaseOrderEntriesInputs.gst_details
    )
      ? purchaseOrderEntriesInputs.gst_details
      : [];

    const updatedItems = [...previousItems];
    updatedItems.splice(index, 1);

    const updatedGstDetails = [...previousGstDetails];
    updatedGstDetails.splice(index, 1);

    const subTotal = updatedItems.reduce(
      (acc, i) => acc + (parseFloat(i.sub_total_amount) || 0),
      0
    );

    const gstIgst = updatedGstDetails.reduce(
      (acc, i) => acc + (parseFloat(i.igst_amount) || 0),
      0
    );
    const gstCgst = updatedGstDetails.reduce(
      (acc, i) => acc + (parseFloat(i.cgst_amount) || 0),
      0
    );
    const gstSgst = updatedGstDetails.reduce(
      (acc, i) => acc + (parseFloat(i.sgst_amount) || 0),
      0
    );

    const totalAmount = parseFloat(
      (subTotal + gstIgst + gstCgst + gstSgst).toFixed(2)
    );

    setPurchaseOrderEntriesInputs((prev) => ({
      ...prev,
      items: updatedItems,
      gst_details: updatedGstDetails,
      sub_total_amount: parseFloat(subTotal.toFixed(2)),
      total_amount: totalAmount,
    }));
  };

  const handlePrintImage = () => {
    const img = imageRef.current;
    if (!img) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Image</title>
        <style>
          body { margin: 0; text-align: center; }
          img { max-width: 100%; max-height: 100vh; }
        </style>
      </head>
      <body>
        <img src="${img.src}" />
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
  };

  const handleSubmitForPurchaseOrderEntries = async () => {
    const formData = new FormData();

    // 1️⃣ Append top-level form fields
    formData.append(
      "purchase_order_id",
      purchaseOrderEntriesInputs.purchase_order_id
    );
    formData.append(
      "purchase_entry_number",
      purchaseOrderEntriesInputs.purchase_entry_number
    );
    formData.append("vendor_id", purchaseOrderEntriesInputs.vendor_id);
    formData.append("against_po", purchaseOrderEntriesInputs.against_po);
    formData.append(
      "vendor_invoice_no",
      purchaseOrderEntriesInputs.vendor_invoice_no
    );
    formData.append(
      "vendor_invoice_date",
      purchaseOrderEntriesInputs.vendor_invoice_date
    );
    formData.append(
      "sub_total_amount",
      purchaseOrderEntriesInputs.sub_total_amount
    );
    formData.append("gst_amount", purchaseOrderEntriesInputs.gst_amount);
    formData.append("total_amount", purchaseOrderEntriesInputs.total_amount);
    formData.append(
      "purchase_person_id",
      purchaseOrderEntriesInputs.purchase_person_id
    );
    formData.append(
      "mode_of_delivery",
      purchaseOrderEntriesInputs.mode_of_delivery
    );
    formData.append("logistic_id", purchaseOrderEntriesInputs.logistic_id);
    formData.append("remarks", purchaseOrderEntriesInputs.remarks);

    // 2️⃣ Upload vendor invoice image
    if (purchaseOrderEntriesInputs.vendor_invoice_image) {
      formData.append(
        "vendor_invoice_image",
        purchaseOrderEntriesInputs.vendor_invoice_image
      );
    }

    // 3️⃣ Append items and GST details as JSON
    // formData.append("items", JSON.stringify(purchaseOrderEntriesInputs.items));
    // formData.append("gst_details", JSON.stringify(purchaseOrderEntriesInputs.gst_details));

    purchaseOrderEntriesInputs.items.forEach((item, i) => {
      Object.keys(item).forEach((key) => {
        formData.append(`items[${i}][${key}]`, item[key]);
      });
    });

    purchaseOrderEntriesInputs.gst_details.forEach((gstDetail, i) => {
      Object.keys(gstDetail).forEach((key) => {
        formData.append(`gst_details[${i}][${key}]`, gstDetail[key]);
      });
    });

    // 4️⃣ Debug: Show all form values
    console.log("📤 Submitting Purchase Order Entry:");
    for (let [key, val] of formData.entries()) {
      console.log(`${key}:`, val);
    }

    try {
      const token = localStorage.getItem("token");
      const branchData = await getBranchDataFromBalaSilksDB();
      const branchIds = branchData.map((branch) => branch.branch.id_crypt);

      const response = await axios.post(
        `public/api/purchase-entries`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
            "Content-Type": "multipart/form-data",
          },
        }
      );

      triggerGlobalToast(
        "Success",
        "Purchase Order Entry added successfully.",
        "success"
      );
      fetchPurchaseOrderEntriesData();
      setOpenDialogForPurchaseOrderEntries(false);
    } catch (error) {
      setRequiredFields(error.response.data.errors);
      triggerToast("Create failed!", error.response?.data?.message, "error");
      console.error("❌ API Error:", error);
    }
  };

  const handleUpdateForPurchaseOrderEntries = async () => {
    const formData = new FormData();

    // 1️⃣ Append top-level form fields
    formData.append(
      "purchase_order_id",
      purchaseOrderEntriesInputs.purchase_order_id
    );
    formData.append(
      "purchase_entry_number",
      purchaseOrderEntriesInputs.purchase_entry_number
    );
    formData.append("vendor_id", purchaseOrderEntriesInputs.vendor_id);
    formData.append("against_po", purchaseOrderEntriesInputs.against_po);
    formData.append(
      "vendor_invoice_no",
      purchaseOrderEntriesInputs.vendor_invoice_no
    );
    formData.append(
      "vendor_invoice_date",
      purchaseOrderEntriesInputs.vendor_invoice_date
    );
    formData.append(
      "sub_total_amount",
      purchaseOrderEntriesInputs.sub_total_amount
    );
    formData.append("gst_amount", purchaseOrderEntriesInputs.gst_amount);
    formData.append("total_amount", purchaseOrderEntriesInputs.total_amount);
    formData.append(
      "purchase_person_id",
      purchaseOrderEntriesInputs.purchase_person_id
    );
    formData.append(
      "mode_of_delivery",
      purchaseOrderEntriesInputs.mode_of_delivery
    );
    formData.append("logistic_id", purchaseOrderEntriesInputs.logistic_id);
    formData.append("remarks", purchaseOrderEntriesInputs.remarks);

    // 2️⃣ Upload vendor invoice image
    if (purchaseOrderEntriesInputs.vendor_invoice_image) {
      formData.append(
        "vendor_invoice_image",
        purchaseOrderEntriesInputs.vendor_invoice_image
      );
    }

    const fileOrUrl = purchaseOrderEntriesInputs.vendor_invoice_image;
    if (fileOrUrl && typeof fileOrUrl === "object") {
      // it's a File object
      formData.append("vendor_invoice_image", fileOrUrl);
    } else if (typeof fileOrUrl === "string") {
      // it's a string path (probably from DB)
      formData.append("vendor_invoice_image_url", fileOrUrl); // 👈 use a different key
    }

    // 3️⃣ Append items and GST details as JSON
    // formData.append("items", JSON.stringify(purchaseOrderEntriesInputs.items));
    // formData.append("gst_details", JSON.stringify(purchaseOrderEntriesInputs.gst_details));

    purchaseOrderEntriesInputs.items.forEach((item, i) => {
      Object.keys(item).forEach((key) => {
        formData.append(`items[${i}][${key}]`, item[key]);
      });
    });

    purchaseOrderEntriesInputs.gst_details.forEach((gstDetail, i) => {
      Object.keys(gstDetail).forEach((key) => {
        formData.append(`gst_details[${i}][${key}]`, gstDetail[key]);
      });
    });

    // 4️⃣ Debug: Show all form values
    console.log("📤 Submitting Purchase Order Entry:");
    for (let [key, val] of formData.entries()) {
      console.log(`${key}:`, val);
    }

    try {
      const token = localStorage.getItem("token");
      const branchData = await getBranchDataFromBalaSilksDB();
      const branchIds = branchData.map((branch) => branch.branch.id_crypt);

      const response = await axios.post(
        `public/api/purchase-entries/update/${editIdForPurchaseOrderEntries}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
            "Content-Type": "multipart/form-data",
          },
        }
      );

      triggerGlobalToast(
        "Success",
        "Purchase Order Entry updated successfully.",
        "success"
      );
      fetchPurchaseOrderEntriesData();
      setOpenDialogForPurchaseOrderEntries(false);
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  };

  const handleDeletePoEntryTypedData = () => {
    console.log(vendorIdCrypt, "vendorIdCrypt");
    vendorFunction(vendorIdCrypt);
    setPurchaseOrderEntriesInputs((prev) => ({
      ...prev,
      purchase_order_id: "",
      purchase_entry_number: poEntryLatestNumber,
      vendor_id: "",
      against_po: 1,
      vendor_invoice_no: "",
      vendor_invoice_date: "",
      sub_total_amount: "",
      gst_amount: "",
      total_amount: "",
      purchase_person_id: "",
      mode_of_delivery: "",
      logistic_id: "",
      remarks: "",
      vendor_invoice_image: "",

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
    }));
    setOpenWarningDialogForVendor(false);
  };

  console.log(previousVendorId, "previousVendorId");

  const handleWarningDialogClose = () => {
    console.log(previousVendorId, "previousVendorId for check");

    setPurchaseOrderEntriesInputs((prev) => ({
      ...prev,
      vendor_id: previousVendorId,
    }));
    setOpenWarningDialogForVendor(false);
  };

  const handleChangeForPurchaseOrderEntriesChecking = (e) => {
    const { name, value } = e.target;
    setPurchaseOrderEntriesInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      {openDialogForPurchaseOrderEntries && (
        <Dialog
          open={openDialogForPurchaseOrderEntries}
          onClose={() => {}}
          className="relative z-50"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

          <div
            className={`fixed inset-0 overflow-y-auto transition-all duration-400 ${
              collapsed ? "lg:ml-20" : "lg:ml-72"
            }`}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-10">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100  pb-4 text-left shadow-xl transition-all sm:my-8 w-full sm:w-full sm:max-w-7xl sm:p-0">
                <div className="bg-[var(--dialog-bgcolor)] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Purchase Entries
                  </h2>
                  <div className="flex gap-1">
                    {editIdForPurchaseOrderEntries && (
                      <PencilSquareIcon
                        onClick={() => setIsEditing(false)}
                        className="h-5 w-5  cursor-pointer transition"
                      />
                    )}

                    <XMarkIcon
                      onClick={handleCloseForDialog}
                      className="h-5 w-5  cursor-pointer transition"
                    />
                  </div>
                </div>
                <div className="m-4 bg-white border rounded-md border-gray-200 p-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
                    {activeTab === "purchase" && (
                      <>
                        <div className="col-span-1  sm:mt-4">
                          <label className="flex items-center gap-1 block text-sm font-medium text-gray-700 mb-1">
                            <NumberedListIcon className="h-5 w-5 text-gray-400" />
                            <h4>Purchase Entry No</h4>
                            <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="purchase_entry_number"
                            value={
                              purchaseOrderEntriesInputs?.purchase_entry_number
                            }
                            onChange={handleChangeForPurchaseOrderEntries}
                            disabled
                            className={`mt-1 w-full bg-gray-100 cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          />

                          {requiredFields.purchase_entry_number && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.purchase_entry_number[0]}
                            </p>
                          )}
                        </div>

                        {/* <div
                          className={`mt-2 sm:mt-4 w-full col-span-1 ${
                            showPoNumber ? "col-span-1" : "col-span-2"
                          }`}
                        >
                          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <h4>Vendor</h4>
                            <span className="text-red-400">*</span>
                          </label>
                          <div>
                            <Select
                              name="vendor_id"
                              options={vendorsData.map((vendor) => ({
                                value: vendor.id,
                                label: vendor.vendor_name,
                                id_crypt: vendor.id_crypt,
                              }))}
                              value={
                                vendorsData
                                  ?.filter(
                                    (item) =>
                                      Number(item.id) ===
                                      Number(purchaseOrderEntriesInputs?.vendor_id)
                                  )
                                  .map((item) => {
                                    console.log(item, "item");
                                    
                                    return{
                                       value: item.id,
                                    label: item.vendor_name,
                                    }
                                   
                                  })[0] || null
                              }
                           

                              onChange={(selectedOption) => {
                                console.log("Selected vendor:", selectedOption);
                                handleChangeForPurchaseOrderEntries({
                                  target: {
                                    name: "vendor_id",
                                    value: selectedOption
                                      ? selectedOption.value
                                      : null,
                                    id_crypt: selectedOption
                                      ? selectedOption.id_crypt
                                      : null,
                                  },
                                });
                              }}
                              className="w-full mt-2"
                              classNamePrefix="select"
                              isDisabled={isEditing}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                          </div>
                          {requiredFields?.vendor_id && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.vendor_id[0]}
                            </p>
                          )}
                        </div> */}

                        <div
                          className={`mt-2 sm:mt-4 w-full col-span-1 ${
                            showPoNumber ? "col-span-1" : "col-span-2"
                          }`}
                        >
                          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <h4>Vendor</h4>
                            <span className="text-red-400">*</span>
                          </label>
                          <div>
                            <Select
                              name="vendor_id"
                              options={vendorsData.map((vendor) => ({
                                value: vendor.id,
                                label: vendor.vendor_name,
                                id_crypt: vendor.id_crypt,
                              }))}
                              value={
                                vendorsData?.find(
                                  (item) =>
                                    Number(item.id) ===
                                    Number(
                                      purchaseOrderEntriesInputs?.vendor_id
                                    )
                                ) && {
                                  value: Number(
                                    purchaseOrderEntriesInputs?.vendor_id
                                  ),
                                  label: vendorsData.find(
                                    (item) =>
                                      Number(item.id) ===
                                      Number(
                                        purchaseOrderEntriesInputs?.vendor_id
                                      )
                                  )?.vendor_name,
                                }
                              }
                              onChange={(selectedOption) => {
                                handleChangeForPurchaseOrderEntries({
                                  target: {
                                    name: "vendor_id",
                                    value: selectedOption
                                      ? selectedOption.value
                                      : null,
                                    id_crypt: selectedOption
                                      ? selectedOption.id_crypt
                                      : null,
                                  },
                                });
                              }}
                              className="w-full mt-2"
                              classNamePrefix="select"
                              isDisabled={isEditing}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />

                            {/* <Select
                              name="vendor_id"
                              options={vendorsData.map((vendor) => ({
                                value: vendor.id,
                                label: vendor.vendor_name,
                                id_crypt: vendor.id_crypt,
                              }))}
                              value={
                                vendorsData
                                  ?.filter(
                                    (item) =>
                                      item.id ===
                                      purchaseOrderEntriesInputs?.vendor_id
                                  )
                                  .map((item) => {
                                    console.log(item, "item");
                                    
                                    return {
                                      value: item.id,
                                    label: item.vendor_name,
                                    }
                                    
                                  })[0] || null
                              }
                              onChange={(selectedOption) => {
                                handleChangeForPurchaseOrderEntries({
                                  target: {
                                    name: "vendor_id",
                                    value: selectedOption
                                      ? selectedOption.value
                                      : null,
                                    id_crypt: selectedOption
                                      ? selectedOption.id_crypt
                                      : null,
                                  },
                                });
                              }}
                              className="w-full mt-2"
                              classNamePrefix="select"
                              isDisabled={isEditing}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            /> */}
                          </div>
                          {requiredFields?.vendor_id && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.vendor_id[0]}
                            </p>
                          )}
                        </div>

                        <div className="sm:mt-4 md:mt-4 lg:mt-2 xl:mt-4 col-span-1">
                          <label className="flex items-center gap-1 block text-sm font-medium text-gray-700 mb-1">
                            <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
                            <h4>Against PO</h4>
                            <span className="text-red-400">*</span>
                          </label>

                          <div className="mt-2 flex items-center space-x-4 w-full bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="1"
                                name="against_po"
                                value="1"
                                disabled={isEditing}
                                checked={
                                  purchaseOrderEntriesInputs?.against_po == "1"
                                }
                                onChange={(e) =>
                                  handleChangeForPurchaseOrderEntries({
                                    target: {
                                      name: "against_po",
                                      value: e.target.value,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-[#134b90] focus:ring-indigo-500 border-gray-300"
                              />
                              <label
                                htmlFor="1"
                                className="ml-2 text-sm text-gray-700"
                              >
                                Yes
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="0"
                                name="against_po"
                                value="0"
                                disabled={isEditing}
                                checked={
                                  purchaseOrderEntriesInputs?.against_po === "0"
                                }
                                onChange={(e) =>
                                  handleChangeForPurchaseOrderEntries({
                                    target: {
                                      name: "against_po",
                                      value: e.target.value,
                                    },
                                  })
                                }
                                className="h-4 w-4 text-[#134b90] focus:ring-indigo-500 border-gray-300"
                              />
                              <label
                                htmlFor="0"
                                className="ml-2 text-sm text-gray-700"
                              >
                                No
                              </label>
                            </div>
                          </div>
                          {requiredFields?.against_po && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.against_po[0]}
                            </p>
                          )}
                        </div>
                        {console.log(
                          purchaseOrderPendingDatas,
                          "purchaseOrderPendingDatas"
                        )}
                        {purchaseOrderEntriesInputs?.against_po == "1" && (
                          <div className=" sm:mt-4 md:mt-2 lg:mt-2 xl:mt-4 w-full col-span-1">
                            <label className="flex items-center gap-1 block text-sm font-medium text-gray-700 mb-1">
                              <NumberedListIcon className="h-5 w-5 text-gray-400" />
                              <h4>PO Number</h4>
                              <span className="text-red-400">*</span>
                            </label>
                            <div>
                              <Select
                                name="purchase_order_id"
                                options={purchaseOrderPendingDatas?.map(
                                  (item) => ({
                                    value: item.id,
                                    label: item.po_number,
                                    id_crypt: item.id_crypt,
                                  })
                                )}
                                value={purchaseOrderPendingDatas
                                  ?.filter(
                                    (item) =>
                                      item.id ==
                                      purchaseOrderEntriesInputs?.purchase_order_id
                                  )
                                  .map((item) => ({
                                    value: item.id,
                                    label: item.po_number,
                                    id_crypt: item.id_crypt,
                                  }))}
                                onChange={(selectedOption) => {
                                  handleChangeForPurchaseOrderEntries({
                                    target: {
                                      name: "purchase_order_id",
                                      value: selectedOption
                                        ? selectedOption.value
                                        : null,
                                      id_crypt: selectedOption
                                        ? selectedOption.id_crypt
                                        : null,
                                    },
                                  });
                                }}
                                className="w-full mt-2"
                                classNamePrefix="select"
                                isDisabled={isEditing}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                              />
                            </div>
                            {requiredFields?.purchase_order_id && (
                              <p className="text-red-500 text-sm mt-1">
                                {requiredFields?.purchase_order_id[0]}
                              </p>
                            )}
                          </div>
                        )}

                        <div
                          className={`col-span-1 ${
                            purchaseOrderEntriesInputs?.against_po === "0" &&
                            "col-span-2"
                          } sm:mt-4 md:mt-2 lg:mt-2 xl:mt-4`}
                        >
                          <label className="flex items-center gap-1 block text-sm font-medium text-gray-700 mb-1">
                            <NumberedListIcon className="h-5 w-5 text-gray-400" />
                            <h4>Invoice No</h4>
                            <span className="text-red-400">*</span>
                          </label>

                          <input
                            type="text"
                            name="vendor_invoice_no"
                            placeholder="Enter Invoice No"
                            value={
                              purchaseOrderEntriesInputs?.vendor_invoice_no
                            }
                            onChange={handleChangeForPurchaseOrderEntries}
                            // onChange={handleChangeForPurchaseOrderEntriesChecking}
                            className={`mt-1 w-full bg-white ${
                              isEditing && "opacity-50 cursor-not-allowed"
                            } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                            disabled={isEditing}
                          />

                          {requiredFields.vendor_invoice_no && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.vendor_invoice_no[0]}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-4">
                    {activeTab === "purchase" && (
                      <>
                        <div className="col-span-1 mt-2 sm:mt-4">
                          <label className="flex items-center gap-1 block text-sm font-medium text-gray-700 mb-1">
                            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                            <h4>Invoice Date</h4>
                            <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="date"
                            name="vendor_invoice_date"
                            // min={new Date().toISOString().split("T")[0]}
                            value={
                              purchaseOrderEntriesInputs?.vendor_invoice_date
                            }
                            onChange={handleChangeForPurchaseOrderEntries}
                            className={`mt-1 w-full bg-white ${
                              isEditing && "opacity-50 cursor-not-allowed"
                            } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                            disabled={isEditing}
                          />

                          {requiredFields.vendor_invoice_date && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.vendor_invoice_date[0]}
                            </p>
                          )}
                        </div>

                        <div className="sm:mt-4 w-full col-span-1">
                          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                            <ArrowPathRoundedSquareIcon className="h-5 w-5 text-gray-400" />
                            <h4>Logistics</h4>
                            <span className="text-red-400">*</span>
                          </label>
                          <div>
                            <Select
                              name="logistic_id"
                              options={logisticsDatas?.map((item) => ({
                                value: item.id,
                                label: item.name,
                              }))}
                              value={
                                logisticsDatas
                                  ?.filter(
                                    (item) =>
                                      item.id ===
                                      purchaseOrderEntriesInputs?.logistic_id
                                  )
                                  .map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                  }))[0] || null
                              }
                              onChange={(selectedOption) =>
                                handleChangeForPurchaseOrderEntries({
                                  target: {
                                    name: "logistic_id",
                                    value: selectedOption
                                      ? selectedOption.value
                                      : null,
                                  },
                                })
                              }
                              className="mt-2"
                              classNamePrefix="select"
                              isDisabled={isEditing}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                          </div>
                          {requiredFields?.logistic_id && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.logistic_id[0]}
                            </p>
                          )}
                        </div>
                        <div
                          className={`sm:mt-4 w-full ${
                            showPurchasePerson ? "col-span-1" : "col-span-2"
                          }`}
                        >
                          <label className="flex items-center gap-1 block text-sm font-medium text-gray-700 mb-1">
                            <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-gray-400" />
                            <h4>Mode of Delivery</h4>
                            <span className="text-red-400">*</span>
                          </label>
                          <div>
                            <Select
                              name="mode_of_delivery"
                              options={modeOfDeliveryData?.map((item) => ({
                                value: item.value,
                                label: item.label,
                              }))}
                              value={
                                modeOfDeliveryData
                                  ?.filter(
                                    (item) =>
                                      item.value ===
                                      purchaseOrderEntriesInputs?.mode_of_delivery
                                  )
                                  .map((item) => ({
                                    value: item.value,
                                    label: item.label,
                                  }))[0] || null
                              }
                              onChange={(selectedOption) =>
                                handleChangeForPurchaseOrderEntries({
                                  target: {
                                    name: "mode_of_delivery",
                                    value: selectedOption
                                      ? selectedOption.value
                                      : null,
                                  },
                                })
                              }
                              className="mt-2"
                              classNamePrefix="select"
                              isDisabled={isEditing}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                          </div>
                          {requiredFields?.mode_of_delivery && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields?.mode_of_delivery[0]}
                            </p>
                          )}
                        </div>
                        {showPurchasePerson && (
                          <div className="col-span-1 sm:mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Purchase Person{" "}
                              <span className="text-red-400">*</span>
                            </label>

                            <Select
                              name="purchase_person_id"
                              options={purchasePersonData?.map((item) => ({
                                value: item.id,
                                label: item.name,
                              }))}
                              value={
                                purchasePersonData
                                  ?.filter(
                                    (item) =>
                                      item.id ===
                                      purchaseOrderEntriesInputs?.purchase_person_id
                                  )
                                  .map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                  }))[0] || null
                              }
                              onChange={(selectedOption) =>
                                handleChangeForPurchaseOrderEntries({
                                  target: {
                                    name: "purchase_person_id",
                                    value: selectedOption
                                      ? selectedOption.value
                                      : null,
                                  },
                                })
                              }
                              className="mt-2"
                              classNamePrefix="select"
                              isDisabled={isEditing}
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />

                            {requiredFields.purchase_person_id && (
                              <p className="text-red-500 text-sm mt-1">
                                {requiredFields.purchase_person_id[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Items */}

                  <div className="mt-4">
                    <div>
                      <h4 className="text-md font-semibold text-gray-400 mb-2">
                        Items <span className="text-red-400">*</span>
                      </h4>
                      {requiredFields["items.0.item_id"] && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields["items.0.item_id"][0]}
                        </p>
                      )}

                      <div className="mt-2 sm:mt-4 flow-root">
                        <div className="overflow-x-auto border border-gray-300 rounded-md">
                          <div className="min-w-[1200px] sm:min-w-full">
                            {/* Header */}
                            <div
                              className={`grid grid-cols-12
                                 gap-1 border-b border-gray-300 bg-gray-100`}
                            >
                              <div className="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 col-span-2">
                                Items
                              </div>
                              <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-2">
                                Vendor Item Name
                              </div>
                              <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1">
                                GST %
                              </div>

                              <div
                                className={`${
                                  purchaseOrderEntriesInputs.against_po ==
                                    "0" && "hidden"
                                } py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1`}
                              >
                                Pending Quantity
                              </div>
                              <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1">
                                Received Quantity
                              </div>

                              <div
                                className={`${
                                  purchaseOrderEntriesInputs.against_po ==
                                    "0" && "hidden"
                                } py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1`}
                              >
                                Po Item Price
                              </div>

                              <div
                                className={`py-3.5 px-1 text-left text-sm font-semibold text-gray-900 ${
                                  purchaseOrderEntriesInputs.against_po ==
                                    "0" && "col-span-2"
                                } col-span-1 `}
                              >
                                Vendor Item Price
                              </div>

                              {/* <div
                                className={`py-3.5 px-1 text-left text-sm font-semibold text-gray-900 ${
                                  purchaseOrderEntriesInputs.against_po ==
                                    "0" && "col-span-2"
                                } col-span-1 `}
                              >
                                Selling Price
                              </div> */}
                              {/* <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1">
                                Discount %
                              </div> */}
                              <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-2">
                                Total Price
                              </div>

                              <div className="py-3.5 pr-4 text-center text-sm font-semibold text-gray-900 col-span-1">
                                Actions
                              </div>
                            </div>

                            {/* Body */}
                            <div className="divide-y divide-gray-200">
                              {(purchaseOrderEntriesInputs?.items || [])?.map(
                                (item, index) => (
                                  <React.Fragment key={index}>
                                    <div
                                      key={index}
                                      className={`grid grid-cols-12
                                       gap-1 items-center py-3`}
                                    >
                                      {purchaseOrderEntriesInputs?.against_po ==
                                      1 ? (
                                        <div className="pl-4 col-span-2">
                                          <Select
                                            name="item_id"
                                            // options={
                                            //   vendorAndItemData?.purchase_items?.map(
                                            //     (poItem) => ({
                                            //       value: poItem.item?.id,
                                            //       label: poItem.item?.item_name,
                                            //       id_crypt: poItem.item?.id_crypt,
                                            //       item: poItem,
                                            //     })
                                            //   ) || []
                                            // }
                                            // options={
                                            //   vendorAndItemData.purchase_items
                                            //     ?.filter((poItem) => {
                                            //       const selectedItemIds =
                                            //         purchaseOrderEntriesInputs?.items
                                            //           ?.filter(
                                            //             (_, i) => i !== index
                                            //           )
                                            //           ?.map((item) =>
                                            //             Number(item.item_id)
                                            //           );
                                            //       return (
                                            //         !selectedItemIds.includes(
                                            //           Number(poItem.item?.id)
                                            //         ) &&
                                            //         poItem.pending_quantity > 0
                                            //       );
                                            //     })
                                            //     ?.map((poItem) => ({
                                            //       value: poItem.item?.id,
                                            //       label: poItem.item?.item_name,
                                            //       id_crypt:
                                            //         poItem.item?.id_crypt,
                                            //       item: poItem,
                                            //     })) || []
                                            // }
                                            // options={
                                            //   vendorAndItemData.purchase_items
                                            //     ?.filter((poItem) => {
                                            //       const selectedPoItemIds =
                                            //         purchaseOrderEntriesInputs?.items
                                            //           ?.filter(
                                            //             (_, i) => i !== index
                                            //           )
                                            //           ?.map((item) =>
                                            //             Number(item.po_item_id)
                                            //           );

                                            //       return (
                                            //         !selectedPoItemIds.includes(
                                            //           Number(poItem.id)
                                            //         ) &&
                                            //         poItem.pending_quantity > 0
                                            //       );
                                            //     })
                                            //     ?.map((poItem) => ({
                                            //       value: poItem.item?.id,
                                            //       label: poItem.item?.item_name,
                                            //       id_crypt:
                                            //         poItem.item?.id_crypt,
                                            //       item: poItem,
                                            //     })) || []
                                            // }
                                            options={
                                              vendorAndItemData.purchase_items

                                                ?.filter((poItem) => {
                                                  const selectedPoItemIds =
                                                    purchaseOrderEntriesInputs?.items
                                                      ?.filter(
                                                        (_, i) => i !== index
                                                      )
                                                      ?.map((item) =>
                                                        Number(item.po_item_id)
                                                      );

                                                  return (
                                                    !selectedPoItemIds.includes(
                                                      Number(poItem.id)
                                                    ) &&
                                                    poItem.pending_quantity > 0
                                                  );
                                                })
                                                ?.map((poItem) => ({
                                                  value: `${poItem.item?.id}`,
                                                  label: poItem.item?.item_name,
                                                  id_crypt:
                                                    poItem.item?.id_crypt,
                                                  item: poItem,
                                                })) || []
                                            }
                                            value={
                                              vendorAndItemData.purchase_items
                                                ?.map((poItem) => ({
                                                  value: Number(
                                                    poItem.item?.id
                                                  ),
                                                  label: poItem.item?.item_name,
                                                  id_crypt:
                                                    poItem.item?.id_crypt,
                                                  vendor_item: poItem,
                                                }))
                                                ?.find(
                                                  (option) =>
                                                    Number(option.value) ===
                                                    Number(
                                                      purchaseOrderEntriesInputs
                                                        ?.items[index]?.item_id
                                                    )
                                                ) || null
                                            }
                                            onChange={(selectedOption) => {
                                              handleChangeForPurchaseOrderEntries(
                                                {
                                                  target: {
                                                    name: "item_id",
                                                    value:
                                                      selectedOption?.value ||
                                                      null,
                                                    id_crypt:
                                                      selectedOption?.id_crypt ||
                                                      null,
                                                    item:
                                                      selectedOption.item ||
                                                      null,
                                                  },
                                                },
                                                index
                                              );
                                            }}
                                            isDisabled={isEditing}
                                            classNamePrefix="select"
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            styles={{
                                              menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                              }),
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div className="pl-4 col-span-2">
                                          <Select
                                            name="item_id"
                                            options={
                                              itemsFromVendor
                                                ?.filter((poItem) => {
                                                  const selectedItemIds =
                                                    purchaseOrderEntriesInputs?.items
                                                      ?.filter(
                                                        (_, i) => i !== index
                                                      )
                                                      ?.map((item) =>
                                                        Number(item.item_id)
                                                      );

                                                  return !selectedItemIds.includes(
                                                    Number(poItem.item?.id)
                                                  );
                                                })
                                                ?.map((poItem) => ({
                                                  value: poItem.id,
                                                  label:
                                                    poItem?.item_name || "",
                                                  id_crypt: poItem.id_crypt,
                                                  item: poItem,
                                                })) || []
                                            }
                                            value={
                                              itemsFromVendor
                                                ?.map((poItem) => ({
                                                  value: Number(poItem.id),
                                                  label: poItem.item_name,
                                                  id_crypt: poItem.id_crypt,
                                                  vendor_item: poItem,
                                                }))
                                                ?.find(
                                                  (option) =>
                                                    Number(option.value) ===
                                                    Number(
                                                      purchaseOrderEntriesInputs
                                                        ?.items[index]?.item_id
                                                    )
                                                ) || null
                                            }
                                            onChange={(selectedOption) => {
                                              handleChangeForPurchaseOrderEntries(
                                                {
                                                  target: {
                                                    name: "item_id",
                                                    value:
                                                      selectedOption?.value ||
                                                      null,
                                                    id_crypt:
                                                      selectedOption?.id_crypt ||
                                                      null,
                                                    item:
                                                      selectedOption.item ||
                                                      null,
                                                  },
                                                },
                                                index // Important to keep track of which row this is
                                              );
                                            }}
                                            isDisabled={isEditing}
                                            classNamePrefix="select"
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            styles={{
                                              menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                              }),
                                            }}
                                          />
                                        </div>
                                      )}

                                      <div className="col-span-2">
                                        <input
                                          type="text"
                                          name="vendor_item_name"
                                          value={item.vendor_item_name}
                                          placeholder="Vendor Item Name"
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrderEntries(
                                              e,
                                              index
                                            )
                                          }
                                          className={`w-full ${
                                            isEditing &&
                                            "bg-gray-100 cursor-not-allowed"
                                          }  rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                        />
                                      </div>

                                      <div className="col-span-1">
                                        <input
                                          type="text"
                                          name="gst_percent"
                                          value={
                                            item.gst_percent
                                              ? item.gst_percent + "%"
                                              : ""
                                          }
                                          placeholder="GST"
                                          disabled
                                          readOnly
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrderEntries(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full ${
                                            isEditing &&
                                            "bg-gray-100 cursor-not-allowed"
                                          }  rounded-md border bg-gray-100 border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                        />
                                      </div>

                                      <div
                                        className={`${
                                          purchaseOrderEntriesInputs.against_po ==
                                            "0" && "hidden"
                                        } col-span-1`}
                                      >
                                        <input
                                          type="text"
                                          name="po_quantity"
                                          value={item.po_quantity}
                                          placeholder="Pending Quantity"
                                          disabled
                                          readOnly
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrderEntries(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full rounded-md bg-gray-100 cursor-not-allowed border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                        />
                                      </div>

                                      <div className="col-span-1">
                                        <input
                                          type="text"
                                          name="quantity"
                                          value={item.quantity}
                                          placeholder="Received Quantity"
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrderEntries(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full ${
                                            isEditing &&
                                            "bg-gray-100 cursor-not-allowed"
                                          }  rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                        />
                                      </div>

                                      <div
                                        className={`${
                                          purchaseOrderEntriesInputs.against_po ==
                                            "0" && "hidden"
                                        } col-span-1`}
                                      >
                                        <input
                                          type="text"
                                          name="po_price"
                                          value={item.po_price}
                                          placeholder="Po Item Price"
                                          disabled
                                          readOnly
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrderEntries(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full rounded-md border bg-gray-100 cursor-not-allowed border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                        />
                                      </div>

                                      <div
                                        className={`${
                                          purchaseOrderEntriesInputs.against_po ==
                                            "0" && "col-span-2"
                                        } col-span-1`}
                                      >
                                        <input
                                          type="text"
                                          name="vendor_price"
                                          value={item.vendor_price}
                                          placeholder="Vendor Item Price"
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrderEntries(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full ${
                                            isEditing &&
                                            "bg-gray-100 cursor-not-allowed"
                                          }  rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                        />
                                      </div>

                                      {/* <div
                                        className={`${
                                          purchaseOrderEntriesInputs.against_po ==
                                            "0" && "col-span-2"
                                        } col-span-1`}
                                      >
                                        <input
                                          type="text"
                                          name="selling_price"
                                          value={item.selling_price}
                                          placeholder="Selling Price"
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrderEntries(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full ${
                                            isEditing &&
                                            "bg-gray-100 cursor-not-allowed"
                                          }  rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                        />
                                      </div> */}

                                      {/* <div className="col-span-1">
                                        <input
                                          type="number"
                                          name="discount"
                                          value={item.discount}
                                          placeholder=" %"
                                          disabled={isEditing}
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrderEntries(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full ${
                                            isEditing && "bg-gray-100"
                                          }  rounded-md border text-right border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        />
                                      </div> */}

                                      {/* Purchase Price */}
                                      <div className="col-span-2">
                                        <input
                                          type="number"
                                          name="sub_total_amount"
                                          value={item.sub_total_amount}
                                          placeholder="0.00"
                                          readOnly
                                          disabled={isEditing}
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrderEntries(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full ${
                                            isEditing && "bg-gray-100"
                                          }  rounded-md border text-right border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        />
                                      </div>

                                      {/*  gst + sub total */}
                                      <div className=" hidden">
                                        <input
                                          type="number"
                                          name="total_amount"
                                          value={item.total_amount}
                                          placeholder="0.00"
                                          disabled={isEditing}
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrderEntries(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full ${
                                            isEditing && "bg-gray-100"
                                          }  rounded-md border text-right border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        />
                                      </div>

                                      {/* Delete Icon */}
                                      <div className="col-span-1 flex justify-center">
                                        <XMarkIcon
                                          className="h-5 w-5 text-red-600 cursor-pointer"
                                          onClick={() =>
                                            handleDeleteItem(index)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </React.Fragment>
                                )
                              )}
                            </div>

                            {/* Add New Item */}
                            <div
                              className={`${
                                isEditing && "hidden"
                              } mt-2 sm:mt-4 flex items-center px-4 mb-4`}
                            >
                              <UserPlusIcon
                                className="h-5 w-5 text-blue-600 mr-2 cursor-pointer"
                                onClick={handleAddItems}
                              />
                              <span
                                className="text-sm text-gray-700 cursor-pointer"
                                onClick={handleAddItems}
                              >
                                Add New Item
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items end */}

                  <div className="mt-4 sm:mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
                    {activeTab === "purchase" && (
                      <>
                        <div className="col-span-2 ">
                          <div className="col-span-1 sm:mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Remarks
                            </label>

                            <textarea
                              rows={2}
                              type="text"
                              name="remarks"
                              placeholder="Enter Remarks"
                              value={purchaseOrderEntriesInputs.remarks}
                              onChange={handleChangeForPurchaseOrderEntries}
                              className={`mt-1 w-full bg-white ${
                                isEditing && "opacity-50 cursor-not-allowed"
                              } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                              disabled={isEditing}
                            />

                            {requiredFields.name && (
                              <p className="text-red-500 text-sm mt-1">
                                {requiredFields.name[0]}
                              </p>
                            )}
                          </div>
                          <div className="col-span-1 sm:mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vendor Invoice Upload Image{" "}
                              {/* <span className="text-red-400">*</span> */}
                            </label>
                            <div className="relative w-fit mt-2">
                              <input
                                id="imageUpload"
                                type="file"
                                name="vendor_invoice_image"
                                accept="image/*,application/pdf"
                                onChange={handleChangeForPurchaseOrderEntries} // ✅ remove index
                                disabled={isEditing}
                                className="hidden"
                              />

                              <label
                                htmlFor="imageUpload"
                                className={`inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm cursor-pointer hover:bg-indigo-700 transition ${
                                  isEditing
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                Upload Image
                              </label>

                              {/* {showFileName && (
                                <div className="mt-2">
                                  <p className="text-gray-600 text-sm">
                                    Selected File: {showFileName}
                                  </p>
                                  <img src={purchaseOrderEntriesInputs.vendor_invoice_image} alt="" srcset="" />
                                  <img
                                    src={
                                      axios.defaults.baseURL +
                                      "/storage/app/public/" +
                                      purchaseOrderEntriesInputs.vendor_invoice_image
                                    }
                                    alt={`Captured ${showFileName}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )} */}

                              {showFileName && (
                                <div className="mt-2 space-y-2">
                                  <p className="text-gray-600 text-sm">
                                    Selected File: {showFileName}
                                  </p>

                                  {typeof purchaseOrderEntriesInputs.vendor_invoice_image ===
                                  "object" ? (
                                    // New file selected
                                    purchaseOrderEntriesInputs.vendor_invoice_image.type.includes(
                                      "image"
                                    ) ? (
                                      <>
                                        <img
                                          ref={imageRef}
                                          src={URL.createObjectURL(
                                            purchaseOrderEntriesInputs.vendor_invoice_image
                                          )}
                                          alt={`Preview ${showFileName}`}
                                          className="w-full h-[250px] object-cover border rounded"
                                        />
                                        <button
                                          type="button"
                                          onClick={handlePrintImage}
                                          className="mt-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                          Print Image
                                        </button>
                                      </>
                                    ) : purchaseOrderEntriesInputs
                                        .vendor_invoice_image.type ===
                                      "application/pdf" ? (
                                      <>
                                        <iframe
                                          src={URL.createObjectURL(
                                            purchaseOrderEntriesInputs.vendor_invoice_image
                                          )}
                                          title="PDF Preview"
                                          className="w-full h-[250px] border rounded"
                                        ></iframe>
                                        <a
                                          href={URL.createObjectURL(
                                            purchaseOrderEntriesInputs.vendor_invoice_image
                                          )}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-block mt-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                        >
                                          Open & Print PDF
                                        </a>
                                      </>
                                    ) : (
                                      <p className="text-red-500 text-sm">
                                        Preview not available for this file type
                                      </p>
                                    )
                                  ) : (
                                    (() => {
                                      const filePath =
                                        axios.defaults.baseURL +
                                        "/storage/app/public/" +
                                        purchaseOrderEntriesInputs.vendor_invoice_image;

                                      const isPDF =
                                        purchaseOrderEntriesInputs.vendor_invoice_image
                                          .toLowerCase()
                                          .endsWith(".pdf");
                                      const isImage =
                                        /\.(jpe?g|png|gif|bmp|webp)$/i.test(
                                          purchaseOrderEntriesInputs.vendor_invoice_image
                                        );

                                      return isPDF ? (
                                        <>
                                          <iframe
                                            src={filePath}
                                            title="PDF Preview"
                                            className="w-full h-[250px] border rounded"
                                          ></iframe>
                                          <a
                                            href={filePath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                          >
                                            Open & Print PDF
                                          </a>
                                        </>
                                      ) : isImage ? (
                                        <>
                                          <img
                                            ref={imageRef}
                                            src={filePath}
                                            alt={`Preview ${showFileName}`}
                                            className="w-full h-[250px] object-cover border rounded"
                                          />
                                          <button
                                            type="button"
                                            onClick={handlePrintImage}
                                            className="mt-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                          >
                                            Print Image
                                          </button>
                                        </>
                                      ) : (
                                        <a
                                          href={filePath}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 underline text-sm"
                                        >
                                          View File
                                        </a>
                                      );
                                    })()
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="col-span-2">
                      <div className="col-span-2 border border-gray-200 mt-8 rounded-md ">
                        <div className="p-2 sm:p-4 border-b border-gray-200">
                          <div className="p-2  flex items-center justify-between border-b border-gray-200">
                            <label className="text-sm font-medium text-gray-700">
                              Sub Total ₹
                            </label>
                            <input
                              type="text"
                              name="sub_total_amount"
                              value={
                                purchaseOrderEntriesInputs.sub_total_amount || 0
                              }
                              readOnly
                              disabled
                              onChange={handleChangeForPurchaseOrderEntries}
                              className="text-right bg-gray-50  rounded  py-1 w-32"
                            />
                          </div>

                          <div className="space-y-3">
                            {(
                              purchaseOrderEntriesInputs?.gst_details || []
                            ).map((gst, index) => (
                              <React.Fragment key={index}>
                                {/* IGST */}
                                {gst.igst_percent > 0 && (
                                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-4 items-center text-sm bg-gray-50 p-3">
                                    <div className="flex items-center gap-6">
                                      <span className="capitalize">IGST</span>
                                      <span>{gst?.igst_percent}%</span>
                                    </div>
                                    <div className="flex items-center justify-end">
                                      <span>{gst?.igst_amount}</span>
                                    </div>
                                  </div>
                                )}

                                {/* CGST */}
                                {gst.cgst_percent > 0 && (
                                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-4 items-center text-sm bg-gray-50 p-3">
                                    <div className="flex items-center gap-6">
                                      <span className="capitalize">CGST</span>
                                      <span>{gst?.cgst_percent}%</span>
                                    </div>
                                    <div className="flex items-center justify-end">
                                      <span>{gst?.cgst_amount}</span>
                                    </div>
                                  </div>
                                )}

                                {/* SGST */}
                                {gst.sgst_percent > 0 && (
                                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-4 items-center text-sm bg-gray-50 p-3">
                                    <div className="flex items-center gap-6">
                                      <span className="capitalize">SGST</span>
                                      <span>{gst?.sgst_percent}%</span>
                                    </div>
                                    <div className="flex items-center justify-end">
                                      <span>{gst?.sgst_amount}</span>
                                    </div>
                                  </div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        <div className="p-2 sm:p-4 flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Total ₹
                          </label>
                          <input
                            type="text"
                            name="total_amount"
                            value={
                              "₹ " + purchaseOrderEntriesInputs.total_amount ||
                              0
                            }
                            readOnly
                            disabled
                            className="text-right bg-gray-50  rounded px-2 py-1 w-32 font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}

                  <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDialogForPurchaseOrderEntries(false)
                      }
                      className="text-sm cursor-pointer font-medium text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    {saveBtnForPurchaseOrderEntries === "save" ? (
                      // <button
                      //   type="submit"
                      //   // disabled={isSubmitting}
                      //   onClick={handleSubmitForPurchaseOrderEntries}
                      //   className="inline-flex cursor-pointer items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-[#134b90] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      // >
                      //   Save
                      // </button>
                      <SaveButton saveFunction={handleSubmitForPurchaseOrderEntries} />
                    ) : (
                      <button
                        type="submit"
                        // disabled={isSubmitting}
                        onClick={handleUpdateForPurchaseOrderEntries}
                        className="inline-flex cursor-pointer items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-[#134b90] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}

      {openWarningDialogForVendor && (
        <Dialog
          open={openWarningDialogForVendor}
          onClose={setOpenWarningDialogForVendor}
          className="relative z-100"
        >
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
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="size-6 text-red-600"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900"
                    >
                      Confirmation
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        If the vendor is changed, all related fields will be
                        reset to ensure data consistency
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDeletePoEntryTypedData}
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    data-autofocus
                    onClick={handleWarningDialogClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default PurchaseOrderEntriesDialogBox;
