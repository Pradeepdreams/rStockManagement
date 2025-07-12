import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import {
  Bars3CenterLeftIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  InboxArrowDownIcon,
  NumberedListIcon,
  PencilIcon,
  PercentBadgeIcon,
  PhoneArrowDownLeftIcon,
  PlusCircleIcon,
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
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Select from "react-select";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import ItemList from "./ItemList";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import TopFilters from "../../Utils/TopFilters";
import { useDialogForItems } from "../../Context/ItemDialogContext";
import ItemDialogBox from "./ItemDialogBox";
import { useDialogForCategory } from "../../Context/CategoryDialogContext";
import CatergoryDialogBox from "../Category/CatergoryDialogBox";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";
import { AiOutlineProduct } from "react-icons/ai";

function ItemCreate({ fetchItemsAfterDialogClose }) {
  const {
    itemInputs,
    setItemInputs,
    openDialogForItems,
    setOpenDialogForItems,
    setSaveBtnForItems,
    setEditIdForItems,
  } = useDialogForItems();
  const {
    openDialogForCategory,
    setOpenDialogForCategory,
    hideplusiconforcategory,
    setHidePlusIconForCategory,
    setCategoryInputs,
    categoryInputs,
    setSaveBtnForCategory,
  } = useDialogForCategory();

  const { collapsed } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const showForm = location?.state?.showForm || false;
  const preservedForm = location?.state?.preservedForm || {};
  const from = location?.state?.from || {};
  const { triggerToast } = useToast();

  const [open, setOpen] = useState(false);
  const [itemPagination, setItemPagination] = useState([]);
  const [branchId, setBranchId] = useState([]);
  const [saveBtn, setSaveBtn] = useState("save");
  const [idCryptForItems, setIdCryptForItems] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFilter, setActiveFilter] = useState({});
  const [categoryPagination, setCategoryPagination] = useState([]);
  const [attributeFields, setAttributeFields] = useState([]);
  const [marginError, setMarginError] = useState("");
  const [attributesId, setAttributesId] = useState([]);
  const [viewCategoryBasedAttribute, setViewCategoryBasedAttribute] = useState(
    []
  );
  const { searchTerm } = useSearch();

  const [attributesPagination, setAttributesPagination] = useState([]);

  const [filterData, setFilterData] = useState({
    name: "",
    gst_percent: "",
    hsn_code: "",
    active_status: "",
    description: "",
  });

  useEffect(() => {
    if (showForm) {
      setOpen(true);
    }
  }, []);

  const fetchItems = async (page = 1, filters = filterData) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    setBranchId(branchIds[0]);
    const token = localStorage.getItem("token");

    // Convert filters to query string
    const queryParams = new URLSearchParams({
      page,
      search: searchTerm,
    });

    try {
      const response = await axios.get(
        `public/api/items?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setItemPagination(response.data.original.items);

      fetchCategoriesInItems();

      const responseForAttributes = await axios.get(
        `public/api/attributes/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setAttributesPagination(responseForAttributes.data);
    } catch (error) {
      triggerToast("error", error.response?.data?.message, "error");
      // toast.error(
      //   error.response?.data?.message || "Failed to fetch categories"
      // );
    } finally {
      setLoading(false);
    }
  };

  async function fetchCategoriesInItems() {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");

    const responseForCategories = await axios.get(
      `public/api/categories/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      }
    );

    setCategoryPagination(responseForCategories.data);
  }

  useEffect(() => {
    fetchItems(currentPage, filterData);
  }, [currentPage]);

  const searchItemsFetch = async (page = 1, searchTerm) => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      page,
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }

    const response = await axios.get(
      `public/api/items?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      }
    );
    setItemPagination(response.data.original.items);
  };

  useEffect(() => {
    searchItemsFetch(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const fields = [
    {
      name: "name",
      componentType: "select",
      placeholder: "Select Name",
      options: itemPagination.categories?.data?.map((Items) => ({
        value: Items.name,
        label: Items.name,
      })),
    },

    {
      name: "active_status",
      componentType: "select",
      placeholder: "Select Status",
      options: Array.from(
        new Set(
          itemPagination?.categories?.data?.map((Items) =>
            Items.active_status === 0 ? "Inactive" : "Active"
          )
        ),
        (status) => ({
          value: status === "Inactive" ? 0 : 1,
          label: status,
        })
      ),
    },
  ];

  const handleAddForItems = () => {
    setLoading(true);
    setIsEditing(false);
    setHidePlusIconForCategory("");
    try {
      setOpenDialogForItems(true);
      setEditIdForItems("");
      setSaveBtnForItems("save");

      setItemInputs({
       item_name: "",
    category_id: "",
    reorder_level: "",
    unit_of_measurement: "",
    item_code: "",
    item_type_code:"",
    gst_applicable_date: "",
    hsn_code: "",
    hsn_applicable_date: "",
    sac_code: "",
    sac_applicable_date: "",
    item_type: "",
    purchase_price: "",
    selling_price: "",
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // When navigating back to Vendors
  const handleCloseForDialog = () => {
    setLoading(false);
    try {
      setOpen(false);
      if (showForm) {
        navigate("/vendors", {
          state: { preservedForm, showForm: true }, // ✅ pass both values
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <TopFilters
        fields={fields}
        filterData={filterData}
        handleChange={handleChange}
        handleFilter={handleFilter}
        handleReset={handleReset}
        noResultsMessage="No results found"
      /> */}

          <HeadersAndAddButton
            title={"Items"}
            description={"A list of all items report"}
            buttonName={"Add Items"}
            setOpen={setOpen}
            handleDialogOpen={handleAddForItems}
            buttonIcon={<AiOutlineProduct/>}
          />

          <ItemList
            itemPagination={itemPagination}
            setOpen={setOpen}
            branchId={branchId}
            setSaveBtn={setSaveBtn}
            setItemInputs={setItemInputs}
            fetchItems={fetchItems}
            setIdCryptForItems={setIdCryptForItems}
            setCurrentPage={setCurrentPage}
            setLoading={setLoading}
            loading={loading}
            setIsEditing={setIsEditing}
            setViewCategoryBasedAttribute={setViewCategoryBasedAttribute}
            setOpenDialogForItems={setOpenDialogForItems}
            setSaveBtnForItems={setSaveBtnForItems}
            setEditIdForItems={setEditIdForItems}
            setHidePlusIconForCategory={setHidePlusIconForCategory}
          />

          {openDialogForItems && (
            <ItemDialogBox
              fetchItems={fetchItems}
              categoryPagination={categoryPagination}
              hideplusiconforcategory={hideplusiconforcategory}
              setItemInputs={setItemInputs}
              itemInputs={itemInputs}
              setHidePlusIconForCategory={setHidePlusIconForCategory}
              fetchItemsAfterDialogClose={fetchItemsAfterDialogClose}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}

          {openDialogForCategory && (
            <CatergoryDialogBox
              setOpenDialogForCategory={setOpenDialogForCategory}
              openDialogForCategory={openDialogForCategory}
              collapsed={collapsed}
              attributesPagination={attributesPagination}
              item="item"
              setCategoryInputs={setCategoryInputs}
              categoryInputs={categoryInputs}
              fetchCategoriesInItems={fetchCategoriesInItems}
              itemFlag={true}
            />
          )}
        </>
      )}
    </>
  );
}

export default ItemCreate;
