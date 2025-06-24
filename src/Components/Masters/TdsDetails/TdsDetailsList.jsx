import axios from "../../Utils/AxiosInstance";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import TdsDetailsDialogBox from "./TdsDetailsDialogBox";
import { useDialogForTdsDetails } from "../../Context/TdsDetailDialogContext";

function TdsDetailsList({
  tdsDetailsPagination,
  setLoading,
  setIsEditing,
  // setOpen,
  setSaveBtn,

  fetchTdsDetails,
  branchId,
  setIdCryptForTdsDetails,
  idCryptForTdsDetails,
  loading,
  setCurrentPage,
}) {
  const [open, setOpen] = useState(false);
  const [tdsDetailsEditData, setTdsDetailsEditData] = useState();
  const {
    openDialogForTdsDetails,
    setOpenDialogForTdsDetails,
    setSaveBtnForTdsDetails,
    setEditIdForTdsDetails,
    tdsDetailsInputs,
    setTdsDetailsInputs,
  } = useDialogForTdsDetails();
  const [editId, setEditId] = useState("");

  const handleViewForTdsDetails = async (e, id_crypt) => {
    // e.preventDefault();
    setOpenDialogForTdsDetails(true);
    setEditIdForTdsDetails(id_crypt);
    setLoading(true);
    setIsEditing(true);
    // setEditId(id_crypt);
    setSaveBtnForTdsDetails("update");

    const token = localStorage.getItem("token");
    try {
      const responseForTdsDetailsEditData = await axios.get(
        `public/api/tds-details/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      setTdsDetailsEditData(responseForTdsDetailsEditData.data);
      setTdsDetailsInputs({
        name: responseForTdsDetailsEditData.data.name,
        tds_section_id: responseForTdsDetailsEditData.data.tds_section_id,
        description: responseForTdsDetailsEditData.data.description,
      });
      setEditId(responseForTdsDetailsEditData.data?.id_crypt);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    "S.No",
    "Name",
    "Section",
    "Amount Limit",
    "Actions",
  ];

  const renderRow = (item, index) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        {tdsDetailsPagination.from + index}
      </td>
      <td className="px-6 py-4">{item.name}</td>
      <td className="px-6 py-4">{item?.tds_section?.name}</td>
      <td className="px-6 py-4">{item?.tds_section?.amount_limit}</td>

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
            onClick={(e) => handleViewForTdsDetails(e, item.id_crypt)}
          >
            View
          </button>

          <DeleteConfirmation
            apiType="tds-details"
            id_crypt={item.id_crypt}
            fetchDatas={fetchTdsDetails}
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
        data={tdsDetailsPagination?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={tdsDetailsPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default TdsDetailsList;
