import React, { useState } from "react";
import { useDialogForGroup } from "../../Context/GroupDialogContext";
import { useOutletContext } from "react-router-dom";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import axios from "../../Utils/AxiosInstance";
import { toast } from "react-toastify";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  PencilIcon,
  XMarkIcon,
  UserCircleIcon,
  PercentBadgeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useDialogForVendorGroup } from "../../Context/VendorGroupDialogContext";
import SaveButton from "../../Utils/SaveButton";


function VendorGroupsDialogBox({ fetchVendorGroup,isEditing, setIsEditing, fetchVendorGroupAfterDialogClose, vendorFlag }) {
  const { collapsed } = useOutletContext();
  const {
    openDialogForVendorGroup,
    setOpenDialogForVendorGroup,
    vendorGroupInputs,
    setVendorGroupInputs,
    saveBtnForVendorGroup,
    editIdForVendorGroup,
  } = useDialogForVendorGroup();

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [requiredFields, setRequiredFields] = useState({
    name: false,
  });

  const handleChangeForVendorGroup = (e) => {
    const { name, value } = e.target;
    setVendorGroupInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const payload = {
    name: vendorGroupInputs.name,
    is_active: vendorGroupInputs.is_active == "yes" ? 1 : 0,
    description: vendorGroupInputs.description,
  };
  const handleSubmitForVendorGroup = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForGroupCreateData = await axios.post(
        "public/api/vendor-groups",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setOpenDialogForVendorGroup(false);
      if(vendorFlag){
        await fetchVendorGroupAfterDialogClose();
      }
      await fetchVendorGroup();
    } catch (error) {
      toast.error(error.response.data.message);
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleUpdateForVendorGroup = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForGroupUpdateData = await axios.put(
        `public/api/vendor-groups/${editIdForVendorGroup}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setOpenDialogForVendorGroup(false);
      await fetchVendorGroup();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {openDialogForVendorGroup && (
        <Dialog
          open={openDialogForVendorGroup}
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
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100  pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-0">
                <div className="bg-[var(--dialog-bgcolor)] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Vendor Group
                  </h2>
                  <div className="flex gap-2">
                    {isEditing && (
                      <div
                        onClick={() => setIsEditing(false)}
                        className="bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200 transition duration-200"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      onClick={() => setOpenDialogForVendorGroup(false)}
                      className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200 transition duration-200"
                      title="Close"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="m-4 bg-white border rounded-md border-gray-200 p-4">
                  {/* <h3 className="text-lg font-semibold text-gray-400 mb-4 ">
                                                Attributes
                                            </h3> */}

                  <div className=" sm:p-6 bg-gray-50 rounded-md ">
                    <div className="grid grid-cols-1">
                      <div className="mb-5">
                        <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          <h4>Name</h4>
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Name"
                          name="name"
                          onChange={handleChangeForVendorGroup}
                          value={vendorGroupInputs.name}
                          disabled={isEditing}
                        className={`w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                        {requiredFields.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.name[0]}
                          </p>
                        )}
                      </div>
                  

                      <div className="w-full sm:col-span-2">
                        <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          <h4>Description</h4>
                        </label>
                        <textarea
                          type="text"
                          rows={3}
                          placeholder="Description"
                          name="description"
                          onChange={handleChangeForVendorGroup}
                          value={vendorGroupInputs.description}
                          disabled={isEditing}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                        />
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => setOpenDialogForVendorGroup(false)}
                          className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      )}

                      {saveBtnForVendorGroup === "save" ? (
                        // <button
                        //   onClick={handleSubmitForVendorGroup}
                        //   className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        // >
                        //   Save
                        // </button>
                        <SaveButton saveFunction={handleSubmitForVendorGroup} />
                      ) : (
                        !isEditing && (
                          <button
                            onClick={handleUpdateForVendorGroup}
                            className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                          >
                            Update
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default VendorGroupsDialogBox;
