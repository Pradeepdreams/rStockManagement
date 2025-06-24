import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useOutletContext } from "react-router-dom";
import GstRegistrationList from "./QualificationList";
import { toast } from "react-toastify";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import GstRegistrationDialogBox from "./QualificationDialogBox";
import { useDialogForGstRegistration } from "../../Context/GstRegistrationDialogContext";
import { useDialogForQualification } from "../../Context/QualificationContext";
import QualificationList from "./QualificationList";
import QualificationDialogBox from "./QualificationDialogBox";
import { useSearch } from "../../Context/SearchContext";
import { MdRotate90DegreesCw } from "react-icons/md";
function QualificationCreate() {
  const { collapsed } = useOutletContext();
  const [branchId, setBranchId] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { searchTerm } = useSearch();

  const {
    openDialogForQualification,
    setOpenDialogForQualification,
    setSaveBtnForQualification,
    setQualificationInputs,
    setEditIdForQualification,
    editIdForQualification,
    qualificationInputs,
    qualificationPaginationData,
    setQualificationPaginationData,
    saveBtnForQualification,
  } = useDialogForQualification();

  const fetchQualifications = async (page = 1, searchTerm) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    setBranchId(branchIds);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page,
    });

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }

    try {
      const response = await axios.get(
        `public/api/qualifications?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds,
          },
        }
      );
      console.log(response, "response");

      setQualificationPaginationData(response.data.qualifications);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch Gst Registration types"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualifications(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddForQualification = () => {
    setOpenDialogForQualification(true);
    setSaveBtnForQualification("save");
    setEditIdForQualification("");
    setIsEditing(false);
    setQualificationInputs({
      name: "",
      description: "",
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Qualification"
        description="A list of all qualifications"
        buttonName="Add Qualification"
        handleDialogOpen={handleAddForQualification}
         buttonIcon={<MdRotate90DegreesCw  />}
      />

      <QualificationList
        qualificationPaginationData={qualificationPaginationData}
        setOpenDialogForQualification={setOpenDialogForQualification}
        branchId={branchId}
        setSaveBtnForQualification={setSaveBtnForQualification}
        setQualificationInputs={setQualificationInputs}
        fetchQualifications={fetchQualifications}
        setEditIdForQualification={setEditIdForQualification}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
        setQualificationPaginationData={setQualificationPaginationData}
        editIdForQualification={editIdForQualification}
        currentPage={currentPage}
      />

      {openDialogForQualification && (
        <QualificationDialogBox
          openDialogForQualification={openDialogForQualification}
          setOpenDialogForQualification={setOpenDialogForQualification}
          fetchQualifications={fetchQualifications}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          setQualificationInputs={setQualificationInputs}
          qualificationInputs={qualificationInputs}
          editIdForQualification={editIdForQualification}
          setSaveBtnForQualification={setSaveBtnForQualification}
          saveBtnForQualification={saveBtnForQualification}
        />
      )}
    </>
  );
}

export default QualificationCreate;
