import React, { useState } from "react";
import { useDialogForGroup } from "../../Context/GroupDialogContext";
import { useOutletContext } from "react-router-dom";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import axios from "../../Utils/AxiosInstance";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  PencilIcon,
  XMarkIcon,
  UserCircleIcon,
  PercentBadgeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "../../Context/ToastProvider";
import SaveButton from "../../Utils/SaveButton";

function GroupDialogBox({ fetchGroup }) {
  const { collapsed } = useOutletContext();
  const {
    openDialogForGroup,
    setOpenDialogForGroup,
    groupInputs,
    setGroupInputs,
    saveBtnForGroup,
    editIdForGroup,
  } = useDialogForGroup();
  const [idCryptForGroup, setIdCryptForGroup] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { triggerToast } = useToast();
  const [requiredFields, setRequiredFields] = useState({
    name: false,
  });

  const handleChangeForGroup = (e) => {
    const { name, value } = e.target;
    setGroupInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const payload = {
    name: groupInputs.name,
    is_active: groupInputs.is_active == "yes" ? 1 : 0,
    description: groupInputs.description,
  };
  const handleSubmitForGroup = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForGroupCreateData = await axios.post(
        "public/api/groups",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setOpenDialogForGroup(false);
      triggerToast("Create Success", responseForGroupCreateData.data.message, "success");
      await fetchGroup();
    } catch (error) {
      triggerToast("Create failed!", error.response?.data?.message, "error");
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleUpdateForGroup = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForGroupUpdateData = await axios.put(
        `public/api/groups/${editIdForGroup}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setOpenDialogForGroup(false);
      triggerToast("Update Success", responseForGroupUpdateData.data.message, "success");
      await fetchGroup();
    } catch (error) {
      triggerToast("Update failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {openDialogForGroup && (
        <Dialog
          open={openDialogForGroup}
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
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100  pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-0">
                <div className="bg-[var(--dialog-bgcolor)] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Group
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
                      onClick={() => setOpenDialogForGroup(false)}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          onChange={handleChangeForGroup}
                          value={groupInputs.name}
                          disabled={
                            isEditing ||
                            groupInputs.name === "Sundry Creditors" ||
                            groupInputs.name === "Sundry Debtors"
                          }
                          className={`mt-1 w-full bg-white ${
                            isEditing || groupInputs.name === "Sundry Creditors"
                              ? "opacity-50 cursor-not-allowed"
                              : groupInputs.name === "Sundry Debtors"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                        />
                        {requiredFields.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.name[0]}
                          </p>
                        )}
                      </div>
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700">
                          Active Status
                        </label>

                        <div className="mt-2 flex items-center space-x-4 w-full bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="yes"
                              name="is_active"
                              value="yes"
                              checked={groupInputs?.is_active === "yes"}
                              // disabled={isEditing}
                              onChange={(e) =>
                                handleChangeForGroup({
                                  target: {
                                    name: "is_active",
                                    value: e.target.value,
                                  },
                                })
                              }
                              className={`h-4 w-4 text-[#134b90] focus:ring-indigo-500 border-gray-300 ${
                                isEditing && "cursor-not-allowed"
                              }`}
                            />
                            <label
                              htmlFor="active"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Active
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="no"
                              name="is_active"
                              value="no"
                              checked={groupInputs?.is_active === "no"}
                              onChange={(e) =>
                                handleChangeForGroup({
                                  target: {
                                    name: "is_active",
                                    value: e.target.value,
                                  },
                                })
                              }
                              className={`h-4 w-4 text-[#134b90] focus:ring-indigo-500 border-gray-300 ${
                                isEditing && "cursor-not-allowed"
                              }`}
                            />
                            <label
                              htmlFor="inactive"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Inactive
                            </label>
                          </div>
                        </div>
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
                          onChange={handleChangeForGroup}
                          value={groupInputs.description}
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
                          onClick={() => setOpenDialogForGroup(false)}
                          className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      )}

                      {saveBtnForGroup === "save" ? (
                        // <button
                        //   onClick={handleSubmitForGroup}
                        //   className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        // >
                        //   Save
                        // </button>
                        <SaveButton saveFunction={handleSubmitForGroup} />
                      ) : (
                        !isEditing && (
                          <button
                            onClick={handleUpdateForGroup}
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

export default GroupDialogBox;
