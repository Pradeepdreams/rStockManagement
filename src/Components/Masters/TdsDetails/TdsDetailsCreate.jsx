import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import {
  PencilIcon,
  XMarkIcon,
  UserCircleIcon,
  PercentBadgeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Select from "react-select";
import { useOutletContext } from "react-router-dom";
import TdsDetailsList from "./TdsDetailsList";
import { toast } from "react-toastify";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import { RadioIcon } from "@heroicons/react/24/solid";
import SocailMediaDialogBox from "../SocialMedia/SocailMediaDialogBox";
import { useDialog } from "../../Context/DialogContext";
import TdsDetailsDialogBox from "./TdsDetailsDialogBox";
import { useDialogForTdsDetails } from "../../Context/TdsDetailDialogContext";
import { useSearch } from "../../Context/SearchContext";
import { TbReceiptTax } from "react-icons/tb";

function TdsDetailsCreate() {
  const { collapsed } = useOutletContext();
  const { searchTerm } = useSearch();

  const [tdsDetailsPagination, setTdsDetailsPagination] = useState([]);
  const [branchId, setBranchId] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [sectionPagination, setSectionPagination] = useState([]);

  const {
    openDialogForTdsDetails,
    setOpenDialogForTdsDetails,
    setSaveBtnForTdsDetails,
    setTdsDetailsInputs,
    setEditIdForTdsDetails,
  } = useDialogForTdsDetails();

  const fetchTdsDetails = async (page = 1, filters = filterData) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    setBranchId(branchIds);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page,
      //   ...filters,
    });

    try {
      const response = await axios.get(
        `public/api/tds-details?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds,
          },
        }
      );

      setTdsDetailsPagination(response.data.original.tds_details);

      const responseForSection = await axios.get(
        `public/api/tds-sections/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchData.map((branch) => branch.branch.id_crypt),
          },
        }
      );

      setSectionPagination(responseForSection.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch attribute values"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTdsDetails(currentPage);
  }, [currentPage]);

  const searchTdsFetch = async (page = 1, searchTerm) => {
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
        `public/api/tds-details?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds,
          },
        }
      );

      setTdsDetailsPagination(response.data.original.tds_details);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch attribute values"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchTdsFetch(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddForTdsDetails = () => {
    setOpenDialogForTdsDetails(true);
    setSaveBtnForTdsDetails("save");
    setEditIdForTdsDetails("");
    setIsEditing(false);
    setTdsDetailsInputs({
      name: "",
      tds_section_id: "",
      description: "",
      active_status: "",
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Tds Details"
        description="A list of all Tds Details"
        buttonName="Add Tds Details"
        setOpenDialogForTdsDetails={setOpenDialogForTdsDetails}
        handleDialogOpen={handleAddForTdsDetails}
        buttonIcon={<TbReceiptTax />}
      />

      <TdsDetailsList
        tdsDetailsPagination={tdsDetailsPagination}
        setOpenDialogForTdsDetails={setOpenDialogForTdsDetails}
        branchId={branchId}
        setSaveBtnForTdsDetails={setSaveBtnForTdsDetails}
        setTdsDetailsInputs={setTdsDetailsInputs}
        fetchTdsDetails={fetchTdsDetails}
        setEditIdForTdsDetails={setEditIdForTdsDetails}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
      />

      {openDialogForTdsDetails && (
        <TdsDetailsDialogBox
          openDialogForTdsDetails={openDialogForTdsDetails}
          setOpenDialogForTdsDetails={setOpenDialogForTdsDetails}
          fetchTdsDetails={fetchTdsDetails}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          sectionPagination={sectionPagination}
        />
      )}
    </>
  );
}

export default TdsDetailsCreate;
