import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useOutletContext } from "react-router-dom";
import CategoryList from "./CategoryList";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import TopFilters from "../../Utils/TopFilters";
import { useDialogForCategory } from "../../Context/CategoryDialogContext";
import CatergoryDialogBox from "./CatergoryDialogBox";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";
import { AiOutlineProduct } from "react-icons/ai";

function CategoryCreate() {
  const { collapsed } = useOutletContext();

  const {
    categoryInputs,
    setCategoryInputs,
    openDialogForCategory,
    setOpenDialogForCategory,
    setSaveBtnForCategory,
    saveBtnForCategory,
    setEditIdForCategory,
    editIdForCategory,
    hideplusiconforcategory,
  } = useDialogForCategory();

  const [categoryPagination, setCategoryPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [attributesData, setAttributesData] = useState([]);
  const [id, setId] = useState("");
  const { triggerToast } = useToast();
  const { searchTerm } = useSearch();
  const [filterData, setFilterData] = useState({
    name: "",
    gst_percent: "",
    applicable_date: "",
    hsn_code: "",
    active_status: "",
    description: "",
  });

  // const [requiredFields, setRequiredFields] = useState([]);

  const fetchCategories = async (page = 1, filters = filterData) => {
    setLoading(true);

    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const queryParams = new URLSearchParams({
      page,
      ...filters,
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }

    try {
      const response = await axios.get(
        `public/api/categories?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setCategoryPagination(response.data);
      const responseForAttributes = await axios.get(
        `public/api/attributes/list?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchData.map((branch) => branch.branch.id_crypt),
          },
        }
      );

      setAttributesData(responseForAttributes.data);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories(currentPage, filterData);
  }, [currentPage]);

  const searchCategoryFetch = async (page = 1, searchTerm) => {
    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const queryParams = new URLSearchParams({
      page,
      search: searchTerm,
    });
    try {
      const response = await axios.get(
        `public/api/categories?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      setCategoryPagination(response.data);
    } catch (error) {
      triggerToast("Error!", error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCategoryFetch(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddForCategories = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setOpenDialogForCategory(true);
      setSaveBtnForCategory("save");
      setIsEditing(false);
      // setRequiredFields("");
      setCategoryInputs({
        name: "",
        attributes: [],
        gst_percent: "",
        applicable_date: "",
        hsn_code: "",
        active_status: "",
        description: "",
      });
    } catch (error) {
      triggerToast("Error!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
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
          <HeadersAndAddButton
            title={"Categories"}
            description={"A list of all categories report"}
            buttonName={"Add Categories"}
            handleDialogOpen={handleAddForCategories}
            buttonIcon={<AiOutlineProduct/>}
          />

          <CategoryList
            categoryPagination={categoryPagination}
            setOpenDialogForCategory={setOpenDialogForCategory}
            setSaveBtnForCategory={setSaveBtnForCategory}
            setCategoryInputs={setCategoryInputs}
            fetchCategories={fetchCategories}
            setEditIdForCategory={setEditIdForCategory}
            setCurrentPage={setCurrentPage}
            setLoading={setLoading}
            loading={loading}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            // setRequiredFields={setRequiredFields}
            setId={setId}
            id={id}
          />

          {openDialogForCategory && (
            <CatergoryDialogBox
              openDialogForCategory={openDialogForCategory}
              setOpenDialogForCategory={setOpenDialogForCategory}
              categoryInputs={categoryInputs}
              setCategoryInputs={setCategoryInputs}
              saveBtnForCategory={saveBtnForCategory}
              setSaveBtnForCategory={setSaveBtnForCategory}
              attributesData={attributesData}
              // requiredFields={requiredFields}
              isEditing={isEditing}
              fetchCategories={fetchCategories}
              // setRequiredFields={setRequiredFields}
              setLoading={setLoading}
              editIdForCategory={editIdForCategory}
              collapsed={collapsed}
              setIsEditing={setIsEditing}
              setId={setId}
              id={id}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
    </>
  );
}

export default CategoryCreate;
