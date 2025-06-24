import axios from "../../Utils/AxiosInstance";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Table from "../../Utils/Table";
import Pagination from "../../Utils/Pagination";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import SocailMediaDialogBox from "./SocailMediaDialogBox";
import { useDialog } from "../../Context/DialogContext";

function SocialMediaList({
  socialMediaPagination,
  setLoading,
  setIsEditing,
  // setOpen,
  setSaveBtn,
  socialMediaInputs,
  setSocialMediaInputs,
  fetchSocialMedia,
  branchId,
  setIdCryptForSocialMedia,
  idCryptForSocialMedia,
  loading,
  setCurrentPage,
}) {

  const [open, setOpen] = useState(false);
  const [socialMediaEditData, setSocialMediaEditData] = useState();
  const {
    openDialogForSocialMedia,
    setOpenDialogForSocialMedia,
    setSaveBtnForSocialMedia,
    setEditIdForSocialMedia,
  } = useDialog();
  const [editId, setEditId] = useState("");

  const handleViewForSocialMedia = async (e, id_crypt) => {
    // e.preventDefault();
    setOpenDialogForSocialMedia(true);
    setEditIdForSocialMedia(id_crypt);
    setLoading(true);
    setIsEditing(true);
    // setEditId(id_crypt);
    setSaveBtnForSocialMedia("update");

    const token = localStorage.getItem("token");
    try {
      const responseForSocialMediaEditData = await axios.get(
        `public/api/socialmedia/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      setSocialMediaEditData(responseForSocialMediaEditData.data);
      setSocialMediaInputs({
        name: responseForSocialMediaEditData.data?.name,
        links: responseForSocialMediaEditData.data?.links,
      });

      setEditId(responseForSocialMediaEditData.data?.id_crypt);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  

  const headers = ["S.No", "Name", "Link", "Actions"];

  const renderRow = (socialMedia, index) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">{socialMediaPagination.from + index}</td>
      <td className="px-6 py-4">{socialMedia.name}</td>
      <td className="px-6 py-4">{socialMedia.links}</td>

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
            onClick={(e) => handleViewForSocialMedia(e, socialMedia.id_crypt)}
          >
            View
          </button>

          <DeleteConfirmation
            apiType="socialmedia"
            id_crypt={socialMedia.id_crypt}
            fetchDatas={fetchSocialMedia}
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
        data={socialMediaPagination?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={socialMediaPagination}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default SocialMediaList;
