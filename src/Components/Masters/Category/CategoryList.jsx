import axios from "../../Utils/AxiosInstance";
import React from "react";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useToast } from "../../Context/ToastProvider";

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
  id
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
        margin_percent_to: category.margin_percent_to

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
    "Description",
    "Actions"
  ];




  const renderRow = (category, index) => (
    <>
    {console.log(category, "category")}
      <td className="px-6 py-4 whitespace-nowrap">
        {categoryPagination.categories.from + index}
      </td>
      <td className="px-6 py-4">{category?.name}</td>
      <td className="px-6 py-4">{category?.latest_gst_percent?.gst_percent}%</td>
      <td className="px-6 py-4">{category?.latest_gst_percent?.applicable_date}</td>
      <td className="px-6 py-4">{category?.latest_hsn_code?.hsn_code}</td>
      <td className="px-6 py-4">{category?.latest_hsn_code?.applicable_date}</td>
      {/* <td className="px-6 py-4">{category?.active_gst_percent?.gst_percent}%</td>
      <td className="px-6 py-4">{category?.active_gst_percent?.applicable_date}</td>
      <td className="px-6 py-4">{category?.active_hsn_code?.hsn_code}</td>
      <td className="px-6 py-4">{category?.active_hsn_code?.applicable_date}</td> */}
      <td className="px-6 py-4">
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${category.active_status == "1"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {category.active_status === 1 ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-6 py-4">{category.description}</td>
      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
            onClick={(e) =>
              handleViewForCategory(e, category.id_crypt)
            }
          >
            View
          </button>
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
