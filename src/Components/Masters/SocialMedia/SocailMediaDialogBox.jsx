import { useState, useEffect } from "react";
import {
  PencilIcon,
  XMarkIcon,
  UserCircleIcon,
  PercentBadgeIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axios from "../../Utils/AxiosInstance";
import { toast } from "react-toastify";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useDialog } from "../../Context/DialogContext";
import { useToast } from "../../Context/ToastProvider";

function SocailMediaDialogBox({
  collapsed,
  isEditing,
  setIsEditing,
  setLoading,
  fetchSocialMedia,
}) {
  const {
    openDialogForSocialMedia,
    setOpenDialogForSocialMedia,
    saveBtnForSocialMedia,
    editIdForSocialMedia,
    socialMediaInputs,
    setSocialMediaInputs,
  } = useDialog();

  const [requiredFields, setRequiredFields] = useState({
    name: false,
  });

  const { triggerToast } = useToast();

  const handleChangeForSocialMedia = (e) => {
    const { name, value } = e.target;
    setSocialMediaInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForSocialMedia = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    

    try {
      await axios.post("public/api/socialmedia", socialMediaInputs, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setOpenDialogForSocialMedia(false);
      await fetchSocialMedia();
      triggerToast("Success", "Social Media Created Successfully!", "success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating value");
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleUpdateForSocialMedia = async (e) => {
    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    try {
      await axios.put(
        `public/api/socialmedia/${editIdForSocialMedia}`,
        socialMediaInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      await fetchSocialMedia();
      setOpenDialogForSocialMedia(false);
      triggerToast("Success", "Social Media Updated Successfully!", "success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating value");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={openDialogForSocialMedia}
        onClose={() => {}}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

        <div
          className={`fixed inset-0 overflow-y-auto transition-all duration-400 ${
            collapsed ? "lg:ml-20" : "lg:ml-72"
          }`}
        >
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-10">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100   text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-0">
              <div className="bg-[#134b90] text-white p-4 flex items-center justify-between">
                <h2 style={{ fontFamily: "poppins" }} className="font-semibold">
                  Social Media
                </h2>
                <div className="flex gap-2">
                  {isEditing && (
                    <div
                      onClick={() => setIsEditing(false)}
                      className="bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    onClick={() => setOpenDialogForSocialMedia(false)}
                    className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Social Media Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Social Media Name"
                      value={socialMediaInputs?.name}
                      onChange={handleChangeForSocialMedia}
                      
                      className={`mt-1 w-full bg-white ${
                        isEditing && "opacity-50 cursor-not-allowed"
                      } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                      disabled={isEditing}
                    />

                    {requiredFields.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {requiredFields.name[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link
                    </label>
                    <input
                      type="text"
                      name="links"
                      placeholder="Enter Link"
                      value={socialMediaInputs?.links}
                      onChange={handleChangeForSocialMedia}
                      className={`mt-1 w-full bg-white ${
                        isEditing && "opacity-50 cursor-not-allowed"
                      } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                      disabled={isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setOpenDialogForSocialMedia(false)}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                )}

                {saveBtnForSocialMedia === "save" ? (
                  <button
                    onClick={handleSubmitForSocialMedia}
                    className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                  >
                    Save
                  </button>
                ) : (
                  !isEditing && (
                    <button
                      onClick={(e) => handleUpdateForSocialMedia(e)}
                      className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                    >
                      Update
                    </button>
                  )
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default SocailMediaDialogBox;
