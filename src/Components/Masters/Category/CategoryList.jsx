import axios from "../../Utils/AxiosInstance";
import React from "react";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useToast } from "../../Context/ToastProvider";
import ViewButton from "../../Utils/ViewButton";
import {
  FaHashtag,
  FaFolder,
  FaPercent,
  FaCalendarAlt,
  FaCode,
  FaInfoCircle,
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { TbNumbers } from "react-icons/tb";

function CategoryList({
  categoryPagination,
  setOpenDialogForCategory,
  branchId,
  setSaveBtnForCategory,
  setCategoryInputs,
  fetchCategories,
  setEditIdForCategory,
  setCurrentPage,
  setLoading,
  loading,
  setIsEditing,
  // setRequiredFields,
  setId,
  id,
}) {
  const { triggerToast } = useToast();

  const handleViewForCategory = async (e, id_crypt) => {
    e.preventDefault();
    setLoading(true);
    setIsEditing(true);
    setOpenDialogForCategory(true);
    setEditIdForCategory(id_crypt);
    setSaveBtnForCategory("update");
    // setRequiredFields("");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");
    try {
      const responseForCategoriesEditData = await axios.get(
        `public/api/categories/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      const category = responseForCategoriesEditData.data;
      console.log(category.id_crypt, "category");

      setId(category.id_crypt);
      // console.log(category, "category");

      setCategoryInputs({
        name: category.name,
        gst_percent: category.latest_gst_percent.gst_percent,
        gst_applicable_date: category.latest_gst_percent.applicable_date,
        hsn_applicable_date: category.latest_hsn_code.applicable_date,
        hsn_code: category.latest_hsn_code.hsn_code,
        active_status: category.active_status,
        description: category.description,
        attributes: category.attributes.map((attribute) => attribute.id),
        margin_percent_from: category.margin_percent_from,
        margin_percent_to: category.margin_percent_to,
      });
    } catch (error) {
      triggerToast("Error!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }

    setOpenDialogForCategory(true);
  };

  console.log(id, "id");

  const headers = [
    "S.No",
    "Name",
    "GST Percentage",
    "GST Applicable Date",
    "HSN Code",
    "HSN Applicable Date",
    "Active Status",
    "Actions",
  ];

  const renderRow = (category, index) => (
    <>
      {/* Index */}
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
          <FaHashtag className="text-gray-500" />
          {categoryPagination.categories.from + index}
        </span>
      </td>

      {/* Category Name */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1  text-blue-800 px-2 py-1 rounded text-sm font-medium capitalize">
          {/* <FaFolder className="text-blue-600" /> */}
          {category?.name || "N/A"}
        </span>
      </td>

      {/* Latest GST Percent */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
          {category?.latest_gst_percent ? (
            <FaPercent className="text-green-600" />
          ) : (
            ""
          )}
          {category?.latest_gst_percent?.gst_percent || "N/A"}
        </span>
      </td>

      {/* GST Applicable Date */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1  px-2 py-1 rounded text-sm font-medium">
          {category?.latest_gst_percent ? (
            <FaCalendarAlt className="text-yellow-600" />
          ) : (
            ""
          )}
          {category?.latest_gst_percent?.applicable_date || "N/A"}
        </span>
      </td>

      {/* Latest HSN Code */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1 border border-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
          {category?.latest_hsn_code ? (
            <TbNumbers className="text-indigo-600" />
          ) : (
            ""
          )}
          {category?.latest_hsn_code?.hsn_code || "N/A"}
        </span>
      </td>

      {/* HSN Applicable Date */}
      <td className="px-6 py-4 text-left">
        <span className="inline-flex items-center gap-1 border border-pink-100 text-pink-800 px-2 py-1 rounded text-sm font-medium">
          {category.latest_hsn_code ? (
            <FaCalendarAlt className="text-pink-600" />
          ) : (
            ""
          )}
          {category?.latest_hsn_code?.applicable_date || "N/A"}
        </span>
      </td>

      {/* Active Status */}
      <td className="px-6 py-4 text-left">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-semibold rounded ${
            category.active_status == "1"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {/* <MdEventAvailable
        className={`${
          category.active_status == "1" ? "text-green-600" : "text-red-600"
        }`}
      /> */}
          {category.active_status == "1" ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-center">
        <div className="flex  gap-2">
          <ViewButton onView={handleViewForCategory} category={category} />
          <DeleteConfirmation
            apiType="category"
            id_crypt={category.id_crypt}
            fetchDatas={fetchCategories}
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
        data={categoryPagination?.categories?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={categoryPagination?.categories}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default CategoryList;
