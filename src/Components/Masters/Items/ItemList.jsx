import axios from "../../Utils/AxiosInstance";
import React from "react";
import { toast } from "react-toastify";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import { useNavigate } from "react-router-dom";
import Table from "../../Utils/Table";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useToast } from "../../Context/ToastProvider";
import ViewButton from "../../Utils/ViewButton";
import {
  FaHashtag,
  FaBox,
  FaBarcode,
  FaTags,
  FaBell,
  FaBalanceScale,
} from "react-icons/fa";


function ItemList({
  itemPagination,
  setOpenDialogForItems,
  branchId,
  setSaveBtn,
  setItemInputs,
  fetchCategories,
  setIdCryptForItems,
  setCurrentPage,
  setLoading,
  loading,
  setIsEditing,
  setViewCategoryBasedAttribute,
  setSaveBtnForItems,
  setEditIdForItems,
  fetchItems,
  setCategoriesData,
  setHidePlusIconForCategory,
}) {
  const navigate = useNavigate();
const {triggerToast} = useToast();  
  const handleViewForitem = async (e, id_crypt) => {
    e.preventDefault();
    setLoading(true);
    setIsEditing(true);
    setEditIdForItems(id_crypt);
    setSaveBtn("update");
    setHidePlusIconForCategory("");

    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForItemssEditData = await axios.get(
        `public/api/items/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      const item = responseForItemssEditData.data.original;
      setItemInputs({
        item_name: item?.item_name,
        category_id: item?.category_id,
        margin_percent: item?.margin_percent,
        reorder_level: item?.reorder_level,
        unit_of_measurement: item?.unit_of_measurement,
        item_code: item?.item_code,
      });
      console.log(item, "test");
      console.log(item.item_name);

      // setCategoriesData(item.category);
      // setViewCategoryBasedAttribute(item.category_id);

      setSaveBtnForItems("update");
      setOpenDialogForItems(true);
    } catch (error) {
      triggerToast("Fetch failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
    }

    setOpenDialogForItems(true);
  };

  const headers = [
    "S.No",
    "Item Name",
    "Item Code",
    "Category",
    "Reorder Level",
    "Unit of Measurement",
    "Actions",
  ];

  const renderRow = (item, index) => (
    // <>
    //   <td className="px-6 py-4 whitespace-nowrap">
    //     {itemPagination.from + index}
    //   </td>
    //   <td className="px-6 py-4">{item.item_name}</td>
    //   <td className="px-6 py-4">{item.item_code}</td>
    //   <td className="px-6 py-4">{item.category?.name}</td>
    //   <td className="px-6 py-4">{item.reorder_level}</td>

    //   <td className="px-6 py-4">{item.unit_of_measurement}</td>
    //   <td className="px-6 py-4 text-center">
    //     <div className="flex justify-center gap-2">
    //       {/* <button
    //         className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-sm shadow"
    //         onClick={(e) => handleViewForitem(e, item.id_crypt)}
    //       >
    //         View
    //       </button> */}
    //       <ViewButton onView={handleViewForitem} item={item} />

    //       <DeleteConfirmation
    //         apiType="item"
    //         id_crypt={item.id_crypt}
    //         fetchDatas={fetchItems}
    //         branchId={branchId}
    //         setLoading={setLoading}
    //         loading={loading}
    //       />
    //     </div>
    //   </td>
    // </>

    <>
  {/* Index */}
  <td className="px-6 py-4 whitespace-nowrap text-left">
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
      <FaHashtag className="text-gray-500" />
      {itemPagination.from + index}
    </span>
  </td>

  {/* Item Name */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium capitalize">
      <FaBox className="text-blue-600" />
      {item.item_name || "N/A"}
    </span>
  </td>

  {/* Item Code */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 border border-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
      <FaBarcode className="text-indigo-600" />
      {item.item_code || "N/A"}
    </span>
  </td>

  {/* Category */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1   px-2 py-1 rounded text-sm font-medium capitalize">
      {/* <FaTags className="text-green-600" /> */}
      {item.category?.name || "N/A"}
    </span>
  </td>

  {/* Reorder Level */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
      {/* <FaBell className="text-yellow-600" /> */}
      {item.reorder_level || "N/A"}
    </span>
  </td>

  {/* Unit of Measurement */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium capitalize">
      <FaBalanceScale className="text-purple-600" />
      {item.unit_of_measurement || "N/A"}
    </span>
  </td>

  {/* Actions */}
  <td className="px-6 py-4 text-center">
    <div className="flex gap-2">
      <ViewButton onView={handleViewForitem} item={item} />

      <DeleteConfirmation
        apiType="item"
        id_crypt={item.id_crypt}
        fetchDatas={fetchItems}
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
        data={itemPagination?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={itemPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default ItemList;
