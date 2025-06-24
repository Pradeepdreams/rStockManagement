import axios from "../../Utils/AxiosInstance";
import React, { useState } from "react";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import AreaDialogBox from "./AreaDialogBox";
import { useDialogForArea } from "../../Context/AreaDialogContext";
import { useToast } from "../../Context/ToastProvider";
import ViewButton from "../../Utils/ViewButton";
import { FaCode, FaHashtag, FaMapMarkerAlt } from "react-icons/fa";
import { TbNumbers } from "react-icons/tb";

function AreaList({
  areaPagination,
  setLoading,
  setIsEditing,
  // setOpen,
  setSaveBtn,
  fetchArea,
  branchId,
  setIdCryptForArea,
  idCryptForArea,
  loading,
  setCurrentPage,
}) {

  const [open, setOpen] = useState(false);
  const [areaEditData, setAreaEditData] = useState();
  const { triggerToast } = useToast();
  const {
    openDialogForArea,
    setOpenDialogForArea,
    setSaveBtnForArea,
    setEditIdForArea,
    areaInputs,
    setAreaInputs,
          
          
  } = useDialogForArea();
  const [editId, setEditId] = useState("");

  const handleViewForArea = async (e, id_crypt) => {
    // e.preventDefault();
    setOpenDialogForArea(true);
    setEditIdForArea(id_crypt);
    setLoading(true);
    setIsEditing(true);
    // setEditId(id_crypt);
    setSaveBtnForArea("update");

    const token = localStorage.getItem("token");
    try {
      const responseForAreaEditData = await axios.get(
        `public/api/areas/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );
 
      setAreaEditData(responseForAreaEditData.data);
      setAreaInputs({
        name: responseForAreaEditData.data.name,
        area_code: responseForAreaEditData.data.area_code,
      });
    
      setEditId(responseForAreaEditData.data?.id_crypt);
    } catch (error) {
      triggerToast("Error", error.response.data.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };


  const headers = ["S.No", "Area Name", "Area Code", "Actions"];


  const renderRow = (area, index) => (
  <>
    <td className="px-6 py-4 whitespace-nowrap text-left">
      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
        <FaHashtag className="text-gray-500" />
        {areaPagination.from + index}
      </span>
    </td>

    <td className="px-6 py-4 text-left">
      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium capitalize">
        <FaMapMarkerAlt className="text-blue-600" />
        {area.name || "N/A"}
      </span>
    </td>

    <td className="px-6 py-4 text-left">
      <span className="inline-flex items-center gap-1  px-2 py-1 rounded text-sm font-medium">
        <TbNumbers className="text-yellow-600" />
        {area.area_code || "N/A"}
      </span>
    </td>

    <td className="px-6 py-4 text-left">
      <div className="flex  gap-2">
        {/* <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-md text-sm shadow flex items-center gap-1"
          onClick={(e) => handleViewForArea(e, area.id_crypt)}
        >
          <FaEye className="w-4 h-4" />
          View
        </button> */}
        <ViewButton onView={handleViewForArea} item={area} />

        <DeleteConfirmation
          apiType="areas"
          id_crypt={area.id_crypt}
          fetchDatas={fetchArea}
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
        data={areaPagination?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={areaPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default AreaList;
