import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import {
  PencilIcon,
  XMarkIcon,
  UserCircleIcon,
  PercentBadgeIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Select from "react-select";
import { useOutletContext } from "react-router-dom";
import SocialMediaList from "./SocialMediaList";
import { toast } from "react-toastify";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import { RadioIcon } from "@heroicons/react/24/solid";
import SocailMediaDialogBox from "./SocailMediaDialogBox";
import { useDialog } from "../../Context/DialogContext";
import { useSearch } from "../../Context/SearchContext";

function SocialMediaCreate({ isSocialMediaOpen, setIsSocialMediaOpen }) {
  const { collapsed } = useOutletContext();
  const [open, setOpen] = useState(false);
  const [socialMediaPagination, setSocialMediaPagination] = useState([]);
  const [branchId, setBranchId] = useState([]);
  const [saveBtn, setSaveBtn] = useState("save");
  const [idCryptForSocialMedia, setIdCryptForSocialMedia] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterData, setFilterData] = useState({});
  const { searchTerm } = useSearch();

  const {
    openDialogForSocialMedia,
    setOpenDialogForSocialMedia,
    setSaveBtnForSocialMedia,
    socialMediaInputs,
    setSocialMediaInputs,
  } = useDialog();

  //   const [socialMediaInputs, setSocialMediaInputs] = useState({
  //     name: "",
  //     links: "",
  //   });

  const fetchSocialMedia = async (page = 1, searchTerm) => {
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
        `public/api/socialmedia?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds,
          },
        }
      );

      setSocialMediaPagination(response.data.social_media);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch attribute values"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialMedia(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddForSocialMedia = async () => {
    setOpenDialogForSocialMedia(true);

    try {
      setIsEditing(false);
      setSocialMediaInputs({ name: "", links: "" });
      setSaveBtnForSocialMedia("save");
      setLoading(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch attribute values"
      );
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Social Media"
        description="A list of all Social Media"
        buttonName="Add Social Media"
        handleDialogOpen={handleAddForSocialMedia}
      />

      <SocialMediaList
        socialMediaPagination={socialMediaPagination}
        setOpenDialogForSocialMedia={setOpenDialogForSocialMedia}
        branchId={branchId}
        setSaveBtn={setSaveBtn}
        setSocialMediaInputs={setSocialMediaInputs}
        fetchSocialMedia={fetchSocialMedia}
        setIdCryptForSocialMedia={setIdCryptForSocialMedia}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
        idCryptForSocialMedia={idCryptForSocialMedia}
      />
      {openDialogForSocialMedia && (
        <SocailMediaDialogBox
          collapsed={collapsed}
          socialMediaPagination={socialMediaPagination}
          fetchSocialMedia={fetchSocialMedia}
          setSocialMediaInputs={setSocialMediaInputs}
          socialMediaInputs={socialMediaInputs}
          setLoading={setLoading}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
    </>
  );
}

export default SocialMediaCreate;
