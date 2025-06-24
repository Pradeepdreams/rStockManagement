import axios from "../../Utils/AxiosInstance";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import GstRegistrationDialogBox from "./QualificationDialogBox";
import { useDialogForGstRegistration } from "../../Context/GstRegistrationDialogContext";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import ViewButton from "../../Utils/ViewButton";
import { FaAlignLeft, FaGraduationCap, FaHashtag } from "react-icons/fa";

function QualificationList({
  qualificationPaginationData,
  setLoading,
  setIsEditing,
  fetchQualifications,
  loading,
  setCurrentPage,
  setOpenDialogForQualification,
  setEditIdForQualification,
  setSaveBtnForQualification,
  setQualificationInputs
}) {


  const handleViewForQualification = async (e, id_crypt) => {
    // e.preventDefault();
    setOpenDialogForQualification(true);
    setEditIdForQualification(id_crypt);
    setLoading(true);
    setIsEditing(true);
    setSaveBtnForQualification("update");

    const token = localStorage.getItem("token");
     const branchData = await getBranchDataFromBalaSilksDB();
        const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForQualificationEditData = await axios.get(
        `public/api/qualifications/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setQualificationInputs({
        name: responseForQualificationEditData.data.data.name,
        description: responseForQualificationEditData.data.data.description,
      });

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };


  const headers = ["S.No", "Name", "Description", "Actions"];


  const renderRow = (qualification, index) => (
   <>
  <td className="px-6 py-4 whitespace-nowrap text-left">
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
      <FaHashtag className="text-gray-500" />
      {qualificationPaginationData.from + index}
    </span>
  </td>

  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
      <FaGraduationCap className="text-blue-600" />
      {qualification.name || "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
      <FaAlignLeft className="text-yellow-600" />
      {qualification.description || "N/A"}
    </span>
  </td>

  <td className="px-6 py-4 text-left">
    <div className="flex  gap-2">
      {/* <button
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-md text-sm shadow flex items-center gap-1"
        onClick={(e) => handleViewForQualification(e, qualification.id_crypt)}
      >
        <FaEye className="w-4 h-4" />
        View
      </button> */}
      <ViewButton onView={handleViewForQualification} item={qualification} />

      <DeleteConfirmation
        apiType="qualifications"
        id_crypt={qualification.id_crypt}
        fetchDatas={fetchQualifications}
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
        data={qualificationPaginationData?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={qualificationPaginationData}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default QualificationList;
