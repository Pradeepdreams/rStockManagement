import axios from "../../Utils/AxiosInstance";
import React, { useState } from "react";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import AreaDialogBox from "./AreaDialogBox";
import { useDialogForArea } from "../../Context/AreaDialogContext";
import { useToast } from "../../Context/ToastProvider";

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
      <td className="px-6 py-4 whitespace-nowrap">{areaPagination.from + index}</td>
      <td className="px-6 py-4">{area.name}</td>
      <td className="px-6 py-4">{area.area_code}</td>

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
            onClick={(e) => handleViewForArea(e, area.id_crypt)}
          >
            View
          </button>

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
