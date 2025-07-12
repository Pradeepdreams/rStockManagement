import React, { use, useEffect, useRef, useState } from "react";
import Loader from "../Utils/Loader";
import HeadersAndAddButton from "../Utils/HeadersAndAddButton";
import { useOutletContext } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import SaveButton from "../Utils/SaveButton";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  CalendarDateRangeIcon,
  CameraIcon,
  ChevronDownIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  LightBulbIcon,
  MapPinIcon,
  PencilIcon,
  PencilSquareIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import Select from "react-select";
import {
  getBranchDataFromBalaSilksDB,
  getDecryptedPosData,
  savePendingPOs,
  savePendingPOsData,
} from "../Utils/indexDB";

import axios from "../Utils/AxiosInstance";
import { Tooltip } from "react-tooltip";
import PurchaseOrderList from "./PurchaseOrderList";
import CameraSection from "./CameraSection";
import { useToast } from "../Context/ToastProvider";
import { toast } from "react-toastify";
import { useSearch } from "../Context/SearchContext";
import { all } from "axios";
import { BsCartPlusFill } from "react-icons/bs";
import DialogHeader from "../Utils/DialogHeader";

function PurchaseOrderCreate() {
  const { collapsed } = useOutletContext();

  const [loading, setLoading] = useState(false);
  const [saveBtn, setSaveBtn] = useState("save");
  const [isEditing, setIsEditing] = useState(false);
  const [editIdCrypt, setEditIdCrypt] = useState("");
  const [showInward, setShowInward] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { triggerToast } = useToast();
  const cameraStreamRef = useRef(null);

  const { searchTerm } = useSearch();
  const [poInputs, setPoInputs] = useState({
    date: new Date().toISOString().split("T")[0],
    po_number: "",
    area_id: "",
    vendor_id: "",
    payment_terms_id: "",
    expected_delivery_date: "",
    is_polished: "",
    mode_of_delivery: "",
    logistics: "",
    order_amount: "",
    gst_amount: "",
    cgst_amount: "",
    sgst_amount: "",
    igst_amount: "",
    total_amount: "",
    remarks: "",
    discount_percent: "",
    minimum_discount: "",
    discount_amount: "",
    discounted_total: "",
    items: [
      {
        id: "",
        item_id: "",
        quantity: "",
        item_price: "",
        gst_percent: "",
        cgst_percent: "",
        sgst_percent: "",
        igst_percent: "",
        total_igst_percent: "",
        total_igst_amount: "",
        cgst_amount: "",
        sgst_amount: "",
        item_status: "",
        igst_amount: "",
        item_gst_amount: "",
        total_item_price: "",
        overall_item_price: "",
        hsn_code: "",
        inward_quantity: "",
        pending_quantity: "",
        images: [],
        uploaded_images: [],
        discounted_amount: "",
        discount_percent: "",
        discount_price: "",
      },
    ],
    gst_entries: [
      {
        gst_percent: "",
        cgst_percent: "",
        cgst_amount: "",
        sgst_percent: "",
        sgst_amount: "",
        igst_percent: "",
        igst_amount: "",
      },
    ],
  });
  const [requiredFields, setRequiredFields] = useState([]);
  const [OpenDialogForPurchaseOrder, setOpenDialogForPurchaseOrder] =
    useState(false);
  const [areaDatas, setAreaDatas] = useState([]);
  const [vendorDatas, setVendorDatas] = useState([]);
  const [paymentTermsData, setPaymentTermsData] = useState([]);
  const [itemDatas, setItemDatas] = useState([]);
  const [vendorInput, setVendorInput] = useState(false);
  const [itemsInputOpen, setItemsInputOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [modeDeliveryShow, setModeDeliveryShow] = useState(false);
  const [expectedDeliveryShow, setExpectedDeliveryShow] = useState(false);
  const [logisticsShow, setLogisticsShow] = useState(false);
  const [isPolishedShow, setIsPolishedShow] = useState(false);
  const [paymentTermShow, setPaymentTermShow] = useState(false);
  const [overallTotalDialog, setOverallTotalDialog] = useState(false);
  const [poPaginationDatas, setPoPaginationDatas] = useState([]);
  const [logisticsDatas, setLogisticsDatas] = useState([]);
  const [cameraStream, setCameraStream] = useState(null);
  const [gstShow, setGstShow] = useState(false);
  const [videoPreview, setVideoPreview] = useState([]);
  const [groupedIgstPercentAndAmount, setGroupedIgstPercentAndAmount] =
    useState([]);

  const [showCapturedImages, setShowCapturedImages] = useState({});
  const [poEditDatas, setPoEditDatas] = useState([]);
  const [activeDiscountData, setActiveDiscountData] = useState([]);
  const [afterDiscountAmount, setAfterDiscountAmount] = useState(0);
  const [totalDiscountAmountCheck, setTotalDiscountAmountCheck] = useState(0);
  const [itemDiscountPercent, setItemDiscountPercent] = useState(0);
  const [showDiscountError, setShowDiscountError] = useState(false);
  const [pendingStatusError, setPendingStatusError] = useState(false);

  const polishedData = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];
  const modeOfDeliveryData = [
    { value: "hand", label: "By Hand" },
    { value: "parcel", label: "Parcel" },
  ];

  useEffect(() => {
    if (poEditDatas?.purchase_order_gst?.length > 0) {
      const taxData = poEditDatas.purchase_order_gst.flatMap((entry) => {
        const results = [];
        if (!entry.igst_percent) {
          if (entry.sgst_percent && entry.sgst_amount) {
            results.push({
              tax_type: "SGST",
              percent: parseFloat(entry.sgst_percent),
              total_amount: parseFloat(entry.sgst_amount),
            });
          }
          if (entry.cgst_percent && entry.cgst_amount) {
            results.push({
              tax_type: "CGST",
              percent: parseFloat(entry.cgst_percent),
              total_amount: parseFloat(entry.cgst_amount),
            });
          }
        } else {
          if (entry.igst_percent && entry.igst_amount) {
            results.push({
              tax_type: "IGST",
              percent: parseFloat(entry.igst_percent),
              total_amount: parseFloat(entry.igst_amount),
            });
          }
        }
        return results;
      });

      setGroupedIgstPercentAndAmount(taxData);
    }
  }, [poEditDatas]);

  const fetchPurchaseOrderDatas = async (page = 1, searchTerm) => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      page,
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }

    const responseForPoDatas = await axios.get(
      `public/api/purchase-orders?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      }
    );
    console.log(responseForPoDatas, "responseForPoDatas");

    setPoPaginationDatas(responseForPoDatas?.data?.purchase_orders);

    const responseForActiveDiscount = await axios.get(
      `public/api/discount-on-purchases/active/percent`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      }
    );

    console.log(responseForActiveDiscount, "responseForActiveDiscount");
    setActiveDiscountData(responseForActiveDiscount?.data);
    setPoInputs((prev) => ({
      ...prev,
      // discount_percent: activeDiscountData?.discount_percent,
      minimum_discount: activeDiscountData?.discount_percent,
    }));
  };

  useEffect(() => {
    fetchPurchaseOrderDatas(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const fetchVendorsByArea = async (area_id_crypt) => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");
    const po_flag = "1";

    try {
      const response = await axios.get(`public/api/areas/${area_id_crypt}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
        params: {
          po_flag,
        },
      });
      setVendorDatas(response.data.vendors);
      setVendorInput(true);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  // useEffect(() => {
  //   let totalDiscountAmount = 0;
  //   let finalAmount = 0;

  //   const updatedItems = poInputs.items.map((item) => {
  //     const total = Number(item.quantity || 0) * Number(item.item_price || 0);
  //     const discount = Number(item.discount_percent || 0);
  //     const lessDiscount = (total * discount) / 100;

  //     totalDiscountAmount += lessDiscount;

  //     finalAmount = total - lessDiscount;

  //     // Only update if value changed
  //     if (item.total_item_price !== finalAmount) {
  //       return {
  //         ...item,

  //         discounted_amount: finalAmount,
  //         discount_price: lessDiscount,
  //         // total_amount: poInputs.gst_amount + finalAmount,
  //       };
  //     }

  //     return item;
  //   });

  //   // if(poInputs.minimum_discount < poInputs.discount_percent){
  //   //       setShowDiscountError(true);
  //   //     }

  //   setPoInputs((prev) => ({
  //     ...prev,
  //     items: updatedItems,
  //     gst_amount: poInputs.gst_amount,
  //     discount_amount: totalDiscountAmount.toFixed(2),
  //     discounted_total: finalAmount.toFixed(2),
  //     total_amount: (Number(poInputs.gst_amount) + finalAmount)?.toFixed(2),
  //   }));
  // }, [itemDiscountPercent]);

  const fetchItemsByVendor = async (vendor_id_crypt) => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");
    const po_flag = "1";

    try {
      const response = await axios.get(
        `public/api/vendors/${vendor_id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
          params: {
            po_flag,
          },
        }
      );
      setItemDatas(response.data.items);
      setPoInputs((prev) => ({
        ...prev,
        payment_terms_id: response.data.payment_term_id,
      }));
      setItemsInputOpen(true);
      setPaymentTermShow(true);
      setIsPolishedShow(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching items");
    }
  };

  const fetchPurchaseOrder = async (page = 1) => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      page,
    });

    try {
      const response = await axios.get(`public/api/areas/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      setAreaDatas(response?.data);

      const responseForVendorsList = await axios.get(
        `public/api/vendors/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      setVendorDatas(responseForVendorsList.data);

      const responseForLogisticsList = await axios.get(
        `public/api/logistics/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForLogisticsList.data, "responseForLogisticsList");

      setLogisticsDatas(responseForLogisticsList.data);

      const responseForPaymentTermList = await axios.get(
        `public/api/payment-terms/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(
        responseForPaymentTermList.data,
        "responseForPaymentTermList"
      );

      setPaymentTermsData(responseForPaymentTermList.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    }
  };

  useEffect(() => {
    fetchPurchaseOrder();
  }, []);

  useEffect(() => {
    if (cameraOpen && activeIndex !== null) {
      const video = document.getElementById(`video-preview-${activeIndex}`);
      if (video) {
        setVideoPreview((prev) => [...prev, video]);
      }
      console.log(video);
      if (!video) {
        console.error("Video element not found");
        return;
      }

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          alert("Could not access the camera. Please check permissions.");
        });
    } else {
      console.log("camera stopped");
      console.log(videoPreview, "videoPreview");
      // const video = document.getElementById(`video-preview-0`);
      const videos = videoPreview;

      videos.forEach((video) => {
        if (video != null) {
          const stream = video.srcObject;
          console.log(stream, "stream");
          if (stream && stream.active) {
            stream.getTracks().forEach((track) => {
              console.log(track, "track");
              track.stop();
            });
            video.srcObject = null;
          }
        }
      });
    }
  }, [cameraOpen, activeIndex]);

  const handleShowImages = (index) => {
    setShowCapturedImages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDialogOpenForPurchaseOrder = async (e) => {
    e.preventDefault();
    setEditIdCrypt("");
    setShowInward(false);
    setSaveBtn("save");
    setIsEditing(false);
    setOpenDialogForPurchaseOrder(true);
    setVendorInput(false);
    setItemsInputOpen(false);
    setModeDeliveryShow(true);
    setPoInputs({
      date: new Date().toISOString().split("T")[0],
      po_number: "",
      area_id: "",
      vendor_id: "",
      payment_terms_id: "",
      expected_delivery_date: "",
      order_amount: "",
      remarks: "",
      is_polished: "",
      mode_of_delivery: "",
      logistics: "",
      gst_amount: "",
      total_amount: "",
      items: [
        {
          item_id: "",
          quantity: "",
          item_price: "",
          gst_percent: "",
          item_gst_amount: "",
          total_item_price: "",
          overall_item_price: "",
          hsn_code: "",
          images: [],
          uploaded_images: [],
        },
      ],
    });
    try {
      const branchData = await getBranchDataFromBalaSilksDB();
      const branchIds = branchData.map((branch) => branch.branch.id_crypt);
      const token = localStorage.getItem("token");
      const responseForPoNumber = await axios.get(
        `public/api/purchase-orders/latest-number`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForPoNumber.data.original, "responseForPoNumber");
      setPoInputs((prev) => ({
        ...prev,
        po_number: responseForPoNumber.data.original.po_number,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    }
  };

  // Utility function to recalculate a single item's financial details
  const recalculateItemDetails = (
    item,
    itemApiData,
    gstShow,
    itemDiscountPercent,
    index = null
  ) => {
    const updatedQuantity = Number(item.quantity || 0);
    const updatedPrice = Number(item.item_price || 0);
    const discountPercent = Number(itemDiscountPercent || 0);

    const updatedTotalAmount = updatedQuantity * updatedPrice;
    const discountAmount = (updatedTotalAmount * discountPercent) / 100;
    const afterDiscount = updatedTotalAmount - discountAmount;

    const gstPercent =
      itemApiData?.active_gst_percent?.gst_percent !== undefined
        ? Number(itemApiData.active_gst_percent.gst_percent)
        : Number(item.gst_percent || 0);

    const gstAmount = (gstPercent / 100) * afterDiscount;

    const hsnCode =
      itemApiData?.active_hsn_code?.hsn_code !== undefined
        ? itemApiData.active_hsn_code.hsn_code
        : item.hsn_code || "";

    return {
      ...item,
      discount_percent: discountPercent,
      quantity: updatedQuantity,
      item_price: updatedPrice,
      total_item_price: updatedTotalAmount,
      discount_price: discountAmount.toFixed(2),
      discounted_amount: afterDiscount.toFixed(2),
      gst_percent: gstPercent,
      igst_percent: !gstShow ? gstPercent : "",
      cgst_percent: gstShow ? gstPercent / 2 : "",
      sgst_percent: gstShow ? gstPercent / 2 : "",
      cgst_amount: gstShow ? (gstAmount / 2).toFixed(2) : "",
      sgst_amount: gstShow ? (gstAmount / 2).toFixed(2) : "",
      igst_amount: !gstShow ? gstAmount.toFixed(2) : "",
      item_gst_amount: gstAmount.toFixed(2),
      overall_item_price: (updatedTotalAmount + gstAmount).toFixed(2),
      hsn_code: hsnCode,
    };
  };

  // Utility to build GST maps and summaries
  const buildTaxSummary = (items) => {
    const igstMap = {},
      cgstMap = {},
      sgstMap = {};

    items.forEach((item) => {
      const igst = Number(item.igst_percent || 0),
        igstAmt = Number(item.igst_amount || 0);
      const cgst = Number(item.cgst_percent || 0),
        cgstAmt = Number(item.cgst_amount || 0);
      const sgst = Number(item.sgst_percent || 0),
        sgstAmt = Number(item.sgst_amount || 0);

      if (igst) igstMap[igst] = (igstMap[igst] || 0) + igstAmt;
      if (cgst) cgstMap[cgst] = (cgstMap[cgst] || 0) + cgstAmt;
      if (sgst) sgstMap[sgst] = (sgstMap[sgst] || 0) + sgstAmt;
    });

    const allPercents = [
      ...new Set([
        ...Object.keys(igstMap),
        ...Object.keys(cgstMap),
        ...Object.keys(sgstMap),
      ]),
    ]
      .map(Number)
      .sort((a, b) => a - b);

    const entries = allPercents.map((percent) => ({
      gst_percent: igstMap[percent] ? percent : percent * 2,
      igst_percent: cgstMap[percent] || sgstMap[percent] ? "" : percent,
      igst_amount:
        cgstMap[percent] || sgstMap[percent] ? "" : igstMap[percent] || 0,
      cgst_percent: igstMap[percent] ? "" : percent,
      cgst_amount: igstMap[percent] ? "" : cgstMap[percent] || 0,
      sgst_percent: igstMap[percent] ? "" : percent,
      sgst_amount: igstMap[percent] ? "" : sgstMap[percent] || 0,
    }));

    const summary = allPercents.flatMap((percent) => {
      const res = [];
      if (cgstMap[percent])
        res.push({ tax_type: "CGST", percent, total_amount: cgstMap[percent] });
      if (sgstMap[percent])
        res.push({ tax_type: "SGST", percent, total_amount: sgstMap[percent] });
      if (igstMap[percent])
        res.push({ tax_type: "IGST", percent, total_amount: igstMap[percent] });
      return res;
    });

    return { entries, summary };
  };

  // Main handler for purchase order changes
  const handleChangeForPurchaseOrder = async (e, index = null) => {
    const { name, value, id_crypt } = e.target;
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((b) => b.branch.id_crypt);
    const token = localStorage.getItem("token");
    const po_flag = "1";

    if (index === null) {
      if (name === "area_id") {
        setVendorInput(true);
        try {
          const response = await axios.get(`public/api/areas/${id_crypt}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Branch-Id": branchIds[0],
            },
            params: { po_flag },
          });
          setVendorDatas(response.data.vendors);
        } catch (err) {
          console.error("Area error:", err);
        }
      }

      if (name === "vendor_id") {
        setItemsInputOpen(true);
        setPaymentTermShow(true);
        setIsPolishedShow(true);
        setModeDeliveryShow(true);
        setPoInputs((prev) => ({
          ...prev,
          items: prev.items.map((item) => ({
            ...item,
            item_id: "",
            quantity: "",
            item_price: "",
            gst_percent: "",
            cgst_percent: "",
            sgst_percent: "",
            igst_percent: "",
            item_gst_amount: "",
            total_item_price: "",
            overall_item_price: "",
            hsn_code: "",
            images: [],
            uploaded_images: [],
          })),
        }));
        try {
          const response = await axios.get(`public/api/vendors/${id_crypt}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Branch-Id": branchIds[0],
            },
            params: { po_flag },
          });

           const responseForItems = await axios.get(`public/api/items/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Branch-Id": branchIds[0],
            },
         
          });

          console.log(responseForItems, "items");
          

          setGstShow(
            response.data.gst_applicable == 1 &&
              response.data.gst_in?.startsWith("33")
          );
          // setItemDatas(response.data.items);
          setItemDatas(responseForItems.data);
          setPoInputs((prev) => ({
            ...prev,
            payment_terms_id: response.data.payment_term_id,
          }));
        } catch (error) {
          toast.error(error.response?.data?.message || "Vendor error");
        }
      }

      if (name === "is_polished") {
        setModeDeliveryShow(value == 1);
        setExpectedDeliveryShow(true);
      }

      if (name === "mode_of_delivery") {
        setExpectedDeliveryShow(true);
        setLogisticsShow(value === "parcel");
      }

      setPoInputs((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === "discount_percent") {
        const newDiscount = Number(value);
        setShowDiscountError(newDiscount < poInputs.minimum_discount);
        setItemDiscountPercent(newDiscount);

        setPoInputs((prev) => {
          const updatedItems = prev.items.map((item, index) => {
            const itemApiData =
              itemDatas.find((d) => String(d.id) === String(item.item_id))
                ?.category || null;

            return recalculateItemDetails(
              item,
              itemApiData,
              gstShow,
              newDiscount,
              index
            );
          });

          const totalGST = updatedItems.reduce(
            (sum, i) => sum + Number(i.item_gst_amount || 0),
            0
          );
          const orderAmount = updatedItems.reduce(
            (sum, i) => sum + Number(i.total_item_price || 0),
            0
          );
          const discountAmount = updatedItems.reduce(
            (sum, i) => sum + Number(i.discount_price || 0),
            0
          );
          const discounted = updatedItems.reduce(
            (sum, i) => sum + Number(i.discounted_amount || 0),
            0
          );

          // Tax summary maps
          const igstMap = {},
            cgstMap = {},
            sgstMap = {};
          updatedItems.forEach((item) => {
            const igst = Number(item.igst_percent || 0);
            const cgst = Number(item.cgst_percent || 0);
            const sgst = Number(item.sgst_percent || 0);
            const igstAmt = Number(item.igst_amount || 0);
            const cgstAmt = Number(item.cgst_amount || 0);
            const sgstAmt = Number(item.sgst_amount || 0);

            if (igst) igstMap[igst] = (igstMap[igst] || 0) + igstAmt;
            if (cgst) cgstMap[cgst] = (cgstMap[cgst] || 0) + cgstAmt;
            if (sgst) sgstMap[sgst] = (sgstMap[sgst] || 0) + sgstAmt;
          });

          const allPercents = [
            ...new Set([
              ...Object.keys(igstMap),
              ...Object.keys(cgstMap),
              ...Object.keys(sgstMap),
            ]),
          ]
            .map(Number)
            .sort((a, b) => a - b);

          const gst_entries = allPercents.map((percent) => ({
            gst_percent: igstMap[percent] ? percent : percent * 2,
            igst_percent: cgstMap[percent] || sgstMap[percent] ? "" : percent,
            igst_amount:
              cgstMap[percent] || sgstMap[percent] ? "" : igstMap[percent] || 0,
            cgst_percent: igstMap[percent] ? "" : percent,
            cgst_amount: igstMap[percent] ? "" : cgstMap[percent] || 0,
            sgst_percent: igstMap[percent] ? "" : percent,
            sgst_amount: igstMap[percent] ? "" : sgstMap[percent] || 0,
          }));

          const summary = allPercents.flatMap((percent) => {
            const entries = [];
            if (cgstMap[percent])
              entries.push({
                tax_type: "CGST",
                percent,
                total_amount: cgstMap[percent],
              });
            if (sgstMap[percent])
              entries.push({
                tax_type: "SGST",
                percent,
                total_amount: sgstMap[percent],
              });
            if (igstMap[percent])
              entries.push({
                tax_type: "IGST",
                percent,
                total_amount: igstMap[percent],
              });
            return entries;
          });

          setGroupedIgstPercentAndAmount(summary);
          setTotalDiscountAmountCheck(discountAmount);

          return {
            ...prev,
            discount_percent: newDiscount,
            items: updatedItems,
            gst_entries,
            order_amount: orderAmount.toFixed(2),
            gst_amount: totalGST.toFixed(2),
            cgst_amount: gstShow ? (totalGST / 2).toFixed(2) : "",
            sgst_amount: gstShow ? (totalGST / 2).toFixed(2) : "",
            igst_amount: !gstShow ? totalGST.toFixed(2) : "",
            discount_amount: discountAmount.toFixed(2),
            discounted_total: discounted.toFixed(2),
            total_amount: (totalGST + discounted).toFixed(2),
          };
        });

        return;
      }
    } else {
      let itemApiData = null;
      if (name === "item_id") {
        setPoInputs((prev) => ({
          ...prev,
          minimum_discount: activeDiscountData?.discount_percent,
        }));
        setPaymentTermShow(true);
        setOverallTotalDialog(true);
        try {
          const response = await axios.get(`public/api/items/${id_crypt}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Branch-Id": branchIds[0],
            },
            params: { po_flag },
          });
          console.log(response, "item_id");
          
          itemApiData = response.data.original;
        } catch (error) {
          toast.error(error.response?.data?.message || "Item error");
        }
      }

      setPoInputs((prev) => {
        const updatedItems = prev.items.map((item, i) => {
          if (i === index) {
            const updatedItem = { ...item, [name]: value };
            return [
              "item_price",
              "quantity",
              "discount_percent",
              "item_id",
            ].includes(name)
              ? recalculateItemDetails(
                  updatedItem,
                  itemApiData,
                  gstShow,
                  itemDiscountPercent
                )
              : updatedItem;
          }
          return item;
        });

        const totalGST = updatedItems.reduce(
          (sum, i) => sum + Number(i.item_gst_amount || 0),
          0
        );
        const orderAmount = updatedItems.reduce(
          (sum, i) => sum + Number(i.total_item_price || 0),
          0
        );
        const overallAmount = updatedItems.reduce(
          (sum, i) => sum + Number(i.overall_item_price || 0),
          0
        );
        const discountAmount = updatedItems.reduce(
          (sum, i) => sum + Number(i.discount_price || 0),
          0
        );
        const discounted = updatedItems.reduce(
          (sum, i) => sum + Number(i.discounted_amount || 0),
          0
        );

        const { entries, summary } = buildTaxSummary(updatedItems);
        setGroupedIgstPercentAndAmount(summary);
        setTotalDiscountAmountCheck(discountAmount);

        return {
          ...prev,
          items: updatedItems,
          gst_entries: entries,
          order_amount: orderAmount.toFixed(2),
          gst_amount: totalGST.toFixed(2),
          cgst_amount: gstShow ? (totalGST / 2).toFixed(2) : "",
          sgst_amount: gstShow ? (totalGST / 2).toFixed(2) : "",
          igst_amount: !gstShow ? totalGST.toFixed(2) : "",
          discount_amount: discountAmount.toFixed(2),
          discounted_total: discounted.toFixed(2),
          total_amount: (totalGST + discounted).toFixed(2),
        };
      });
    }
  };

  const handleAddItems = () => {
    setEditIdCrypt("");
    setPoInputs((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item_id: "",
          quantity: "",
          item_price: "",
          images: [],
          uploaded_images: [],
        },
      ],
    }));

    setShowCapturedImages({});

    setCameraOpen(false);
  };

  const handleCloseForDialog = () => {
    setOpenDialogForPurchaseOrder(false);
    setExpectedDeliveryShow(false);
    setLogisticsShow(false);
    setPaymentTermShow(false);
    setOverallTotalDialog(false);
    setCameraOpen(false);

    setIsPolishedShow(false);
    setItemsInputOpen(false);
  };

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmitForPurchaseOrder = async () => {
    try {
      const branchData = await getBranchDataFromBalaSilksDB();
      const branchIds =
        branchData?.map((branch) => branch.branch.id_crypt) || [];

      if (!branchIds.length) {
        toast.error("No valid branch ID found. Please sync or retry.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not authenticated. Please login again.");
        return;
      }

      // Submit Purchase Order to backend
      const response = await axios.post(
        `public/api/purchase-orders`,
        poInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      await fetchPurchaseOrderDatas();
      setOpenDialogForPurchaseOrder(false);
      triggerToast(
        "Success",
        "Purchase order created successfully!",
        "success"
      );
    } catch (error) {
      if (!navigator.onLine) {
        let offlinePO = { ...poInputs };

        // Convert images to base64 before saving
        if (poInputs?.images?.length) {
          const imagePromises = poInputs.images.map((img) =>
            convertFileToBase64(img)
          );
          const base64Images = await Promise.all(imagePromises);
          offlinePO.images = base64Images;
        }

        const pendingPOs = (await getDecryptedPosData()) || [];
        pendingPOs.push(offlinePO);

        await savePendingPOsData(pendingPOs); // Make sure this function saves the whole array

        triggerToast(
          "Success",
          "Saved locally (offline). Will sync when online.",
          "success"
        );
      } else {
        setRequiredFields(error.response?.data?.errors);
        toast.error(
          error.response?.data?.message || "Failed to submit purchase order"
        );
      }
    }
  };

  const handleUpdateForPurchaseOrder = async () => {
    try {
      const branchData = await getBranchDataFromBalaSilksDB();
      const branchIds = branchData.map((branch) => branch.branch.id_crypt);
      const token = localStorage.getItem("token");

      // poInputs.items = poInputs.items.filter((item) => item.item_id !== "");

      // console.log(updatedPoInputs, "updatedPoInputs");

      // Now send the updated data to server
      const response = await axios.put(
        `public/api/purchase-orders/${editIdCrypt}`,
        poInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
            "Content-Type": "application/json",
          },
        }
      );

      await fetchPurchaseOrderDatas();
      setOpenDialogForPurchaseOrder(false);
      triggerToast(
        "Success",
        "Purchase order updated successfully!",
        "success"
      );

      // toast.success("Purchase order updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      // toast.error(
      //   error.response?.data?.message || "Failed to update purchase order"
      // );
    }
  };

  const getGroupedGstData = (items) => {
    const group = {};
    console.log(items, "items buudyydddddddddddddddddddddddd");

    items.forEach((item) => {
      // IGST
      if (item.igst_percent) {
        const key = `igst-${item.igst_percent}`;
        const amount = Number(item.igst_amount || 0);
        const gstAmount = (amount * item.discount_percent) / 100;

        console.log(gstAmount, "gstAmounttttttttttttttt");

        if (group[key]) {
          group[key].total_amount += gstAmount;
        } else {
          group[key] = {
            tax_type: "igst",
            percent: item.igst_percent,
            total_amount: gstAmount,
          };
        }
      }

      // CGST
      if (item.cgst_percent) {
        const key = `cgst-${item.cgst_percent}`;
        const amount = Number(item.cgst_amount || 0);

        if (group[key]) {
          group[key].total_amount += amount;
        } else {
          group[key] = {
            tax_type: "cgst",
            percent: item.cgst_percent,
            total_amount: amount,
          };
        }
      }

      // SGST
      if (item.sgst_percent) {
        const key = `sgst-${item.sgst_percent}`;
        const amount = Number(item.sgst_amount || 0);

        if (group[key]) {
          group[key].total_amount += amount;
        } else {
          group[key] = {
            tax_type: "sgst",
            percent: item.sgst_percent,
            total_amount: amount,
          };
        }
      }
    });

    return Object.values(group);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...poInputs.items];
    updatedItems.splice(index, 1);

    const orderAmount = updatedItems.reduce(
      (total, item) => total + Number(item.total_item_price || 0),
      0
    );
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + Number(item.overall_item_price || 0),
      0
    );
    const gstAmount = updatedItems.reduce(
      (sum, item) => sum + Number(item.item_gst_amount || 0),
      0
    );

    const totalDiscountAmount = updatedItems.reduce((sum, itm) => {
      return sum + Number(itm.discount_price || 0);
    }, 0);

    const removeTotalDiscounted = updatedItems.reduce((sum, itm) => {
      return sum + Number(itm.discounted_amount || 0);
    }, 0);

    // ✅ Group GST after removing
    const updatedGroupedGst = getGroupedGstData(updatedItems);
    setGroupedIgstPercentAndAmount(updatedGroupedGst);

    // ✅ Recalculate gst_entries from updatedItems
    const igstMap = updatedItems.reduce((acc, item) => {
      const percent = Number(item.igst_percent || 0);
      const amount = Number(item.igst_amount || 0);
      if (percent > 0) acc[percent] = (acc[percent] || 0) + amount;
      return acc;
    }, {});

    const sgstMap = updatedItems.reduce((acc, item) => {
      const percent = Number(item.sgst_percent || 0);
      const amount = Number(item.sgst_amount || 0);
      if (percent > 0) acc[percent] = (acc[percent] || 0) + amount;
      return acc;
    }, {});

    const cgstMap = updatedItems.reduce((acc, item) => {
      const percent = Number(item.cgst_percent || 0);
      const amount = Number(item.cgst_amount || 0);
      if (percent > 0) acc[percent] = (acc[percent] || 0) + amount;
      return acc;
    }, {});

    const allPercents = [
      ...new Set([
        ...Object.keys(igstMap),
        ...Object.keys(sgstMap),
        ...Object.keys(cgstMap),
      ]),
    ]
      .map(Number)
      .sort((a, b) => a - b);

    const gst_entries = allPercents.map((percent) => {
      const hasIGST = igstMap[percent] > 0;
      const hasCGST_SGST = cgstMap[percent] > 0 || sgstMap[percent] > 0;

      return {
        gst_percent: hasIGST ? percent : percent * 2,
        cgst_percent: hasIGST ? "" : percent,
        cgst_amount: hasIGST ? "" : cgstMap[percent] || 0,
        sgst_percent: hasIGST ? "" : percent,
        sgst_amount: hasIGST ? "" : sgstMap[percent] || 0,
        igst_percent: hasCGST_SGST ? "" : percent,
        igst_amount: hasCGST_SGST ? "" : igstMap[percent] || 0,
      };
    });

    console.log(removeTotalDiscounted, "removeTotalDiscounted");

    // ✅ Finally, update all state
    setPoInputs((prev) => ({
      ...prev,
      items: updatedItems,
      order_amount: orderAmount.toFixed(2),
      gst_amount: gstAmount.toFixed(2),
      gst_entries,
      discount_amount: totalDiscountAmount.toFixed(2),
      discounted_total: removeTotalDiscounted.toFixed(2),
      total_amount: (gstAmount + removeTotalDiscounted).toFixed(2),
    }));
  };

  const handleUploadImages = (index) => {
    setActiveIndex(index);
    setCameraOpen(true);
  };

  const handleUploadDeviceImages = (e, index) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const convertToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    Promise.all(files.map(convertToBase64))
      .then((base64Images) => {
        setPoInputs((prev) => {
          const updatedItems = [...prev.items];
          const targetItem = { ...updatedItems[index] };

          // Append converted base64 images
          targetItem.uploaded_images = [
            ...(targetItem.uploaded_images || []),
            ...base64Images,
          ];

          updatedItems[index] = targetItem;

          setShowCapturedImages((prev) => ({
            ...prev,
            [index]: true,
          }));

          return {
            ...prev,
            items: updatedItems,
          };
        });
      })
      .catch((error) => {
        console.error("Error converting files to Base64:", error);
      });

    // Reset input value so the same file can be selected again
    e.target.value = "";
  };

  const handleRemoveCapturedImage = (itemIndex, imgIndex) => {
    setPoInputs((prev) => {
      const newItems = [...prev.items];
      newItems[itemIndex].images.splice(imgIndex, 1);
      return { ...prev, items: newItems };
    });
  };

  const handleRemoveUploadedImage = (itemIndex, imageIndex) => {
    setPoInputs((prev) => {
      const updatedItems = [...prev.items];
      const updatedImages = [...updatedItems[itemIndex].uploaded_images];
      updatedImages.splice(imageIndex, 1); // Remove by index

      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        uploaded_images: updatedImages,
      };

      return { ...prev, items: updatedItems };
    });
  };

  const handleEditPurchaseOrder = () => {
    setIsEditing(false);
    setShowInward(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <HeadersAndAddButton
            title={"Purchase Orders"}
            description={"A list of all purchase orders"}
            buttonName={"Add Purchase Order"}
            handleDialogOpen={handleDialogOpenForPurchaseOrder}
            buttonIcon={<BsCartPlusFill />}
            pdf={false}
          />
        </>
      )}

      <PurchaseOrderList
        setShowInward={setShowInward}
        poPaginationDatas={poPaginationDatas}
        setCurrentPage={setCurrentPage}
        fetchPurchaseOrderDatas={fetchPurchaseOrderDatas}
        setLoading={setLoading}
        loading={loading}
        setSaveBtn={setSaveBtn}
        setIsEditing={setIsEditing}
        setEditIdCrypt={setEditIdCrypt}
        setOpenDialogForPurchaseOrder={setOpenDialogForPurchaseOrder}
        setPoInputs={setPoInputs}
        fetchVendorsByArea={fetchVendorsByArea}
        setModeDeliveryShow={setModeDeliveryShow}
        setExpectedDeliveryShow={setExpectedDeliveryShow}
        setLogisticsShow={setLogisticsShow}
        fetchItemsByVendor={fetchItemsByVendor}
        setOverallTotalDialog={setOverallTotalDialog}
        handleShowImages={handleShowImages}
        handleUploadDeviceImages={handleUploadDeviceImages}
        setPoEditDatas={setPoEditDatas}
        setGroupedIgstPercentAndAmount={setGroupedIgstPercentAndAmount}
        groupedIgstPercentAndAmount={groupedIgstPercentAndAmount}
        setRequiredFields={setRequiredFields}
        setPendingStatusError={setPendingStatusError}
      />

      {OpenDialogForPurchaseOrder && (
        <Dialog
          open={OpenDialogForPurchaseOrder}
          onClose={() => {}}
          className="relative z-50"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

          <div
            className={`fixed inset-0 overflow-y-auto transition-all duration-400 ${
              collapsed ? "lg:ml-20" : "lg:ml-72"
            }`}
          >
            <div className="flex min-h-full items-center justify-center sm:p-4 text-center sm:p-10">
              {/* <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100 pb-4 text-left shadow-xl transition-all sm:my-8 w-full sm:w-full sm:max-w-7xl sm:p-0"> */}
              <DialogPanel
                className="
      relative transform overflow-y-auto bg-gray-100 text-left shadow-xl transition-all 
    w-screen h-screen rounded-none

      sm:fixed sm:inset-0 sm:w-screen sm:h-screen sm:overflow-auto

      md:fixed md:inset-0 md:w-screen md:h-screen md:overflow-auto

      lg:relative lg:rounded-lg lg:max-w-7xl lg:w-full lg:h-auto lg:overflow-visible
    "
              >
                {/* <div className="bg-[var(--dialog-bgcolor)] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Purchase Order
                  </h2>
                  <div className="flex gap-2">
                    {editIdCrypt && (
                      <PencilSquareIcon
                        onClick={handleEditPurchaseOrder}
                        className="h-5 w-5  cursor-pointer transition"
                      />
                    )}

                    <XMarkIcon
                      onClick={handleCloseForDialog}
                      className="h-5 w-5  cursor-pointer transition"
                    />
                  </div>
                </div> */}

                <DialogHeader
                  heading="Purchase Order"
                  headingIcon={
                    <UserCircleIcon className="h-8 w-8 text-[#134b90]" />
                  }
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  closeFunction={handleCloseForDialog}
                  editIcon={
                    isEditing ? (
                      <PencilIcon className="h-4 w-4 cursor-pointer transition" />
                    ) : null
                  }
                  closeIcon={
                    <XMarkIcon className="h-4 w-4 sm:h-8 sm:w-8 font-bold" />
                  }
                />

                <div className="bg-white border rounded-md border-gray-200 p-6">
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ${
                      vendorInput ? "lg:grid-cols-4" : "lg:grid-cols-3"
                    } gap-5 bg-gray-50 rounded-md `}
                  >
                    <div className="w-full col-span-1 sm:col-span-1">
                      <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                        <CalendarDateRangeIcon className="h-5 w-5 text-gray-400" />
                        <h4>
                          Purchase Date <span className="text-red-400">*</span>
                        </h4>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={poInputs.date}
                        placeholder="Purchase Date"
                        disabled
                        onChange={handleChangeForPurchaseOrder}
                        className="mt-1 bg-gray-100 w-full cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins"
                      />
                    </div>

                    <div className="w-full col-span-1 sm:col-span-1">
                      <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                        <CalendarDateRangeIcon className="h-5 w-5 text-gray-400" />
                        <h4>
                          PO Number <span className="text-red-400">*</span>
                        </h4>
                      </label>
                      <input
                        type="text"
                        name="po_number"
                        value={poInputs.po_number}
                        placeholder="Purchase No"
                        disabled
                        onChange={handleChangeForPurchaseOrder}
                        className="mt-1 w-full bg-gray-100 cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins"
                      />
                    </div>

                    <div className="w-full col-span-1">
                      <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        <h4>Area Name</h4>
                        <span className="text-red-400">*</span>
                      </label>
                      <div>
                        <Select
                          name="area_id"
                          options={areaDatas?.map((item) => ({
                            value: item.id,
                            label: item.name,
                            id_crypt: item.id_crypt,
                          }))}
                          value={
                            areaDatas
                              ?.filter((item) => item.id === poInputs?.area_id)
                              .map((item) => ({
                                value: item.id,
                                label: item.name,
                              }))[0] || null
                          }
                          onChange={(selectedOption) => {
                            console.log(selectedOption, "selectedOption");
                            handleChangeForPurchaseOrder({
                              target: {
                                name: "area_id",
                                value: selectedOption
                                  ? selectedOption.value
                                  : null,
                                id_crypt: selectedOption
                                  ? selectedOption.id_crypt
                                  : null, // pass id_crypt here
                              },
                            });
                          }}
                          className="w-full mt-2"
                          classNamePrefix="select"
                          isDisabled={isEditing}
                          menuPortalTarget={document.body} // Render in body
                          menuPosition="fixed" // Prevent overflow
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Set z-index high
                          }}
                        />
                      </div>
                      {requiredFields?.area_id && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields?.area_id[0]}
                        </p>
                      )}
                    </div>

                    {vendorInput && (
                      <div className="w-full col-span-1">
                        <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                          <UserGroupIcon className="h-5 w-5 text-gray-400" />
                          <h4>Vendor Name</h4>
                          <span className="text-red-400">*</span>
                        </label>
                        <div>
                          <Select
                            name="vendor_id"
                            options={vendorDatas?.map((item) => ({
                              value: item.id,
                              label: item.vendor_name,
                              id_crypt: item.id_crypt,
                            }))}
                            value={
                              vendorDatas
                                ?.filter(
                                  (item) => item.id === poInputs?.vendor_id
                                )
                                .map((item) => ({
                                  value: item.id,
                                  label: item.vendor_name,
                                }))[0] || null
                            }
                            onChange={(selectedOption) => {
                              console.log(selectedOption, "selectedOption");

                              handleChangeForPurchaseOrder({
                                target: {
                                  name: "vendor_id",
                                  value: selectedOption
                                    ? selectedOption.value
                                    : null,
                                  id_crypt: selectedOption
                                    ? selectedOption.id_crypt
                                    : null, // pass id_crypt here
                                },
                              });
                            }}
                            className="w-full mt-2"
                            classNamePrefix="select"
                            isDisabled={isEditing}
                            menuPortalTarget={document.body} // Render in body
                            menuPosition="fixed" // Prevent overflow
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Set z-index high
                            }}
                          />
                        </div>
                        {requiredFields?.vendor_id && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields?.vendor_id[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-4">
                    {paymentTermShow && (
                      <div>
                        <div className="col-span-1">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                            <span>
                              Payment Term{" "}
                              <span className="text-red-400">*</span>
                            </span>
                          </label>
                          <Select
                            name="payment_terms_id"
                            options={paymentTermsData?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))}
                            value={
                              paymentTermsData
                                ?.filter(
                                  (item) =>
                                    item.id === poInputs?.payment_terms_id
                                )
                                .map((item) => ({
                                  value: item.id,
                                  label: item.name,
                                }))[0] || null
                            }
                            onChange={(selectedOption) =>
                              handleChangeForPurchaseOrder({
                                target: {
                                  name: "payment_terms_id",
                                  value: selectedOption
                                    ? selectedOption.value
                                    : null,
                                },
                              })
                            }
                            isDisabled
                            className="mt-2"
                            classNamePrefix="select"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
                              control: (base) => ({
                                ...base,
                                backgroundColor: "#f3f4f6",
                                cursor: "not-allowed",
                              }),
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                        </div>
                        {requiredFields.payment_terms_id && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.payment_terms_id[0]}
                          </p>
                        )}
                      </div>
                    )}

                    {isPolishedShow && (
                      <div>
                        <div className="col-span-1">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <LightBulbIcon className="h-5 w-5 text-gray-400" />
                            <span>
                              Polished <span className="text-red-400">*</span>
                            </span>
                          </label>
                          <Select
                            name="is_polished"
                            options={polishedData?.map((item) => ({
                              value: item.value,
                              label: item.label,
                            }))}
                            value={
                              polishedData
                                ?.filter(
                                  (item) => item.value === poInputs?.is_polished
                                )
                                .map((item) => ({
                                  value: item.value,
                                  label: item.label,
                                }))[0] || null
                            }
                            onChange={(selectedOption) =>
                              handleChangeForPurchaseOrder({
                                target: {
                                  name: "is_polished",
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
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                        </div>
                        {requiredFields.is_polished && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.is_polished[0]}
                          </p>
                        )}
                      </div>
                    )}

                    {!modeDeliveryShow && (
                      <div>
                        <div className="col-span-1">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <CalendarDateRangeIcon className="h-5 w-5 text-gray-400" />
                            <span>
                              Mode Delivery{" "}
                              <span className="text-red-400">*</span>
                            </span>
                          </label>
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
                                    item.value === poInputs?.mode_of_delivery
                                )
                                .map((item) => ({
                                  value: item.value,
                                  label: item.label,
                                }))[0] || null
                            }
                            onChange={(selectedOption) =>
                              handleChangeForPurchaseOrder({
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
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                        </div>
                        {requiredFields.mode_of_delivery && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.mode_of_delivery[0]}
                          </p>
                        )}
                      </div>
                    )}

                    {expectedDeliveryShow && (
                      <div>
                        <div
                          className={`col-span-1 ${
                            poInputs.mode_of_delivery === "hand"
                              ? "sm:col-span-2"
                              : ""
                          }`}
                        >
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <CalendarDateRangeIcon className="h-5 w-5 text-gray-400" />
                            <span>
                              Expected Delivery{" "}
                              <span className="text-red-400">*</span>
                            </span>
                          </label>
                          <input
                            type="date"
                            name="expected_delivery_date"
                            min={new Date().toISOString().split("T")[0]}
                            value={poInputs.expected_delivery_date}
                            onChange={handleChangeForPurchaseOrder}
                            disabled={isEditing}
                            className={`mt-2 w-full ${
                              isEditing && "cursor-not-allowed opacity-50"
                            } border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                        </div>
                        {requiredFields.expected_delivery_date && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.expected_delivery_date[0]}
                          </p>
                        )}
                      </div>
                    )}

                    {logisticsShow && (
                      <div>
                        <div className="col-span-1">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <CalendarDateRangeIcon className="h-5 w-5 text-gray-400" />
                            <span>
                              Logistics <span className="text-red-400">*</span>
                            </span>
                          </label>
                          {/* <input
                          type="text"
                          name="logistics"
                          value={poInputs.logistics}
                          onChange={handleChangeForPurchaseOrder}
                          className="mt-1 w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Logistics"
                        /> */}

                          <Select
                            name="logistics"
                            options={logisticsDatas?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))}
                            value={
                              logisticsDatas
                                ?.filter(
                                  (item) => item.id === poInputs?.logistics
                                )
                                .map((item) => ({
                                  value: item.id,
                                  label: item.name,
                                }))[0] || null
                            }
                            onChange={(selectedOption) =>
                              handleChangeForPurchaseOrder({
                                target: {
                                  name: "logistics",
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
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                        </div>
                        {requiredFields.logistics && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.logistics[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* items */}
                  <div className="mt-8">
                    {itemsInputOpen && (
                      <>
                        <h4 className="text-md font-semibold text-gray-400 mb-2">
                          Items
                        </h4>
                        {requiredFields["items.0.item_id"] && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields["items.0.item_id"][0]}
                          </p>
                        )}
                        <div className="mt-4 flow-root">
                          <div className="overflow-x-auto border border-gray-300 rounded-md">
                            <div className="min-w-[1200px] lg:min-w-full">
                              {/* Header */}
                              <div
                                className={`grid grid-cols-12 gap-2 border-b border-gray-300 bg-gray-100`}
                              >
                                <div className="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 col-span-2">
                                  Items
                                </div>
                                <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1">
                                  GST %
                                </div>

                                <div
                                  className={`py-3.5 px-1 text-left text-sm font-semibold text-gray-900 ${
                                    showInward ? "col-span-1" : "col-span-2"
                                  } `}
                                >
                                  Item Price
                                </div>
                                <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1">
                                  Quantity
                                </div>
                                {showInward && (
                                  <>
                                    <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1">
                                      Inward Quantity
                                    </div>
                                    <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1">
                                      Pending Quantity
                                    </div>
                                  </>
                                )}

                                {/* <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1">
                                  check percent
                                </div> */}
                                <div
                                  className={`py-3.5 px-1 text-left text-sm font-semibold text-gray-900 ${
                                    showInward ? "col-span-1" : "col-span-2"
                                  }`}
                                >
                                  Q * P Total
                                </div>
                                <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1">
                                  Discount Price
                                </div>
                                <div className="py-3.5 px-1 text-left text-sm font-semibold text-gray-900 col-span-1">
                                  After discount
                                </div>

                                <div className="py-3.5 pr-4 text-center text-sm font-semibold text-gray-900 col-span-2">
                                  Actions
                                </div>
                              </div>

                              {/* Body */}
                              <div className={`divide-y divide-gray-200`}>
                                {poInputs.items.map((item, index) => (
                                  <>
                                    {item.item_status == 0 && (
                                      <p className="text-red-500 text-sm mt-1 p-1">
                                        Pending
                                      </p>
                                    )}
                                    {/* <div
                                      key={index}
                                      className={`grid  grid-cols-12 gap-2 items-center py-3  ${pendingStatusError && "bg-red-100"}`}
                                    > */}
                                    <div
                                      key={index}
                                      className={`grid grid-cols-12 gap-2 items-center py-3 ${
                                        item.item_status == 0
                                          ? "border border-red-400"
                                          : "bg-white"
                                      }`}
                                    >
                                      {/* Item */}
                                      <div className="pl-4 col-span-2">
                                        <Select
                                          name="item_id"
                                          options={itemDatas?.map((item) => ({
                                            value: item.id,
                                            label: item.item_name,
                                            id_crypt: item.id_crypt,
                                          }))}
                                          // options={
                                          //   itemDatas
                                          //     ?.filter((item) => {
                                          //       // Get all selected item IDs except the current row
                                          //       const selectedItemIds =
                                          //         poInputs.items
                                          //           ?.filter(
                                          //             (_, i) => i !== index
                                          //           )
                                          //           ?.map((i) => i.item_id);

                                          //       // Only show items not already selected in other rows
                                          //       return !selectedItemIds.includes(
                                          //         item.id
                                          //       );
                                          //     })
                                          //     ?.map((item) => ({
                                          //       value: item.id,
                                          //       label: item.item_name,
                                          //       id_crypt: item.id_crypt,
                                          //     })) || []
                                          // }
                                          value={
                                            itemDatas
                                              ?.filter(
                                                (item) =>
                                                  item.id ==
                                                  poInputs.items[index].item_id
                                              )
                                              .map((item) => ({
                                                value: item.id,
                                                label: item.item_name,
                                              }))[0] || null
                                          }
                                          onChange={(selectedOption) => {
                                            handleChangeForPurchaseOrder(
                                              {
                                                target: {
                                                  name: "item_id",
                                                  value: selectedOption
                                                    ? selectedOption.value
                                                    : null,
                                                  id_crypt: selectedOption
                                                    ? selectedOption.id_crypt
                                                    : null,
                                                },
                                              },
                                              index // Pass the index here too
                                            );
                                          }}
                                          className=""
                                          classNamePrefix="select"
                                          isDisabled={isEditing}
                                          menuPortalTarget={document.body} // Render in body
                                          menuPosition="fixed" // Prevent overflow
                                          styles={{
                                            menuPortal: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                            }), // Set z-index high
                                          }}
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
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrder(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full ${
                                            isEditing && "bg-gray-100"
                                          } cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                        />
                                      </div>
                                      {/* CGST Percent */}

                                      {/* {gstShow && (
                                        <>
                                          <div className="col-span-1">
                                            <input
                                              type="text"
                                              name="cgst_percent"
                                              value={
                                                item.cgst_percent
                                                  ? item.cgst_percent + "%"
                                                  : ""
                                              }
                                              placeholder="CGST"
                                              disabled
                                              onChange={(e) =>
                                                handleChangeForPurchaseOrder(
                                                  e,
                                                  index
                                                )
                                              } // Pass the index
                                              className={`w-full ${
                                                isEditing && "bg-gray-100"
                                              } cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                            />
                                          </div>

                                          <div className="col-span-1">
                                            <input
                                              type="text"
                                              name="sgst_percent"
                                              value={
                                                item.sgst_percent
                                                  ? item.sgst_percent + "%"
                                                  : ""
                                              }
                                              placeholder="SGST"
                                              disabled
                                              onChange={(e) =>
                                                handleChangeForPurchaseOrder(
                                                  e,
                                                  index
                                                )
                                              } // Pass the index
                                              className={`w-full ${
                                                isEditing && "bg-gray-100"
                                              } cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                            />
                                          </div>
                                        </>
                                      )} */}

                                      {/* {!gstShow && (
                                        <div className="col-span-1">
                                          <input
                                            type="text"
                                            name="igst_percent"
                                            value={
                                              item.igst_percent
                                                ? item.igst_percent + "%"
                                                : ""
                                            }
                                            placeholder="IGST"
                                            disabled={isEditing}
                                            onChange={(e) =>
                                              handleChangeForPurchaseOrder(
                                                e,
                                                index
                                              )
                                            } // Pass the index
                                            className={`w-full ${
                                              isEditing && "bg-gray-100"
                                            } rounded-md border text-right border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                                          />
                                        </div>
                                      )} */}

                                      {/* Purchase Price */}
                                      <div
                                        className={`${
                                          showInward
                                            ? "col-span-1"
                                            : "col-span-2"
                                        }`}
                                      >
                                        <input
                                          type="number"
                                          name="item_price"
                                          value={item.item_price}
                                          placeholder="0.00"
                                          disabled={isEditing}
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrder(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full ${
                                            isEditing && "bg-gray-100"
                                          }  rounded-md border text-right border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        />
                                      </div>

                                      {/* Quantity */}
                                      <div className={`col-span-1`}>
                                        <input
                                          type="number"
                                          name="quantity"
                                          value={item.quantity}
                                          placeholder="Quantity"
                                          disabled={isEditing}
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrder(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className={`w-full ${
                                            isEditing && "bg-gray-100"
                                          }  rounded-md border text-right border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        />
                                      </div>

                                      {/* Inward Quantity */}

                                      {showInward && (
                                        <>
                                          <div className={`col-span-1`}>
                                            <input
                                              type="number"
                                              name="inward_quantity"
                                              value={item.inward_quantity}
                                              placeholder="Inward Quantity"
                                              readOnly
                                              disabled={isEditing}
                                              onChange={(e) =>
                                                handleChangeForPurchaseOrder(
                                                  e,
                                                  index
                                                )
                                              } // Pass the index
                                              className={`w-full ${
                                                isEditing && "bg-gray-100"
                                              }  rounded-md border text-right border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                            />
                                          </div>

                                          {/* Pending Quantity */}

                                          <div className={`col-span-1`}>
                                            <input
                                              type="number"
                                              name="pending_quantity"
                                              value={item.pending_quantity}
                                              placeholder="Pending Quantity"
                                              disabled={isEditing}
                                              readOnly
                                              onChange={(e) =>
                                                handleChangeForPurchaseOrder(
                                                  e,
                                                  index
                                                )
                                              } // Pass the index
                                              className={`w-full ${
                                                isEditing && "bg-gray-100"
                                              }  rounded-md border text-right border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                            />
                                          </div>
                                        </>
                                      )}

                                      {/* <div className="">
                                        
                                      </div> */}
                                      <div
                                        className={`${
                                          editIdCrypt
                                            ? "col-span-1"
                                            : "col-span-2"
                                        }`}
                                      >
                                        <input
                                          type="text"
                                          name="discount_percent"
                                          value={item.discount_percent}
                                          placeholder="Discount Percent"
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrder(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          disabled
                                          className="w-full bg-gray-100 hidden text-right cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                        />
                                        <input
                                          type="text"
                                          name="total_item_price"
                                          value={item.total_item_price}
                                          placeholder="Total Amount"
                                          disabled
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrder(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className="w-full bg-gray-100 text-right cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                        />
                                      </div>
                                      <div className="col-span-1">
                                        <input
                                          type="text"
                                          name="discount_price"
                                          value={item.discount_price}
                                          placeholder="After Discount"
                                          disabled
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrder(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className="w-full bg-gray-100 text-right cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                        />
                                      </div>
                                      <div className="col-span-1">
                                        <input
                                          type="text"
                                          name="discounted_amount"
                                          value={item.discounted_amount}
                                          placeholder="Discounted"
                                          disabled
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrder(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className="w-full bg-gray-100 text-right cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                        />
                                      </div>
                                      {/* <div className="col-span-1">
                                        <input
                                          type="text"
                                          name="overall_item_price"
                                          value={item.overall_item_price}
                                          placeholder="Overall Total"
                                          disabled
                                          onChange={(e) =>
                                            handleChangeForPurchaseOrder(
                                              e,
                                              index
                                            )
                                          } // Pass the index
                                          className="w-full bg-gray-100 text-right cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                        />
                                      </div> */}

                                      {/* Camera Icon and Actions */}

                                      <div className="flex flex-wrap  justify-center items-center col-span-2 gap-2 sm:gap-3">
                                        {/* Capture Image */}
                                        <button
                                          type="button"
                                          disabled={isEditing}
                                          className="p-2 rounded-full hover:bg-gray-200"
                                          onClick={() =>
                                            handleUploadImages(index)
                                          }
                                          data-tooltip-id={`tooltip-camera-${index}`}
                                          data-tooltip-content="Turn On Camera"
                                        >
                                          <CameraIcon
                                            className={`h-5 w-5 text-blue-600 ${
                                              isEditing
                                                ? "cursor-not-allowed"
                                                : "cursor-pointer "
                                            }`}
                                          />
                                          <Tooltip
                                            id={`tooltip-camera-${index}`}
                                            place="top"
                                            effect="solid"
                                          />
                                        </button>

                                        {/* Upload from Device */}
                                        <input
                                          type="file"
                                          multiple
                                          disabled={isEditing}
                                          id={`fileInput-${index}`}
                                          className="hidden"
                                          onChange={(e) =>
                                            handleUploadDeviceImages(e, index)
                                          }
                                          accept="image/*"
                                        />
                                        <label
                                          htmlFor={`fileInput-${index}`}
                                          className="p-2 rounded-full hover:bg-gray-200"
                                          data-tooltip-id={`tooltip-upload-${index}`}
                                          data-tooltip-content="Upload from Device"
                                        >
                                          <ArrowUpCircleIcon
                                            className={`h-5 w-5 ${
                                              isEditing
                                                ? "cursor-not-allowed"
                                                : "cursor-pointer "
                                            } text-blue-600`}
                                          />
                                          <Tooltip
                                            id={`tooltip-upload-${index}`}
                                            place="top"
                                            effect="solid"
                                          />
                                        </label>

                                        {/* Remove Item */}
                                        <button
                                          type="button"
                                          disabled={isEditing}
                                          className={`p-2 rounded-full hover:bg-gray-200 ${
                                            isEditing
                                              ? "cursor-not-allowed"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            handleRemoveItem(index)
                                          }
                                          data-tooltip-id={`tooltip-remove-${index}`}
                                          data-tooltip-content="Remove This Item"
                                        >
                                          <XMarkIcon
                                            className={`h-5 w-5  ${
                                              isEditing
                                                ? "cursor-not-allowed"
                                                : "cursor-pointer "
                                            } text-red-600`}
                                          />
                                          <Tooltip
                                            id={`tooltip-remove-${index}`}
                                            place="top"
                                            effect="solid"
                                          />
                                        </button>

                                        {/* Toggle Captured Images */}
                                        {/* {item.images &&
                                          item.images.length > 0 && ( */}
                                        {((item.images &&
                                          item.images.length > 0) ||
                                          (item.uploaded_images &&
                                            item.uploaded_images.length >
                                              0)) && (
                                          <>
                                            <ChevronDownIcon
                                              data-tooltip-id={`toggle-tooltip-${index}`}
                                              data-tooltip-content={
                                                showCapturedImages[index]
                                                  ? "Close"
                                                  : "Open Captured Images"
                                              }
                                              className={`h-6 w-6 text-blue-600 cursor-pointer transition-transform duration-200 rounded-full hover:bg-gray-200 ${
                                                showCapturedImages[index]
                                                  ? "rotate-180"
                                                  : ""
                                              }`}
                                              onClick={() =>
                                                handleShowImages(index)
                                              }
                                            />
                                            <Tooltip
                                              id={`toggle-tooltip-${index}`}
                                              place="top"
                                              effect="solid"
                                            />
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex justify-end ">
                                      <div className="flex flex-wrap gap-2 mt-2 px-4">
                                        {showCapturedImages[index] && (
                                          <>
                                            <div className="flex flex-wrap gap-2 mt-2 mb-4">
                                              {(item.images || []).map(
                                                (imgSrc, imgIndex) => (
                                                  <div
                                                    key={imgIndex}
                                                    className="relative w-24 h-24 rounded overflow-hidden border border-gray-300"
                                                  >
                                                    {saveBtn === "save" ? (
                                                      <img
                                                        src={imgSrc}
                                                        alt={`Captured ${imgIndex}`}
                                                        className="w-full h-full object-cover"
                                                      />
                                                    ) : (
                                                      <img
                                                        src={
                                                          imgSrc.startsWith(
                                                            "data:"
                                                          )
                                                            ? imgSrc
                                                            : axios.defaults
                                                                .baseURL +
                                                              "/storage/app/public/" +
                                                              imgSrc
                                                        }
                                                        alt={`Captured ${imgIndex}`}
                                                        className="w-full h-full object-cover"
                                                      />
                                                    )}

                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        handleRemoveCapturedImage(
                                                          index,
                                                          imgIndex
                                                        )
                                                      }
                                                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700"
                                                    >
                                                      <XMarkIcon className="w-3 h-3" />
                                                    </button>
                                                  </div>
                                                )
                                              )}
                                            </div>

                                            {(item.uploaded_images || []).map(
                                              (file, fileIndex) => (
                                                <div
                                                  key={fileIndex}
                                                  className="relative w-24 h-24 rounded overflow-hidden border border-gray-300 mt-2"
                                                >
                                                  <img
                                                    src={
                                                      typeof file === "string"
                                                        ? file // Base64 string, use directly
                                                        : URL.createObjectURL(
                                                            file
                                                          ) // File object, create URL
                                                    }
                                                    alt={`Uploaded ${fileIndex}`}
                                                    className="w-full h-full object-cover"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleRemoveUploadedImage(
                                                        index,
                                                        fileIndex
                                                      )
                                                    }
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700"
                                                  >
                                                    <XMarkIcon className="w-3 h-3" />
                                                  </button>
                                                </div>
                                              )
                                            )}
                                          </>
                                        )}
                                      </div>
                                      {cameraOpen && activeIndex === index && (
                                        // <div className="flex  items-center gap-4 p-6">
                                        //   <div className="">
                                        //     <video
                                        //       id={`video-preview-${index}`}
                                        //       className="w-48 h-36 rounded border border-gray-300"
                                        //       autoPlay
                                        //       playsInline
                                        //     ></video>

                                        //     <button
                                        //       type="button"
                                        //       onClick={() =>
                                        //         handleCaptureImage(index)
                                        //       }
                                        //       className="bg-[#134b90] text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
                                        //     >
                                        //       <CameraIcon className="h-5 w-5" />
                                        //     </button>
                                        //   </div>
                                        // </div>

                                        <CameraSection
                                          index={index}
                                          poInputs={poInputs}
                                          setPoInputs={setPoInputs}
                                          showCapturedImages={
                                            showCapturedImages
                                          }
                                          setShowCapturedImages={
                                            setShowCapturedImages
                                          }
                                          setCameraStream={(stream) => {
                                            cameraStreamRef.current = stream;
                                          }}
                                        />
                                      )}
                                    </div>
                                  </>
                                ))}
                              </div>

                              {/* Add New Item */}
                              {!isEditing && (
                                <div className="mt-4 flex items-center px-4 mb-4">
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
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Amount View */}

                  {overallTotalDialog && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 sm:gap-4 rounded overflow-hidden mt-4">
                      <div className="col-span-2">
                        <div className="col-span-full mt-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            <span>Remarks</span>
                          </label>
                          <textarea
                            name="remarks"
                            disabled={isEditing}
                            value={poInputs.remarks}
                            onChange={handleChangeForPurchaseOrder}
                            className={`mt-1 ${
                              isEditing ? "bg-gray-100" : "bg-white"
                            } w-full  border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="Remarks"
                          />
                        </div>
                      </div>
                      <div className="col-span-2 border border-gray-200 mt-8 rounded-md ">
                        <div className="p-2 sm:p-4 border-b border-gray-200">
                          {/* <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              GST ₹
                            </label>
                            <input
                              type="text"
                              name="gst_amount"
                              value={poInputs.gst_amount || 0}
                              readOnly
                              className="text-right bg-gray-50 rounded px-2 py-1 w-32"
                            />
                          </div> */}

                          {/* {groupedIgstPercentAndAmount.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <label htmlFor="">Percent</label>
                               <h4>{item.percent}%</h4>
                                <label htmlFor="">Amount</label>

                               <p>{item.total_amount}</p>
                              </div>
                            )
                          )} */}

                          <div className="p-2  flex items-center justify-between border-b border-gray-200">
                            <label className="text-sm font-medium text-gray-700">
                              Sub Total ₹
                            </label>
                            <input
                              type="text"
                              name="order_amount"
                              value={poInputs.order_amount || 0}
                              readOnly
                              className="text-right bg-gray-50  rounded  py-1 w-32"
                            />
                          </div>

                          <div className="p-2  flex items-center justify-between border-gray-200">
                            <div>
                              <label className="text-sm flex items-center gap-2 text-gray-700">
                                Discount
                                <input
                                  type="text"
                                  name="discount_percent"
                                  value={poInputs.discount_percent}
                                  onChange={handleChangeForPurchaseOrder}
                                  className="px-1 text-right border border-gray-300  rounded  py-1 w-22"
                                />
                              </label>
                              {showDiscountError && (
                                <span className="text-yellow-500 text-sm">
                                  The discount value is below Requirement.
                                </span>
                              )}
                            </div>

                            {/* <input
                              type="text"
                              name="discount_percent"
                              value={`${poInputs.discount_percent || 0} %`}

                              readOnly
                              className="text-right bg-gray-50  rounded  py-1 w-32"
                            /> */}
                            <input
                              type="text"
                              name="discount_amount"
                              value={poInputs.discount_amount || 0}
                              readOnly
                              className="text-right bg-gray-50  rounded  py-1 w-22"
                            />
                          </div>

                          <div className="p-2  flex items-center justify-between border-b border-gray-200">
                            <label className="text-sm flex items-center gap-2 text-gray-700">
                              <p className=" inline-flex items-center rounded-md bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                {`Required discount ${poInputs.minimum_discount} %`}
                              </p>
                            </label>
                          </div>

                          <div className="p-2 flex items-center justify-between  border-gray-200">
                            <label className="text-sm font-medium text-gray-700">
                              After Discount Amount
                            </label>
                            <input
                              type="text"
                              name="discounted_total"
                              value={poInputs.discounted_total || 0}
                              readOnly
                              className="text-right bg-gray-50  rounded  py-1 w-32"
                            />
                          </div>

                          <div className="bg-white">
                            <div className="space-y-3 ">
                              {console.log(
                                groupedIgstPercentAndAmount,
                                "groupedIgstPercentAndAmount"
                              )}
                              {groupedIgstPercentAndAmount.map(
                                (item, index) => (
                                  console.log(item, "item"),
                                  (
                                    <div
                                      key={index}
                                      className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-4 items-center text-sm bg-gray-50 p-3 "
                                    >
                                      <div className="flex items-center gap-6">
                                        <span className="capitalize">
                                          {item?.tax_type}
                                        </span>
                                        <span>{item.percent}%</span>
                                      </div>

                                      <div className="flex items-center justify-end">
                                        <span className="">
                                          {item.total_amount}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                )
                              )}
                            </div>
                          </div>

                          {/* {groupedIgstPercentAndAmounts.length > 0 && (
                            groupedIgstPercentAndAmounts.map(
                              (item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between"
                                >
                                  <label className="text-sm font-medium text-gray-700">
                                    {item.igst_percent}%
                                  </label>
                                  <input
                                    type="text"
                                    name="igst_amount"
                                    value={item.amount || 0}
                                    readOnly
                                    className="text-right bg-gray-50 rounded px-2 py-1 w-32"
                                  />
                                   <label className="text-sm font-medium text-gray-700">
                                    {item.percent}%
                                  </label>
                                  <input
                                    type="text"
                                    name="igst_amount"
                                    value={item.amount || 0}
                                    readOnly
                                    className="text-right bg-gray-50 rounded px-2 py-1 w-32"
                                  />

                                </div>
                              )
                            )
                          )} */}

                          {/* {gstShow && (
                            <div className="mt-2 sm:ml-auto md:ml-0 w-1/2">
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-sm font-medium text-gray-700">
                                  CGST ₹
                                </label>
                                <input
                                  type="text"
                                  name="cgst_amount"
                                  value={poInputs.cgst_amount || 0}
                                  readOnly
                                  className="text-right bg-gray-50 rounded px-2 py-1 w-32"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">
                                  SGST ₹
                                </label>
                                <input
                                  type="text"
                                  name="sgst_amount"
                                  value={poInputs.sgst_amount || 0}
                                  readOnly
                                  className="text-right bg-gray-50 rounded px-2 py-1 w-32"
                                />
                              </div>
                            </div>
                          )} */}
                        </div>

                        {/* {!gstShow && (
                          <div className="p-2 sm:p-4 flex items-center justify-between border-b border-gray-200">
                            <label className="text-sm font-medium text-gray-700">
                              IGST ₹
                            </label>
                            <input
                              type="text"
                              name="igst_amount"
                              value={poInputs.igst_amount || 0}
                              readOnly
                              className="text-right bg-gray-50  rounded px-2 py-1 w-32"
                            />
                          </div>
                        )} */}

                        <div className="p-2 sm:p-4 flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">
                            Total ₹
                          </label>
                          <input
                            type="text"
                            name="total_amount"
                            value={"₹ " + poInputs.total_amount || 0}
                            readOnly
                            className="text-right bg-gray-50  rounded px-2 py-1 w-32 font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}

                  <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                    <button
                      type="button"
                      onClick={() => setOpenDialogForPurchaseOrder(false)}
                      className="text-sm cursor-pointer font-medium text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    {saveBtn === "save" ? (
                      // <button
                      //   type="submit"
                      //   // disabled={isSubmitting}
                      //   onClick={handleSubmitForPurchaseOrder}
                      //   className="inline-flex cursor-pointer items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-[#134b90] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      // >
                      //   Save
                      // </button>
                      <SaveButton saveFunction={handleSubmitForPurchaseOrder} />
                    ) : (
                      <button
                        type="submit"
                        // disabled={isSubmitting}
                        onClick={handleUpdateForPurchaseOrder}
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
    </>
  );
}

export default PurchaseOrderCreate;
