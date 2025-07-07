import React, { use, useEffect, useState } from "react";
import HeadersAndAddButton from "../Utils/HeadersAndAddButton";
import {
  Bars3CenterLeftIcon,
  ChevronDownIcon,
  InboxArrowDownIcon,
  PencilIcon,
  PhoneArrowDownLeftIcon,
  PlusCircleIcon,
  TrashIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/16/solid";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  MapPinIcon,
  PlusIcon,
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Select from "react-select";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import VendorsList from "./VendorsList";
import { toast } from "react-toastify";
import axios from "../Utils/AxiosInstance";
import { getBranchDataFromBalaSilksDB } from "../Utils/indexDB";
import Loader from "../Utils/Loader";
import AreaDialogBox from "../Masters/Area/AreaDialogBox";
import { useDialogForArea } from "../Context/AreaDialogContext";
import { useDialogForGroup } from "../Context/GroupDialogContext";
import GroupDialogBox from "../Masters/Groups/GroupDialogBox";
import { useDialogForItems } from "../Context/ItemDialogContext";
import ItemDialogBox from "../Masters/Items/ItemDialogBox";
import { useDialogForGstRegistration } from "../Context/GstRegistrationDialogContext";
import GstRegistrationDialogBox from "../Masters/GstRegistration/GstRegistrationDialogBox";
import { useDialogForCategory } from "../Context/CategoryDialogContext";
import CatergoryDialogBox from "../Masters/Category/CatergoryDialogBox";
import VendorGroupsDialogBox from "../Masters/VendorGroups/VendorGroupsDialogBox";
import { useDialogForVendorGroup } from "../Context/VendorGroupDialogContext";
import { useDialogForAgent } from "../Context/AgentDialogContext";
import AgentDialogBox from "../Masters/Agents/AgentDialogBox";
import { useDialogForEmployee } from "../Context/EmployeeDialogContext";
import { useToast } from "../Context/ToastProvider";
import { useSearch } from "../Context/SearchContext";
import { FaDownload } from "react-icons/fa";
import { FaUser, FaUsers } from "react-icons/fa6";
import SaveButton from "../Utils/SaveButton";
import DialogHeader from "../Utils/DialogHeader";

function VendorsCreate() {
  const {searchTerm} = useSearch();
  const { collapsed } = useOutletContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [saveBtn, setSaveBtn] = useState("save");
  const [activeTab, setActiveTab] = useState("Address Details"); // default selected tab
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [branchId, setBranchId] = useState([]);
  const [vendorsPagination, setVendorsPagination] = useState([]);
  const [categoryPagination, setCategoryPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPagination, setItemsPagination] = useState([]);
  const [statesPagination, setStatesPagination] = useState([]);
  const [citiesPagination, setCitiesPagination] = useState([]);
  const [areasPagination, setAreasPagination] = useState([]);
  const [groupPagination, setGroupPagination] = useState([]);
  const [tdsPagination, setTdsPagination] = useState([]);
  const [paymentTermsPagination, setPaymentTermsPagination] = useState([]);
  const [stateId, setStateId] = useState("");
  const [editIdCryptForVendors, setEditIdCryptForVendors] = useState("");
  const [getItems, setGetItems] = useState([]);
  const [filteredSource, setFilteredSource] = useState([]);
  const [agentsPagination, setAgentsPagination] = useState([]);
  const [hideInput, setHideInput] = useState(false);
  const [socialMediaPagination, setSocialMediaPagination] = useState([]);
  const [isOtherInput, setIsOtherInput] = useState(false);
  const [vendorsListPagination, setVendorsListPagination] = useState([]);
  const [gstRegistrationPagination, setGstRegistrationPagination] = useState(
    []
  );
  const [getTds, setGetTds] = useState([]);
  const [pincodePagination, setPincodePagination] = useState([]);
  const [phoneError, setPhoneError] = useState("");
  const [vendorsGroupPagination, setVendorsGroupPagination] = useState([]);
  const { triggerToast } = useToast();

  const [vendorInputs, setVendorInputs] = useState({
    vendor_name: "",
    vendor_code: "",
    group_id: "",
    vendor_group_id: "",
    gst_in: "",
    pan_number: "",
    phone: "",
    email: "",
    address_line_1: "",
    address_line_2: "",
    area_id: "",
    city: "",
    state: "",
    country: "",
    pincode_id: "",
    payment_term_id: "",
    credit_days: "",
    credit_limit: "",
    tds_detail_id: "",
    gst_applicable: "yes",
    gst_applicable_from: "",
    gst_registration_type_id: "",
    bank_account_no: "",
    ifsc_code: "",
    bank_name: "",
    bank_branch_name: "",
    transport_facility_provided: "no",
    remarks: "",
    referred_source_type: "",
    referred_source_id: "",
    items: [],
  });

  const [requiredFields, setRequiredFields] = useState({
    vendor_name: false,
    area_id: false,
  });

  const [vendorContactDetails, setVendorContactDetails] = useState([
    {
      name: "",
      phone_no: "",
      email: "",
      designation: "",
    },
  ]);

  const [upi, setUpi] = useState([
    {
      vendor_upi: "",
    },
  ]);
  const [agentType, setAgentType] = useState(false);

  const {
    openDialogForArea,
    setOpenDialogForArea,
    setSaveBtnForArea,
    setAreaPaginationData,
    areaPaginationData,
  } = useDialogForArea();

  const {
    openDialogForGroup,
    setOpenDialogForGroup,
    setSaveBtnForGroup,
    setGroupPaginationData,
    groupPaginationData,
    setGroupInputs,
  } = useDialogForGroup();

  const {
    itemInputs,
    setItemInputs,
    openDialogForItems,
    setOpenDialogForItems,
    editIdForItems,
    setEditIdForItems,
    saveBtnForItems,
    setSaveBtnForItems,
  } = useDialogForItems();

  const {
    gstRegistrationInputs,
    setGstRegistrationInputs,
    openDialogForGstRegistration,
    setOpenDialogForGstRegistration,
    setSaveBtnForGstRegistration,
    setGstRegistrationPaginationData,
    gstRegistrationPaginationData,
  } = useDialogForGstRegistration();

  const {
    openDialogForCategory,
    setOpenDialogForCategory,
    hideplusiconforcategory,
    setHidePlusIconForCategory,
  } = useDialogForCategory();

  const {
    openDialogForVendorGroup,
    setOpenDialogForVendorGroup,
    setVendorGroupInputs,
  } = useDialogForVendorGroup();

  const { openDialogForAgent, setOpenDialogForAgent } = useDialogForAgent();
  const { employeePaginationData, setEmployeePaginationData } =
    useDialogForEmployee();

    console.log(employeePaginationData, "employeePaginationData");
    

  const fetchVendors = async (page = 1) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    // Convert filters to query string
    const queryParams = new URLSearchParams({
      page,
    });

    try {
      //items
      const response = await axios.get(`public/api/items/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setItemsPagination(response.data);

      //categories

      const responseForCategories = await axios.get(
        `public/api/categories/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setCategoryPagination(responseForCategories?.data);

      //pincode

      const responseForPincode = await axios.get(`public/api/pincodes/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setPincodePagination(responseForPincode?.data);

      //vendors

      const responseForVendors = await axios.get(
        `public/api/vendors?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setVendorsPagination(responseForVendors.data.vendors);

      // Vendor Group
      fetchVendorGroupAfterDialogClose();

      const responseForVendorsList = await axios.get(
        `public/api/vendors/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setVendorsListPagination(responseForVendorsList.data);

      //areas
      fetchAreasAfterDialogClose();

      //groups

      fetchGroupsAfterDialogClose();

      //payment terms

      const responseForPaymentTerms = await axios.get(
        `public/api/payment-terms/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForPaymentTerms.data, "payment terms");

      setPaymentTermsPagination(responseForPaymentTerms.data);

      //tds

      const responseForTds = await axios.get(`public/api/tds-details/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setTdsPagination(responseForTds.data);


      //Agent

      await fetchAgentsAfterDialogClose();

      // GST Registration

      fetchGstRegistrationAfterDialogClose();

      //Social Media

      const responseForSocialMedia = await axios.get(
        `public/api/socialmedia/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setSocialMediaPagination(responseForSocialMedia.data);

      const responseForEmployee = await axios.get(`public/api/employees/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      console.log(responseForEmployee.data, "emploee");

      setEmployeePaginationData(responseForEmployee.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVendors(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (open) {
      const sundryGroup = groupPagination?.find(
        (item) => item.name === "Sundry Creditors"
      );

      // Set only if no group is selected yet
      if (sundryGroup && !vendorInputs.group_id) {
        setVendorInputs((prev) => ({
          ...prev,
          group_id: sundryGroup.id,
        }));
      }
    }
  }, [open, groupPagination]);

  useEffect(() => {
    if (agentType) {
      if (agentsPagination.length > 0) {
        handleChangeForVendors({
          target: {
            name: "referred_source_type",
            value: "agent",
          },
        });
      }
    }
  }, [agentsPagination]);

  useEffect(() => {
    if (vendorInputs?.referred_source_type === "agent") {
      setVendorInputs((prev) => ({
        ...prev,
        // reffered_source_id: ,
      }));
    }
  }, [vendorInputs?.reffered_source_type]);

  useEffect(() => {
    if (stateId) {
      const matchedState = statesPagination.find(
        (state) => state.id === stateId
      );

      if (matchedState?.cities) {
        setCitiesPagination(matchedState.cities);
      }
    }
  }, [vendorInputs?.state, statesPagination]);

  useEffect(() => {
    const state = location?.state;
    if (state?.showForm && state?.preservedForm && state?.from === "items") {
      setVendorInputs(state.preservedForm);
      setOpen(true);
    }
  }, [location]);

  useEffect(() => {
    if (vendorInputs?.items?.length && itemsPagination?.length) {
      const selectedItemObjects = itemsPagination?.filter((item) =>
        vendorInputs.items.includes(item.id)
      );

      setGetItems(selectedItemObjects);
    }
  }, [vendorInputs?.items, itemsPagination]);

  useEffect(() => {
    if (!openDialogForArea) {
      fetchAreasAfterDialogClose();
    }
  }, [openDialogForArea]);

  useEffect(() => {
    if (!openDialogForGroup) {
      fetchGroupsAfterDialogClose();
    }
  }, [openDialogForGroup]);

  useEffect(() => {
    if (!openDialogForItems) {
      fetchItemsAfterDialogClose();
    }
  }, [openDialogForItems]);

  useEffect(() => {
    if (!openDialogForGstRegistration) {
      fetchGstRegistrationAfterDialogClose();
    }
  }, [openDialogForGstRegistration]);

  async function fetchAreasAfterDialogClose() {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    setBranchId(branchIds);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page: 1,
      // ...filterData,
    });

    try {
      const response = await axios.get(`public/api/areas/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setAreasPagination(response?.data);
      setSaveBtnForArea("save");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch attribute values"
      );
    }
  }

  async function fetchGroupsAfterDialogClose() {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    setBranchId(branchIds);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page: 1,
      // ...filterData,
    });

    try {
      const responseForGroup = await axios.get(`public/api/groups/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setGroupPagination(responseForGroup.data);

      setSaveBtnForGroup("save");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch attribute values"
      );
    }
  }

  async function fetchItemsAfterDialogClose() {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page: 1,
      // ...filterData,
    });

    try {
      const responseForItems = await axios.get(`public/api/items/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setItemsPagination(responseForItems.data);

      setSaveBtnForItems("save");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch attribute values"
      );
    }
  }

  async function fetchGstRegistrationAfterDialogClose() {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page: 1,
      // ...filterData,
    });

    const responseForGstRegistration = await axios.get(
      `public/api/gst-registration-types/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchData.map((branch) => branch.branch.id_crypt),
        },
      }
    );

    setGstRegistrationPagination(responseForGstRegistration.data);
  }

  async function fetchVendorGroupAfterDialogClose() {
    //vendors group

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    const responseForVendorsGroup = await axios.get(
      `public/api/vendor-groups/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      }
    );
    console.log(responseForVendorsGroup, "vendor groups");

    setVendorsGroupPagination(responseForVendorsGroup.data);
  }

  async function fetchAgentsAfterDialogClose() {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    try {
      const responseForAgent = await axios.get(`public/api/agents/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      console.log(responseForAgent.data, "agents");

      setAgentsPagination(responseForAgent.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch attribute values"
      );
    }
  }

  useEffect(() => {
    fetchAgentsAfterDialogClose();
  }, []);

  const handleDialogOpen = (e) => {
    e.preventDefault();
    setOpen(true);
    setSaveBtn("save");
    setIsEditing(false);
    setGetItems([]);
    setEditIdCryptForVendors("");
  };

  const tabs = [
    // { name: "Items Details", current: false },
    { name: "Address Details", current: false },
    { name: "GST", current: false },
    { name: "Payment & Tax Details", current: false },
    { name: "Bank Details", current: false },
    { name: "Vendor Contact Details", current: false },
    // { name: "Others", current: false },
  ];

  const tabErrors = {
    "Address Details":
      requiredFields.address_line_1 ||
      requiredFields.pincode_id ||
      requiredFields.country ||
      requiredFields.state ||
      requiredFields.city,

    "GST":
      requiredFields.gst_applicable ||
      requiredFields.gst_number ||
      requiredFields.pan_number,

    "Payment & Tax Details": requiredFields.tds_detail_id, 
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }



  const searchVendorFetch=async(searchTerm)=>{
   const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      page: 1,
      search: searchTerm,
    })
    try {
      const responseForVendors = await axios.get(
        `public/api/vendors?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForVendors.data, "vendors");
      
      setVendorsPagination(responseForVendors.data.vendors);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }

  useEffect(() => {
    searchVendorFetch(searchTerm);
  }, [searchTerm]);

  const AddVendorInputs = (e) => {
    e.preventDefault();
    setOpen(true);
    setVendorInputs({
      vendor_name: "",
      vendor_code: "",
      group_id: "",
      gst_in: "",
      pan_number: "",
      phone: "",
      email: "",
      address_line_1: "",
      address_line_2: "",
      area_id: "",
      city: "",
      state: "",
      country: "",
      pincode_id: "",
      payment_term_id: "",
      credit_days: "",
      credit_limit: "",
      tds_detail_id: "",
      gst_applicable: "",
      gst_registration_type_id: "",
      bank_account_no: "",
      ifsc_code: "",
      bank_name: "",
      bank_branch_name: "",
      transport_facility_provided: "No",
      remarks: "",
      referred_source_type: "",
      referred_source_id: "",
      items: [],
    });
    setVendorContactDetails([
      ...vendorContactDetails,
      {
        name: "",
        phone: "",
        email: "",
        designation: "",
      },
    ]);
    setGetItems([]);

    setUpi([
      ...upi,
      {
        vendor_upi: "",
      },
    ]);
  };

  const handleFilteredSourceList = (type, referredId) => {
    let filteredSource = [];
    let isOther = false;

    switch (type) {
      case "agent":
        filteredSource =
          agentsPagination?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || [];
        break;

      case "social_media":
        filteredSource =
          socialMediaPagination?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || [];
        break;

      case "employees":
        filteredSource =
          employeePaginationData?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || [];
        break;

      case "vendor":
        filteredSource =
          vendorsListPagination?.map((item) => ({
            label: item.vendor_name,
            value: item.id,
          })) || [];
        break;

      case "others":
        isOther = true;
        break;

      default:
        filteredSource = [];
    }

    setFilteredSource(filteredSource);
    setIsOtherInput(isOther);

    // If it's not "others", set the value in the Select component
    if (!isOther) {
      const matchedOption = filteredSource.find(
        (option) => option.value === referredId
      );
      if (matchedOption) {
        setVendorInputs((prev) => ({
          ...prev,
          referred_source_id: matchedOption.value,
        }));
      }
    } else {
      // If "others", clear the select value and show input field
      setVendorInputs((prev) => ({
        ...prev,
        referred_source_id: "",
      }));
    }
  };

  const handleChangeForVendors = async (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    

    if (name === "phone") {
      if (value.length !== 10) {
        setPhoneError("Phone number should be exactly 10 digits");
      } else {
        setPhoneError("");
      }
    }
    if (name === "pincode_id") {
      const selectedIds = Array.isArray(value) ? value : [value];
      const selectedPincodeObjects = pincodePagination?.filter((item) =>
        selectedIds.includes(item.id)
      );

      const selectedPincode = selectedPincodeObjects[0]; // Assuming single select

      if (selectedPincode) {
        setVendorInputs((prev) => ({
          ...prev,
          country: selectedPincode.country,
          state: selectedPincode.state,
          city: selectedPincode.city,
        }));
      }
    }

    if (name === "items") {
      setActiveTab("Items Details");
      const selectedIds = Array.isArray(value) ? value : [value];
      const selectedItemObjects = itemsPagination?.filter((item) =>
        selectedIds.includes(item.id)
      );

      console.log(selectedItemObjects, "items");

      setGetItems(selectedItemObjects);
    }

    if (name === "tds_detail_id") {
      const selectedIds = Array.isArray(value) ? value : [value];
      const selectedItemObjects = tdsPagination?.filter((item) =>
        selectedIds.includes(item.id)
      );

      setGetTds(selectedItemObjects);
    }

    if (name === "referred_source_type") {
      let filteredSource = [];
      let showInput = false;
      let isOther = false;

      if (value === "employees") {
        setAgentType(false);
        filteredSource =
          employeePaginationData?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || [];
        showInput = true;
      }

      if (value === "vendor") {
        setAgentType(false);

        filteredSource =
          vendorsListPagination?.map((item) => ({
            label: item.vendor_name,
            value: item.id,
          })) || [];
        showInput = true;
      } else if (value === "agent") {
        setAgentType(true);
        filteredSource =
          agentsPagination?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || [];
        showInput = true;
      } else if (value === "social_media") {
        setAgentType(false);

        filteredSource =
          socialMediaPagination?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || [];
        showInput = true;
      } else if (value === "others") {
        setAgentType(false);

        isOther = true;
        showInput = true;
      } else if (value === "MD") {
        setAgentType(false);
        filteredSource = [];
        showInput = false;
      } else {
        showInput = true;
      }

      setHideInput(!showInput);
      setIsOtherInput(isOther);
      setFilteredSource(filteredSource);

      setVendorInputs((prev) => ({
        ...prev,
        referred_source_type: value,
        referred_source_id: "", // Clear old value
      }));

      return;
    }

    setVendorInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleChangeForVendorContactDetails = (e, index) => {
    const { name, value } = e.target;
    const newData = [...vendorContactDetails];
    newData[index][name] = value;
    setVendorContactDetails(newData);
  };

  const handleChangeForVendorUpi = (e, index) => {
    const { name, value } = e.target;
    const newData = [...upi];
    newData[index][name] = value;
    setUpi(newData);
  };

  const handleRemovevendorInputs = (index) => {
    const newData = [...vendorContactDetails];
    newData.splice(index, 1);
    setVendorContactDetails(newData);
  };

  const handleRemoveUpi = (index) => {
    const newData = [...upi];
    newData.splice(index, 1);
    setUpi(newData);
  };

  const handleCloseForDialog = async () => {
    setLoading(true);
    try {
      setEditIdCryptForVendors(null);
      setRequiredFields("");
      setVendorInputs({
        vendor_name: "",
        vendor_code: "",
        group_id: "",
        gst_in: "",
        pan_number: "",
        phone: "",
        email: "",
        address: "",
        area_id: "",
        city: "",
        state: "",
        country: "",
        pincode_id: "",
        payment_term_id: "",
        credit_days: "",
        credit_limit: "",
        tds_detail_id: "",
        gst_applicable: "",
        gst_applicable_from: "",
        gst_registration_type_id: "",
        bank_account_no: "",
        ifsc_code: "",
        bank_name: "",
        bank_branch_name: "",
        upi_id: "",
        transport_facility_provided: "No",
        remarks: "",
        referred_source_type: "",
        referred_source_id: "",
        items: [],
      });
      setOpen(false);
      navigate(location.pathname, { replace: true, state: {} });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForVendors = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const payload = {
      ...vendorInputs,
      vendor_contact_details: vendorContactDetails,
      vendor_upi: upi,
    };

    try {
      const response = await axios.post("public/api/vendors", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchId,
        },
      });

      setOpen(false);
      await fetchVendors();
      triggerToast("Success", "Vendor Created Successfully!", "success");
    } catch (error) {
      console.log(error, "AXIOS ERROR");

      if (error?.response?.status === 422) {
        // Laravel validation errors
        const validationErrors = error.response.data.errors;
        setRequiredFields(validationErrors);
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateForVendors = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const payload = {
      ...vendorInputs,
      vendor_contact_details: vendorContactDetails,
    };

    try {
      const responseForVendors = await axios.put(
        `public/api/vendors/${editIdCryptForVendors}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      triggerToast("Success", "Vendor Updated Successfully!", "success");

      setOpen(false);
      navigate(location.pathname, { replace: true, state: {} });
      await fetchVendors();
    } catch (error) {
      const validationErrors = error.response.data.errors;
      setRequiredFields(validationErrors);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const AddVendorContactDetailsInputs = () => {
    setVendorContactDetails((prevInputs) => [
      ...prevInputs,
      { name: "", phone: "", email: "", designation: "" },
    ]);
  };

  const AddUPI = () => {
    setUpi((prevInputs) => [...prevInputs, { vendor_upi: "" }]);
  };

  const handleTabClick = (e, tabName) => {
    e.preventDefault();
    setActiveTab(tabName);
  };

  const [refferedSource, setRefferedSource] = useState([
    {
      id: "Agent",
      value: "agent",
    },
    {
      id: "MD",
      value: "MD",
    },
    {
      id: "Employees",
      value: "employees",
    },
    {
      id: "Vendor",
      value: "vendor",
    },
    {
      id: "Social Media",
      value: "social_media",
    },
    {
      id: "Others",
      value: "others",
    },
  ]);

  const handleOpenAreaDialog = async () => {
    setOpenDialogForArea(true);
  };

  const handleOpenGroupDialog = async () => {
    setGroupInputs({
      name: "",
      is_active: "",
      discussion: "",
    });
    setOpenDialogForGroup(true);
  };

  const handleOpenVendorGroupDialog = async () => {
    setVendorGroupInputs({
      name: "",
      discussion: "",
    });
    setOpenDialogForVendorGroup(true);
  };

  const handleOpenItemsDialog = async () => {
    setEditIdForItems("");
    setOpenDialogForItems(true);
    setHidePlusIconForCategory("hide");

    setItemInputs({
      item_name: "",
      category_id: "",
      attributes: [],
      margin_percent: "",
      reorder_level: "",
      unit_of_measurement: "",
      item_code: "",
    });
  };

  const handleOpenGstRegistrationDialog = async () => {
    setGstRegistrationInputs({
      name: "",
      code: "",
      description: "",
    });
    setOpenDialogForGstRegistration(true);
  };

  const handleOpenAgent = async () => {
    setOpenDialogForAgent(true);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <HeadersAndAddButton
            title={"Vendors"}
            description={"A list of all Vendors report"}
            buttonName={"Add Vendors"}
            setOpen={setOpen}
            handleDialogOpen={handleDialogOpen}
            AddVendorInputs={AddVendorInputs}
            buttonIcon={<FaUsers />}
            pdfDownload={<FaDownload />}
            // pdfText={"Download Vendors Reports"}
            // pdf={true}
          />

          <VendorsList
            vendorsPagination={vendorsPagination}
            setCurrentPage={setCurrentPage}
            branchId={branchId}
            setVendorInputs={setVendorInputs}
            setOpen={setOpen}
            setLoading={setLoading}
            loading={loading}
            setStateId={setStateId}
            setSaveBtn={setSaveBtn}
            setEditIdCryptForVendors={setEditIdCryptForVendors}
            setVendorContactDetails={setVendorContactDetails}
            itemsPagination={itemsPagination}
            setGetItems={setGetItems}
            fetchVendors={fetchVendors}
            setRequiredFields={setRequiredFields}
            setGetTds={setGetTds}
            setUpi={setUpi}
            handleFilteredSourceList={handleFilteredSourceList}
            setIsEditing={setIsEditing}
          />

          {openDialogForArea && (
            <AreaDialogBox
              openDialogForArea={openDialogForArea}
              setOpenDialogForArea={setOpenDialogForArea}
            />
          )}

          {openDialogForVendorGroup && (
            <VendorGroupsDialogBox
              openDialogForVendorGroup={openDialogForVendorGroup}
              setOpenDialogForVendorGroup={setOpenDialogForVendorGroup}
              fetchVendorGroupAfterDialogClose={
                fetchVendorGroupAfterDialogClose
              }
              vendorFlag={true}
            />
          )}

          {openDialogForGroup && (
            <GroupDialogBox
              openDialogForGroup={openDialogForGroup}
              setOpenDialogForGroup={setOpenDialogForGroup}
            />
          )}

          {openDialogForItems && (
            <ItemDialogBox
              openDialogForItems={openDialogForItems}
              setOpenDialogForItems={setOpenDialogForItems}
              categoryPagination={categoryPagination}
              fetchItemsAfterDialogClose={fetchItemsAfterDialogClose}
              vendorFlag="true"
              hideplusiconforcategory={hideplusiconforcategory}
            />
          )}

          {openDialogForGstRegistration && (
            <GstRegistrationDialogBox
              openDialogForGstRegistration={openDialogForGstRegistration}
              setOpenDialogForGstRegistration={setOpenDialogForGstRegistration}
            />
          )}

          {openDialogForCategory && (
            <CatergoryDialogBox
              openDialogForCategory={openDialogForCategory}
              setOpenDialogForCategory={setOpenDialogForCategory}
              collapsed={collapsed}
            />
          )}

          {openDialogForAgent && (
            <AgentDialogBox
              openDialogForAgent={openDialogForAgent}
              setOpenDialogForAgent={setOpenDialogForAgent}
              fetchAgentsAfterDialogClose={fetchAgentsAfterDialogClose}
            />
          )}

          {open && (
            <Dialog open={open} onClose={() => {}} className="relative z-50">
              <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

              <div
                className={`fixed inset-0 overflow-y-auto transition-all duration-400 ${
                  collapsed ? "lg:ml-20" : "lg:ml-72"
                }`}
              >
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-10">
                  <DialogPanel className="relative transform overflow-hidden bg-white rounded-lg bg-gray-100  pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-0">
                    

                    {/* <div className="bg-white text-white p-4 flex items-center justify-between">
                      
                      <div className="flex items-center gap-2">
 <UserCircleIcon className="h-8 w-8 text-[#134b90]" />
                      <h2 className="text-xl font-semibold text-black sm:text-3xl">
                Add Vendor
              </h2>
                      </div>
                     
                      <div className="flex gap-2">
                        {isEditing && (
                          <div
                            onClick={() => setIsEditing(false)}
                            className="bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </div>
                        )}
                        <div
                          onClick={handleCloseForDialog}
                          className="text-black  p-2 rounded-full cursor-pointer hover:bg-red-200"
                        >
                          <XMarkIcon className="h-4 w-4 sm:h-8 sm:w-8 font-bold"  />
                        </div>
                      </div>
                    </div> */}

                    <DialogHeader heading="Add Vendor" headingIcon={<UserCircleIcon className="h-8 w-8 text-[#134b90]" />} isEditing={isEditing} setIsEditing={setIsEditing} closeFunction={handleCloseForDialog} editIcon={<PencilIcon className="h-4 w-4" />} closeIcon ={<XMarkIcon className="h-4 w-4 sm:h-8 sm:w-8 font-bold" />}/>

                    <div className="m-4 bg-white border rounded-md border-gray-200 p-4">
                      {/* <h3 className="text-lg font-semibold text-gray-400 mb-4 ">
                        Vendor Basic Details
                      </h3> */}

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:p-6 bg-gray-50 rounded-md ">
                        <div className="w-full col-span-1 sm:col-span-1">
                          <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                            <h4>
                              Vendor Name{" "}
                              <span className="text-red-400">*</span>
                            </h4>
                          </label>
                          <input
                            type="text"
                            placeholder="Vendor Name"
                            name="vendor_name"
                            value={vendorInputs.vendor_name}
                            onChange={handleChangeForVendors}
                            disabled={isEditing}
                            className={`mt-1 w-full ${
                              isEditing
                                ? "bg-gray-100 cursor-not-allowed"
                                : "bg-white"
                            } rounded-md  border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                          />
                          {requiredFields.vendor_name && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.vendor_name[0]}
                            </p>
                          )}
                        </div>
                        {editIdCryptForVendors && (
                          <div className="w-full col-span-1 sm:col-span-1">
                            <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                              <PhoneArrowDownLeftIcon className="h-5 w-5 text-gray-400" />
                              <h4>Vendor Code</h4>
                            </label>
                            <input
                              type="text"
                              name="vendor_code"
                              value={vendorInputs.vendor_code}
                              placeholder="Vendor Code"
                              onChange={handleChangeForVendors}
                              disabled={isEditing}
                              readOnly
                              className={`mt-1 w-full ${
                                isEditing
                                  ? "bg-gray-100 cursor-not-allowed"
                                  : "bg-white"
                              } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                            />
                          </div>
                        )}

                        <div className="w-full col-span-1 sm:col-span-1">
                          <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                            <PhoneArrowDownLeftIcon className="h-5 w-5 text-gray-400" />
                            <h4>
                              Vendor Phone{" "}
                              <span className="text-red-400">*</span>
                            </h4>
                          </label>
                          <input
                            type="number"
                            name="phone"
                            value={vendorInputs.phone}
                            placeholder="Vendor Phone"
                            onChange={handleChangeForVendors}
                            disabled={isEditing}
                            className={`mt-1 w-full ${
                              isEditing
                                ? "bg-gray-100 cursor-not-allowed"
                                : "bg-white"
                            } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                          />
                          {phoneError && (
                            <p className="text-red-500 text-sm mt-1">
                              {phoneError}
                            </p>
                          )}
                          {requiredFields.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.phone[0]}
                            </p>
                          )}
                        </div>

                        <div className="w-full col-span-1 sm:col-span-1">
                          <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                            <InboxArrowDownIcon className="h-5 w-5 text-gray-400" />
                            <h4>Email</h4>
                          </label>
                          <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            value={vendorInputs.email}
                            onChange={handleChangeForVendors}
                            disabled={isEditing}
                            className={`mt-1 w-full ${
                              isEditing
                                ? "bg-gray-100 cursor-not-allowed"
                                : "bg-white"
                            } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                          />
                          {requiredFields.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.email[0]}
                            </p>
                          )}
                        </div>

                        <div className="w-full col-span-1 sm:col-span-1">
                          <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                            <UserGroupIcon className="h-5 w-5 text-gray-400" />
                            <h4>Group</h4>
                            <PlusCircleIcon
                              className="h-5 w-5 text-blue-400 cursor-pointer"
                              onClick={handleOpenGroupDialog}
                            />
                          </label>
                          <div>
                            <Select
                              name="group_id"
                              options={groupPagination?.map((item) => ({
                                value: item.id,
                                label: item.name,
                              }))}
                              value={
                                groupPagination
                                  ?.filter(
                                    (item) => item.id === vendorInputs?.group_id
                                  )
                                  .map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                  }))[0] || null
                              }
                              onChange={(selectedOption) => {
                                handleChangeForVendors({
                                  target: {
                                    name: "group_id",
                                    value: selectedOption
                                      ? selectedOption.value
                                      : null,
                                  },
                                });
                              }}
                              className="w-full mt-2"
                              classNamePrefix="select"
                              isDisabled={isEditing}
                            />
                          </div>
                        </div>

                        <div className="w-full col-span-1 sm:col-span-1">
                          <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                            <UserGroupIcon className="h-5 w-5 text-gray-400" />
                            <h4>
                              Vendor Groups{" "}
                              {/* <span className="text-red-400">*</span> */}
                            </h4>
                            <PlusCircleIcon
                              className="h-5 w-5 text-blue-400 cursor-pointer"
                              onClick={handleOpenVendorGroupDialog}
                            />
                          </label>
                          <div>
                            <Select
                              name="vendor_group_id"
                              options={vendorsGroupPagination?.map((item) => ({
                                value: item.id,
                                label: item.name,
                              }))}
                              value={
                                vendorsGroupPagination
                                  ?.filter(
                                    (item) =>
                                      item.id === vendorInputs?.vendor_group_id
                                  )
                                  .map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                  }))[0] || null
                              }
                              onChange={(selectedOption) => {
                                handleChangeForVendors({
                                  target: {
                                    name: "vendor_group_id",
                                    value: selectedOption
                                      ? selectedOption.value
                                      : null,
                                  },
                                });
                              }}
                              className="w-full mt-2"
                              classNamePrefix="select"
                              isDisabled={isEditing}
                            />
                          </div>
                          {requiredFields.vendor_group_id && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.vendor_group_id[0]}
                            </p>
                          )}
                        </div>

                        <div className="w-full col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-2">
                          <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                            <Bars3CenterLeftIcon className="h-5 w-5 text-gray-400" />
                            <h4>
                              Area <span className="text-red-400">*</span>
                            </h4>
                            <PlusCircleIcon
                              className="h-5 w-5 text-blue-400 inline-block cursor-pointer"
                              onClick={handleOpenAreaDialog}
                            />
                          </label>
                          <Select
                            name="area_id"
                            options={areasPagination?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))}
                            value={
                              areasPagination
                                ?.filter(
                                  (item) => item.id === vendorInputs?.area_id
                                )
                                .map((item) => ({
                                  value: item.id,
                                  label: item.name,
                                }))[0] || null
                            }
                            onChange={(selectedOption) => {
                              handleChangeForVendors({
                                target: {
                                  name: "area_id",
                                  value: selectedOption
                                    ? selectedOption.value
                                    : null,
                                },
                              });
                            }}
                            className="w-full mt-2"
                            classNamePrefix="select"
                            isDisabled={isEditing}
                          />

                          {requiredFields.area_id && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.area_id[0]}
                            </p>
                          )}
                        </div>

                        {/* <div className="w-full col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
                          <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                            <Bars3CenterLeftIcon className="h-5 w-5 text-gray-400" />
                            <h4>Items</h4>
                            <PlusCircleIcon
                              className="h-5 w-5 text-blue-400 cursor-pointer"
                              onClick={handleOpenItemsDialog}
                            />
                          </label>
                          <Select
                            isMulti
                            name="items"
                            options={itemsPagination?.map((item) => ({
                              value: item.id,
                              label: item.item_name,
                            }))}
                            value={itemsPagination
                              ?.filter((item) =>
                                vendorInputs?.items?.includes(item.id)
                              )
                              .map((item) => ({
                                value: item.id,
                                label: item.item_name,
                              }))}
                            onChange={(selectedOptions) => {
                              handleChangeForVendors({
                                target: {
                                  name: "items",
                                  value: selectedOptions.map(
                                    (option) => option.value
                                  ),
                                },
                              });
                            }}
                            className="w-full mt-2"
                           
                            isDisabled={isEditing}
                            classNamePrefix="select"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
                              control: (base) => ({
                                ...base,
                                // backgroundColor: "#f3f4f6",
                                // cursor: "not-allowed",
                              }),
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}

                          />
                        </div> */}
                      </div>

                      <div className="mt-4 pb-5 sm:pb-0">
                        <div className="mt-4 sm:mt-4">
                          {/* <div className="grid grid-cols-1 sm:hidden">
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
                            />
                          </div> */}
                          <div className="block sm:block">
                            <div className="overflow-x-auto overflow-y-hidden  w-full">
                              <nav className="-mb-px inline-flex space-x-8 min-w-max">
                                {tabs.map((tab) => (
                                  <button
                                    key={tab.name}
                                    onClick={(e) => handleTabClick(e, tab.name)}
                                    className={classNames(
                                      tabErrors[tab.name]
                                        ? "text-red-600 border-red-500"
                                        : activeTab === tab.name
                                        ? "border-indigo-500 text-[#134b90]"
                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                      "border-b-2 px-1 pb-4 text-sm font-medium whitespace-nowrap"
                                    )}
                                  >
                                    {tab.name}
                                  </button>
                                ))}
                              </nav>
                            </div>
                          </div>

                          {/* {activeTab === "Items Details" && (
                            <div className="mb-2 p-4 rounded-md border border-gray-200 bg-gray-50 mt-4">
                              <h2 className="text-md font-semibold mb-4 font-poppins">
                                Items Details
                              </h2>
                              {getItems.length > 0 && (
                                <div className="p-4 border border-gray-200 rounded-md shadow-sm bg-white mt-4 mb-4">
                                  <h4 className="text-lg font-semibold text-gray-700">
                                    Selected Items
                                  </h4>
                                  <div className="mt-2 flow-root">
                                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                      <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
                                        <table className="min-w-full divide-y divide-gray-300">
                                          <thead>
                                            <tr>
                                              <th
                                                scope="col"
                                                className="text-center py-3.5 pr-3 pl-4  text-sm font-semibold text-gray-900 sm:pl-0"
                                              >
                                                S No
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-center py-3.5 pr-3 pl-4  text-sm font-semibold text-gray-900 sm:pl-0"
                                              >
                                                Item Name
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900"
                                              >
                                                Item Code
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900"
                                              >
                                                Category
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900"
                                              >
                                                Gst
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900"
                                              >
                                                Hsn Code
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900"
                                              >
                                                Unit of Measurement
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-200">
                                            {getItems?.map((item, index) => (
                                              <tr key={index}>
                                                <td className="py-4 pr-3 pl-4 text-center text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                                                  {index + 1}
                                                </td>
                                                <td className="py-4 pr-3 pl-4 text-center text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                                                  {item.item_name}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-center whitespace-nowrap text-gray-500">
                                                  {item.item_code}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-center whitespace-nowrap text-gray-500">
                                                  {item.category?.name}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-center whitespace-nowrap text-gray-500">
                                                  {item.category
                                                    ?.active_gst_percent
                                                    .gst_percent
                                                    ? item.category
                                                        ?.active_gst_percent
                                                        ?.gst_percent + "%"
                                                    : "N/A"}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-center whitespace-nowrap text-gray-500">
                                                  {item.category
                                                    ?.active_hsn_code.hsn_code
                                                    ? item.category
                                                        ?.active_hsn_code
                                                        ?.hsn_code
                                                    : "N/A"}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-center whitespace-nowrap text-gray-500">
                                                  {item.unit_of_measurement}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )} */}

                          {activeTab === "Address Details" && (
                            <div className="mb-2 p-4 rounded-md border border-gray-200 bg-gray-50 mt-4">
                              <h2
                                className={`text-md font-semibold mb-4 font-poppins`}
                              >
                                Address Details
                              </h2>
                              <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-2">
                                <div className="mt-2 sm:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Address Line 1{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <textarea
                                    type="text"
                                    rows={1}
                                    placeholder="Address"
                                    name="address_line_1"
                                    value={vendorInputs?.address_line_1 || ""}
                                    onChange={handleChangeForVendors}
                                    disabled={isEditing}
                                    className={`mt-1 w-full ${
                                      isEditing
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-white"
                                    } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                  />
                                  {requiredFields.address_line_1 && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {requiredFields.address_line_1[0]}
                                    </p>
                                  )}
                                </div>
                                <div className="mt-2 sm:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Address Line 2
                                  </label>
                                  <textarea
                                    type="text"
                                    rows={1}
                                    placeholder="Address"
                                    name="address_line_2"
                                    value={vendorInputs?.address_line_2 || ""}
                                    onChange={handleChangeForVendors}
                                    disabled={isEditing}
                                    className={`mt-1 w-full ${
                                      isEditing
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-white"
                                    } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                  />
                                </div>

                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Pincode{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <Select
                                    name="pincode_id"
                                    options={
                                      pincodePagination?.map((pincode) => ({
                                        value: pincode.id,
                                        label: pincode.pincode,
                                      })) || []
                                    }
                                    value={
                                      pincodePagination
                                        ?.map((pincode) => ({
                                          value: pincode.id,
                                          label: pincode.pincode,
                                        }))
                                        .find(
                                          (option) =>
                                            option.value ===
                                            vendorInputs?.pincode_id
                                        ) || null
                                    }
                                    onChange={(selectedOption) => {
                                      handleChangeForVendors({
                                        target: {
                                          name: "pincode_id",
                                          value: selectedOption?.value || null,
                                        },
                                      });
                                    }}
                                    className="w-full mt-2"
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                    menuPosition="fixed"
                                    classNamePrefix="select"
                                    isDisabled={isEditing}
                                  />
                                  {requiredFields.pincode_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {requiredFields.pincode_id[0]}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Country{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={vendorInputs?.country || ""}
                                    name="country"
                                    readOnly
                                    onChange={handleChangeForVendors}
                                    disabled={isEditing}
                                    className="mt-2 w-full  bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins"
                                  />

                                  {requiredFields.country && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {requiredFields.country[0]}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    State{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={vendorInputs?.state || ""}
                                    name="state"
                                    readOnly
                                    onChange={handleChangeForVendors}
                                    disabled={isEditing}
                                    className={`mt-2 w-full ${
                                      isEditing
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-white"
                                    } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                  />

                                  {requiredFields.state && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {requiredFields.state[0]}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    City <span className="text-red-400">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    readOnly
                                    value={vendorInputs?.city || ""}
                                    name="city"
                                    onChange={handleChangeForVendors}
                                    disabled={isEditing}
                                    className={`mt-2 w-full ${
                                      isEditing
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-white"
                                    } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                  />

                                  {requiredFields.city && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {requiredFields.city[0]}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {activeTab === "GST" && (
                            <div className="mb-2 p-4 rounded-md border border-gray-200 bg-gray-50 mt-4">
                              <h2 className="text-md font-semibold mb-4 font-poppins">
                                GST
                              </h2>
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="mt-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    GST Applicable{" "}
                                    <span className="text-red-400">*</span>
                                  </label>

                                  <div className="mt-2 flex items-center space-x-4 w-full bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins">
                                    <div>
                                      <input
                                        type="radio"
                                        id="yes"
                                        name="gst_applicable"
                                        value="yes"
                                        disabled={isEditing}
                                        checked={
                                          vendorInputs?.gst_applicable === "yes"
                                        }
                                        onChange={(e) =>
                                          handleChangeForVendors({
                                            target: {
                                              name: "gst_applicable",
                                              value: e.target.value,
                                            },
                                          })
                                        }
                                        className="h-4 w-4 text-[#134b90] focus:ring-indigo-500 border-gray-300"
                                      />
                                      <label
                                        htmlFor="yes"
                                        className="ml-2 text-sm text-gray-700"
                                      >
                                        Yes
                                      </label>
                                    </div>
                                    <div>
                                      <input
                                        type="radio"
                                        id="no"
                                        name="gst_applicable"
                                        value="no"
                                        disabled={isEditing}
                                        checked={
                                          vendorInputs?.gst_applicable === "no"
                                        }
                                        onChange={(e) =>
                                          handleChangeForVendors({
                                            target: {
                                              name: "gst_applicable",
                                              value: e.target.value,
                                            },
                                          })
                                        }
                                        className="h-4 w-4 text-[#134b90] focus:ring-indigo-500 border-gray-300"
                                      />
                                      <label
                                        htmlFor="no"
                                        className="ml-2 text-sm text-gray-700"
                                      >
                                        No
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Pan Number{" "}
                                    <span className="text-red-400">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="pan_number"
                                    value={vendorInputs?.pan_number || ""}
                                    placeholder="Pan Number"
                                    disabled={isEditing}
                                    onChange={handleChangeForVendors}
                                    className={`mt-3 w-full ${
                                      isEditing
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-white"
                                    } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                  />
                                  {requiredFields.pan_number && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {requiredFields.pan_number[0]}
                                    </p>
                                  )}
                                </div>

                                {/* Show the inputs if GST is applicable (Yes) */}
                                {vendorInputs?.gst_applicable === "yes" && (
                                  <>
                                    <div className="mt-2">
                                      <label className="inline-block text-sm font-medium text-gray-700">
                                        GST IN
                                      </label>
                                      <span className="text-red-400 mx-1">
                                        *
                                      </span>

                                      <input
                                        type="text"
                                        name="gst_in"
                                        value={vendorInputs?.gst_in || ""}
                                        placeholder="GSTIN"
                                        disabled={isEditing}
                                        onChange={handleChangeForVendors}
                                        className={`mt-2 w-full ${
                                          isEditing
                                            ? "bg-gray-100 cursor-not-allowed"
                                            : "bg-white"
                                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                      />
                                      {requiredFields.gst_in && (
                                        <p className="text-red-500 text-sm mt-1">
                                          {requiredFields.gst_in[0]}
                                        </p>
                                      )}
                                    </div>
                                    <div className="mt-2">
                                      <label className="block flex text-sm font-medium text-gray-700">
                                        GST Registration Type
                                        <PlusCircleIcon
                                          className="h-5 w-5 mx-2 text-blue-400 cursor-pointer"
                                          onClick={
                                            handleOpenGstRegistrationDialog
                                          }
                                        />
                                      </label>

                                      <Select
                                        name="gst_registration_type_id"
                                        options={gstRegistrationPagination?.map(
                                          (item) => ({
                                            value: item.id,
                                            label: item.name,
                                          })
                                        )}
                                        value={
                                          gstRegistrationPagination
                                            ?.filter(
                                              (item) =>
                                                item.id ===
                                                vendorInputs?.gst_registration_type_id
                                            )
                                            .map((item) => ({
                                              value: item.id,
                                              label: item.name,
                                            }))[0] || null
                                        }
                                        onChange={(selectedOption) => {
                                          handleChangeForVendors({
                                            target: {
                                              name: "gst_registration_type_id",
                                              value:
                                                selectedOption?.value || null,
                                            },
                                          });
                                        }}
                                        className="w-full mt-3"
                                        menuPortalTarget={document.body}
                                        styles={{
                                          menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 9999,
                                          }),
                                        }}
                                        menuPosition="fixed"
                                        classNamePrefix="select"
                                        isDisabled={isEditing}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {activeTab === "Bank Details" && (
                            <div className="mb-2 p-4 rounded-md border border-gray-200 bg-gray-50 mt-4">
                              <h2 className="text-md font-semibold mb-4 font-poppins">
                                Bank Details
                              </h2>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Bank Account No
                                  </label>
                                  <input
                                    type="text"
                                    name="bank_account_no"
                                    value={vendorInputs?.bank_account_no || ""}
                                    onChange={handleChangeForVendors}
                                    disabled={isEditing}
                                    placeholder="Bank Account No"
                                    className={`mt-1 w-full ${
                                      isEditing
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-white"
                                    } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                  />
                                </div>
                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    IFSC Code
                                  </label>
                                  <input
                                    type="text"
                                    name="ifsc_code"
                                    value={vendorInputs?.ifsc_code || ""}
                                    onChange={handleChangeForVendors}
                                    disabled={isEditing}
                                    placeholder="IFSC Code"
                                    className={`mt-1 w-full ${
                                      isEditing
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-white"
                                    } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                  />
                                </div>
                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Bank Name
                                  </label>
                                  <input
                                    type="text"
                                    name="bank_name"
                                    value={vendorInputs?.bank_name || ""}
                                    onChange={handleChangeForVendors}
                                    disabled={isEditing}
                                    placeholder="Bank Name"
                                    className={`mt-1 w-full ${
                                      isEditing
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-white"
                                    } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                  />
                                </div>
                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Bank Branch
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Bank Branch"
                                    value={vendorInputs?.bank_branch_name || ""}
                                    onChange={handleChangeForVendors}
                                    disabled={isEditing}
                                    name="bank_branch_name"
                                    className={`mt-1 w-full ${
                                      isEditing
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-white"
                                    } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                  />
                                </div>
                                <div className="mt-2 col-span-4">
                                  <label className="block text-sm font-medium text-gray-700">
                                    UPI ID
                                  </label>

                                  {/* Vendor Contact Details */}
                                  <div className="mb-6 p-4 rounded-md border border-gray-200 bg-gray-50 mt-4">
                                    <div className="overflow-x-auto">
                                      <div className="min-w-[800px] grid grid-cols-10 gap-6 font-medium text-gray-900 p-2 rounded-md">
                                        {/* <div className="col-span-2">Upi</div>
                                  
                                  <div className="col-span-1 text-right">
                                    Action
                                  </div> */}
                                      </div>

                                      {/* Vendor Contact Details */}
                                      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 gap-4">
                                        {upi.map((item, index) => (
                                          <div
                                            key={index}
                                            className="min-w-[300px] flex items-center gap-4  p-2 rounded-md bg-gray-50"
                                          >
                                            {/* UPI Input */}
                                            <input
                                              name="vendor_upi"
                                              type="text"
                                              value={item.vendor_upi}
                                              onChange={(e) =>
                                                handleChangeForVendorUpi(
                                                  e,
                                                  index
                                                )
                                              }
                                              placeholder="UPI ID"
                                              className={`block w-full ${
                                                isEditing
                                                  ? "bg-gray-100 cursor-not-allowed"
                                                  : "bg-white"
                                              } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                              disabled={isEditing}
                                            />

                                            {/* Remove Button */}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleRemoveUpi(index)
                                              }
                                              className="bg-red-500 text-white p-2 rounded-full"
                                            >
                                              <TrashIcon className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Add Vendor Button */}
                                    <button
                                      onClick={(e) => AddUPI(e)}
                                      className="bg-white cursor-pointer mt-1 text-blue-500 flex items-center"
                                    >
                                      <PlusCircleIcon className="w-6 h-6 text-blue-500" />
                                      <span className="ml-2">Add UPI</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeTab === "Vendor Contact Details" && (
                            <div className="mb-2 p-4 rounded-md border border-gray-200 bg-gray-50 mt-4">
                              {/* Header Row */}
                              <h2 className="text-md font-semibold mb-4 font-poppins">
                                Vendor Contact Details
                              </h2>
                              <div className="overflow-x-auto">
                                <div className="min-w-[800px] grid grid-cols-10 gap-6 font-medium text-gray-900 p-2 rounded-md">
                                  <div className="col-span-2">Name</div>
                                  <div className="col-span-2">Phone</div>
                                  <div className="col-span-3">Email</div>
                                  <div className="col-span-2">Designation</div>
                                  <div className="col-span-1 text-right">
                                    Action
                                  </div>
                                </div>

                                {/* Vendor Contact Details */}
                                {vendorContactDetails.map((item, index) => (
                                  <div
                                    key={index}
                                    className="min-w-[800px] grid grid-cols-10 gap-6 p-2 items-center"
                                  >
                                    {/* Name */}
                                    <div className="col-span-2">
                                      <input
                                        name="name"
                                        type="text"
                                        value={item.name}
                                        onChange={(e) =>
                                          handleChangeForVendorContactDetails(
                                            e,
                                            index
                                          )
                                        }
                                        placeholder="Name"
                                        className={`block w-full ${
                                          isEditing
                                            ? "bg-gray-100 cursor-not-allowed"
                                            : "bg-white"
                                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                        disabled={isEditing}
                                      />
                                    </div>

                                    {/* Phone */}
                                    <div className="col-span-2">
                                      <input
                                        name="phone_no"
                                        type="number"
                                        value={item.phone_no}
                                        onChange={(e) =>
                                          handleChangeForVendorContactDetails(
                                            e,
                                            index
                                          )
                                        }
                                        placeholder="Phone"
                                        className={`block w-full ${
                                          isEditing
                                            ? "bg-gray-100 cursor-not-allowed"
                                            : "bg-white"
                                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        disabled={isEditing}
                                      />
                                    </div>

                                    {/* Email */}
                                    <div className="col-span-3">
                                      <input
                                        name="email"
                                        type="email"
                                        value={item.email}
                                        onChange={(e) =>
                                          handleChangeForVendorContactDetails(
                                            e,
                                            index
                                          )
                                        }
                                        placeholder="Email"
                                        className={`block w-full ${
                                          isEditing
                                            ? "bg-gray-100 cursor-not-allowed"
                                            : "bg-white"
                                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                        disabled={isEditing}
                                      />
                                    </div>

                                    {/* Designation */}
                                    <div className="col-span-2">
                                      <input
                                        name="designation"
                                        type="text"
                                        value={item.designation}
                                        onChange={(e) =>
                                          handleChangeForVendorContactDetails(
                                            e,
                                            index
                                          )
                                        }
                                        placeholder="Designation"
                                        className={`block w-full ${
                                          isEditing
                                            ? "bg-gray-100 cursor-not-allowed"
                                            : "bg-white"
                                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                        disabled={isEditing}
                                      />
                                    </div>

                                    {/* Remove Button */}
                                    <div className="col-span-1 flex items-center justify-end">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemovevendorInputs(index)
                                        }
                                        className="bg-red-500 text-white p-2 rounded-full"
                                      >
                                        <XMarkIcon className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Add Vendor Button */}
                              <button
                                onClick={(e) =>
                                  AddVendorContactDetailsInputs(e)
                                }
                                className="bg-white cursor-pointer mt-1 text-blue-500 flex items-center"
                              >
                                <PlusCircleIcon className="w-6 h-6 text-blue-500" />
                                <span className="ml-2">Add Vendor</span>
                              </button>
                            </div>
                          )}

                          {activeTab === "Payment & Tax Details" && (
                            <>
                              <div className="mb-2 p-4 rounded-md border border-gray-200 bg-gray-50 mt-4">
                                <h2 className="text-md font-semibold mb-4 font-poppins">
                                  Payment & Tax Details
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Payment Term
                                    </label>
                                    <Select
                                      name="payment_term_id"
                                      options={paymentTermsPagination?.map(
                                        (item) => ({
                                          value: item.id,
                                          label: item.name,
                                        })
                                      )}
                                      value={
                                        paymentTermsPagination
                                          ?.filter(
                                            (item) =>
                                              item.id ===
                                              vendorInputs?.payment_term_id
                                          )
                                          .map((item) => ({
                                            value: item.id,
                                            label: item.name,
                                          }))[0] || null
                                      }
                                      onChange={(selectedOption) => {
                                        handleChangeForVendors({
                                          target: {
                                            name: "payment_term_id",
                                            value: selectedOption
                                              ? selectedOption.value
                                              : null,
                                          },
                                        });
                                      }}
                                      className="w-full mt-2"
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                        }),
                                      }}
                                      menuPosition="fixed"
                                      classNamePrefix="select"
                                      isDisabled={isEditing}
                                    />
                                  </div>

                                  <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      TDS Details{" "}
                                      <span className="text-red-400">*</span>
                                    </label>
                                    <Select
                                      name="tds_detail_id"
                                      options={tdsPagination?.map((item) => ({
                                        value: item.id,
                                        label: item.name,
                                      }))}
                                      value={
                                        tdsPagination
                                          ?.filter(
                                            (item) =>
                                              item.id ===
                                              vendorInputs?.tds_detail_id
                                          )
                                          .map((item) => ({
                                            value: item.id,
                                            label: item.name,
                                          }))[0] || null
                                      }
                                      onChange={(selectedOption) => {
                                        handleChangeForVendors({
                                          target: {
                                            name: "tds_detail_id",
                                            value: selectedOption
                                              ? selectedOption.value
                                              : null,
                                          },
                                        });
                                      }}
                                      className="w-full mt-2"
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                        }),
                                      }}
                                      menuPosition="fixed"
                                      classNamePrefix="select"
                                      isDisabled={isEditing}
                                    />
                                    {requiredFields.tds_detail_id && (
                                      <p className="text-red-500 text-sm mt-1">
                                        {requiredFields.tds_detail_id[0]}
                                      </p>
                                    )}
                                  </div>

                                  <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Credit Days
                                    </label>
                                    <input
                                      type="text"
                                      name="credit_days"
                                      placeholder="Credit Days"
                                      onChange={handleChangeForVendors}
                                      disabled={isEditing}
                                      value={vendorInputs?.credit_days || ""}
                                      className={`mt-2 w-full ${
                                        isEditing
                                          ? "bg-gray-100 cursor-not-allowed"
                                          : "bg-white"
                                      } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Credit Limit
                                    </label>
                                    <input
                                      type="text"
                                      value={vendorInputs?.credit_limit || ""}
                                      name="credit_limit"
                                      onChange={handleChangeForVendors}
                                      disabled={isEditing}
                                      placeholder="Credit Limit"
                                      className={`mt-2 w-full ${
                                        isEditing
                                          ? "bg-gray-100 cursor-not-allowed"
                                          : "bg-white"
                                      } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                    />
                                  </div>
                                </div>
                              </div>
                              {getTds.length > 0 && (
                                <div className="p-4 border border-gray-200 rounded-md shadow-sm bg-white mt-4 mb-4">
                                  <h4 className="text-sm font-semibold text-gray-700 ">
                                    Select Tds Details
                                  </h4>
                                  <div className="mt-2 flow-root">
                                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                      <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
                                        <table className="min-w-full divide-y divide-gray-300">
                                          <thead>
                                            <tr>
                                              <th className="text-center text-sm font-semibold text-gray-900 sm:pl-0">
                                                S No
                                              </th>
                                              <th className="text-center text-sm font-semibold text-gray-900 sm:pl-0">
                                                TDS Name
                                              </th>
                                              <th className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                                                Percent With PAN
                                              </th>
                                              <th className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                                                Percent Without PAN
                                              </th>
                                              <th className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                                                Amount Limit
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-200">
                                            {getTds.map((getTds, index) => (
                                              <tr key={index}>
                                                <td className="whitespace-nowrap py-4 text-center text-sm font-medium text-gray-900 sm:pl-0">
                                                  {index + 1}
                                                </td>
                                                <td className="whitespace-nowrap py-4 text-center text-sm font-medium text-gray-900 sm:pl-0">
                                                  {getTds.name}
                                                </td>
                                                <td className="whitespace-nowrap py-4 text-center text-sm font-medium text-gray-900 sm:pl-0">
                                                  {getTds?.tds_section
                                                    ?.percent_with_pan
                                                    ? getTds?.tds_section
                                                        ?.percent_with_pan
                                                    : "N/A"}
                                                </td>
                                                <td className="whitespace-nowrap py-4 text-center text-sm font-medium text-gray-900 sm:pl-0">
                                                  {getTds?.tds_section
                                                    ?.percent_without_pan
                                                    ? getTds?.tds_section
                                                        ?.percent_without_pan
                                                    : "N/A"}
                                                </td>
                                                <td className="whitespace-nowrap py-4 text-center text-sm font-medium text-gray-900 sm:pl-0">
                                                  {getTds?.tds_section
                                                    ?.amount_limit
                                                    ? getTds?.tds_section
                                                        ?.amount_limit
                                                    : "N/A"}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {/* {activeTab === "Others" && (
                            <div className="mb-2 p-4 rounded-md border border-gray-200 bg-gray-50 mt-4 ">
                              <h2 className="text-md font-semibold mb-4 font-poppins">
                                Others
                              </h2>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Transport Facility Provided
                                  </label>
                                  <div className="mt-2 flex items-center space-x-4 w-full bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins">
                                    <div>
                                      <input
                                        type="radio"
                                        id="transportYes"
                                        name="transport_facility_provided"
                                        value="yes"
                                        checked={
                                          vendorInputs?.transport_facility_provided ===
                                          "yes"
                                        }
                                        onChange={handleChangeForVendors}
                                        className="h-4 w-4 text-[#134b90] focus:ring-indigo-500 border-gray-300"
                                      />
                                      <label
                                        htmlFor="transportYes"
                                        className="ml-2 text-sm text-gray-700"
                                      >
                                        Yes
                                      </label>
                                    </div>
                                    <div>
                                      <input
                                        type="radio"
                                        id="transportNo"
                                        name="transport_facility_provided"
                                        value="no"
                                        checked={
                                          vendorInputs?.transport_facility_provided ===
                                          "no"
                                        }
                                        onChange={handleChangeForVendors}
                                        className="h-4 w-4 text-[#134b90] focus:ring-indigo-500 border-gray-300"
                                      />
                                      <label
                                        htmlFor="transportNo"
                                        className="ml-2 text-sm text-gray-700"
                                      >
                                        No
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Remarks (Transporter Name)
                                  </label>
                                  <input
                                    type="text"
                                    name="remarks"
                                    value={vendorInputs?.remarks || ""}
                                    placeholder="Transporter Name"
                                    onChange={handleChangeForVendors}
                                    className={`mt-2 w-full ${
                                      isEditing
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : "bg-white"
                                    } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                  />
                                </div>
                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Referred Source
                                  </label>

                                  <Select
                                    name="referred_source_type"
                                    options={
                                      refferedSource?.map((reffered) => ({
                                        value: reffered.value,
                                        label: reffered.id,
                                      })) || []
                                    }
                                    value={
                                      refferedSource
                                        ?.map((reffered) => ({
                                          value: reffered.value,
                                          label: reffered.id,
                                        }))
                                        .find(
                                          (option) =>
                                            option.value ===
                                            vendorInputs.referred_source_type
                                        ) || null
                                    }
                                    onChange={(selectedOption) => {
                                      handleChangeForVendors({
                                        target: {
                                          name: "referred_source_type",
                                          value: selectedOption?.value || null,
                                        },
                                      });
                                    }}
                                    className="w-full mt-2"
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                    menuPosition="fixed"
                                    classNamePrefix="select"
                                  />
                                </div>

                                {!hideInput && (
                                  <div className="mt-2">
                                    <div className="flex space-x-2">
                                      <label className="block text-sm font-medium text-gray-700">
                                        Referred By
                                      </label>
                                      {agentType && (
                                        <PlusCircleIcon
                                          className="w-5 h-5 text-blue-500 cursor-pointer"
                                          onClick={handleOpenAgent}
                                        />
                                      )}
                                    </div>

                                    {isOtherInput ? (
                                      <input
                                        type="text"
                                        name="referred_source_id"
                                        value={
                                          vendorInputs?.referred_source_id || ""
                                        }
                                        onChange={handleChangeForVendors}
                                        className={`mt-1 w-full ${
                                          isEditing
                                            ? "bg-gray-100 cursor-not-allowed"
                                            : "bg-white"
                                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                                        placeholder="Enter referred by manually"
                                      />
                                    ) : (
                                      <Select
                                        name="referred_source_id"
                                        options={
                                          filteredSource?.map((reffered) => ({
                                            value: reffered.value,
                                            label: reffered.label,
                                          })) || []
                                        }
                                        value={
                                          filteredSource?.find(
                                            (option) =>
                                              option.value ===
                                              vendorInputs?.referred_source_id
                                          ) || null
                                        }
                                        onChange={(selectedOption) => {
                                          handleChangeForVendors({
                                            target: {
                                              name: "referred_source_id",
                                              value:
                                                selectedOption?.value || null,
                                            },
                                          });
                                        }}
                                        className="w-full mt-2"
                                        menuPortalTarget={document.body}
                                        styles={{
                                          menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 9999,
                                          }),
                                        }}
                                        menuPosition="fixed"
                                        classNamePrefix="select"
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )} */}
                        </div>
                      </div>

                      {/* Buttons */}

                      <div className=" flex items-center justify-end gap-x-4 p-2">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                        {saveBtn === "save" ? (
                          // <button
                          //   type="submit"
                          //   // disabled={isSubmitting}
                          //   onClick={handleSubmitForVendors}
                          //   className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                          // >
                          //   Save
                          // </button>
                          <SaveButton saveFunction={handleSubmitForVendors} />
                        ) : (
                          <button
                            type="submit"
                            // disabled={isSubmitting}
                            onClick={handleUpdateForVendors}
                            className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
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
      )}
    </>
  );
}

export default VendorsCreate;
