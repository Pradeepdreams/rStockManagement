import React, { useState } from "react";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import "react-tooltip/dist/react-tooltip.css";

import axios from "../../Utils/AxiosInstance";
import { toast } from "react-toastify";
import {
  Bars3CenterLeftIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  InboxArrowDownIcon,
  NumberedListIcon,
  PencilIcon,
  PercentBadgeIcon,
  PhoneArrowDownLeftIcon,
  PlusCircleIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/16/solid";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  MapPinIcon,
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Select from "react-select";
import { useDialogForCategory } from "../../Context/CategoryDialogContext";
import Table from "../../Utils/Table";
import { Tooltip } from "react-tooltip";
import Pagination from "../../Utils/Pagination";
import { useToast } from "../../Context/ToastProvider";
import SaveButton from "../../Utils/SaveButton";

function CatergoryDialogBox({
  isEditing,
  setIsEditing,
  collapsed,
  categoryInputs,
  saveBtnForCategory,
  editIdForCategory,
  setCategoryInputs,
  fetchCategories,

  setLoading,

  attributesData,
  attributesPagination,
  item,
  id,
  setCurrentPage,
  fetchCategoriesInItems,
  itemFlag,
}) {
  const [hsnCodeError, setHsnCodeError] = useState("");
  const { openDialogForCategory, setOpenDialogForCategory } =
    useDialogForCategory();
  const [showGSTHistoryDialogOpen, setShowGSTHistoryDialogOpen] =
    useState(false);
  const [showHSNHistoryDialogOpen, setShowHSNHistoryDialogOpen] =
    useState(false);
  const [gstHistoryDataPagination, setGstHistoryDataPagination] = useState([]);
  const [hsnHistoryDataPagination, setHSNHistoryDataPagination] = useState([]);
  const [requiredFields, setRequiredFields] = useState([]);

  const { triggerToast } = useToast();

  const renderAttributeData =
    item === "item" ? attributesPagination : attributesData;

  const handleChangeForCategories = (e) => {
    const { name, value } = e.target;

    if (name === "hsn_code") {
      if (!/^\d*$/.test(value)) return;

      if (value.length > 14) return;

      if (value.length <= 3) {
        setHsnCodeError("HSN Code must be longer than 4 digits.");
      } else if (value.length % 2 !== 0) {
        setHsnCodeError("HSN Code must contain an even number of digits.");
      } else {
        setHsnCodeError("");
      }
    }

    setCategoryInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmitForCategories = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForCategoriesCreateData = await axios.post(
        "public/api/categories",
        categoryInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setOpenDialogForCategory(false);
      triggerToast(
        "Create Success",
        "Category Created successfully!",
        "success"
      );
      if (itemFlag) {
        fetchCategoriesInItems();
      } else {
        await fetchCategories();
      }
    } catch (error) {
      console.log(error.response.data.errors, "error");

      const validationErrors = error.response.data.errors;
      setRequiredFields(validationErrors);
      triggerToast("Create failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    }
  };

  console.log(requiredFields, "requiredFields");
  const handleUpdateForCategories = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    setLoading(true);
    try {
      const responseForCategoriesUpdateData = await axios.put(
        `public/api/categories/${editIdForCategory}`,
        categoryInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setOpenDialogForCategory(false);
      triggerToast("Success", "Category Updated successfully!", "success");
      await fetchCategories();
    } catch (error) {
      triggerToast("Update failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const showGstHistory = async (id) => {
    console.log(id, "gst id");

    setShowGSTHistoryDialogOpen(true);
    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    console.log(id, "gst id");

    try {
      const response = await axios.get(`public/api/categories/gst-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
        params: {
          id,
        },
      });

      console.log(response.data, "gst history");
      setGstHistoryDataPagination(response.data.gst_history);
    } catch (error) {
      console.log(error);
    }
  };

  const showHsnHistory = async (id) => {
    console.log(id, "hsn id");

    setShowHSNHistoryDialogOpen(true);
    const token = localStorage.getItem("token");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    try {
      const response = await axios.get(`public/api/categories/hsn-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
        params: {
          id,
        },
      });

      console.log(response.data, "hsn history");
      setHSNHistoryDataPagination(response.data.hsn_history);
    } catch (error) {
      console.log(error);
    }
  };

  const gstHistoryHeaders = [
    "SL No.",
    "GST Percent",
    "Applicable Date",
    "Created At",
  ];

  const hsnHistoryHeaders = [
    "SL No.",
    "HSN Code",
    "Applicable Date",
    "Created At",
  ];

  const renderRow = (gstHistory, index) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        {gstHistoryDataPagination?.from + index || "N/A"}
      </td>

      <td className="px-6 py-4">{gstHistory?.gst_percent ?? "N/A"}</td>

      <td className="px-6 py-4">
        {gstHistory?.applicable_date
          ? new Date(gstHistory.applicable_date).toLocaleDateString("en-GB") // DD/MM/YYYY
          : "N/A"}
      </td>

      <td className="px-6 py-4">
        {gstHistory?.created_at ? (
          <>
            <span>
              {new Date(gstHistory.created_at).toLocaleDateString("en-GB")}{" "}
            </span>
            <span className="mx-2">
              {new Date(gstHistory.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </>
        ) : (
          "N/A"
        )}
      </td>
    </>
  );

  const renderRowForHsn = (hsnHistory, index) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        {hsnHistoryDataPagination?.from + index || "N/A"}
      </td>

      <td className="px-6 py-4">{hsnHistory?.hsn_code ?? "N/A"}</td>

      <td className="px-6 py-4">
        {hsnHistory?.applicable_date
          ? new Date(hsnHistory.applicable_date).toLocaleDateString("en-GB") // DD/MM/YYYY
          : "N/A"}
      </td>

      <td className="px-6 py-4">
        {hsnHistory?.created_at ? (
          <>
            <span>
              {new Date(hsnHistory.created_at).toLocaleDateString("en-GB")}
            </span>
            <span className="mx-2">
              {new Date(hsnHistory.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </>
        ) : (
          "N/A"
        )}
      </td>
    </>
  );

  return (
    <>
      {openDialogForCategory && (
        <Dialog
          open={openDialogForCategory}
          onClose={() => setOpenDialogForCategory(false)}
          className="relative z-50"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

          <div
            className={`fixed inset-0 overflow-y-auto transition-all duration-400 ${
              collapsed ? "lg:ml-20" : "lg:ml-72"
            }`}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-10">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100  pb-4 text-left shadow-xl transition-all sm:my-8 sm:max-w-7xl md:w-4/4 sm:p-0">
                <div className="bg-[var(--dialog-bgcolor)] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Category
                  </h2>
                  <div className="flex gap-2">
                    {isEditing && (
                      <>
                        <div className="flex gap-2">
                          <div
                            data-tooltip-id="hsn"
                            data-tooltip-content="HSN history"
                            onClick={() => showHsnHistory(id)}
                            className="gst flex items-center bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200 transition duration-200"
                          >
                            <NumberedListIcon className="h-5 w-5" />
                          </div>

                          {/* Place Tooltip here — outside the icon/button */}
                          <Tooltip
                            id="hsn"
                            place="top"
                            effect="solid"
                            className="hsn"
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          />
                        </div>
                        <div className="flex gap-2">
                          <div
                            data-tooltip-id="gst"
                            data-tooltip-content="GST history"
                            onClick={() => showGstHistory(id)}
                            className="gst flex items-center bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200 transition duration-200"
                          >
                            <PercentBadgeIcon className="h-5 w-5" />
                          </div>

                          {/* Place Tooltip here — outside the icon/button */}
                          <Tooltip
                            id="gst"
                            place="top"
                            effect="solid"
                            className="gst"
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          />
                        </div>
                        <div
                          onClick={() => setIsEditing(false)}
                          className="bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200 transition duration-200"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </div>
                      </>
                    )}

                    <div
                      onClick={() => setOpenDialogForCategory(false)}
                      className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200 transition duration-200"
                      title="Close"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="m-4 bg-white border rounded-md border-gray-200 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-5 sm:p-6 rounded-md ">
                    <div className="w-full sm:col-span-1">
                      <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        <h4>
                          Name <span className="text-red-400">*</span>
                        </h4>
                      </label>
                      <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        onChange={handleChangeForCategories}
                        value={categoryInputs?.name}
                        disabled={isEditing}
                        className={`mt-1 w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                      />

                      {requiredFields?.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields.name[0]}
                        </p>
                      )}
                    </div>

                    <div className="w-full sm:col-span-3">
                      <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        <h4>
                          Attributes <span className="text-red-400">*</span>
                        </h4>
                      </label>

                      <Select
                        isMulti
                        name="attributes"
                        options={renderAttributeData?.map((item) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                        value={renderAttributeData
                          ?.filter((item) =>
                            categoryInputs?.attributes?.includes(item.id)
                          )
                          .map((item) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                        onChange={(selectedOptions) => {
                          handleChangeForCategories({
                            target: {
                              name: "attributes",
                              value: selectedOptions.map(
                                (option) => option.value
                              ),
                            },
                          });
                        }}
                        className="w-full mt-2"
                        classNamePrefix="select"
                        isDisabled={isEditing}
                      />
                      {requiredFields?.attributes && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields.attributes[0]}
                        </p>
                      )}
                    </div>

                    <div className="w-full sm:col-span-2">
                      <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                        <PercentBadgeIcon className="h-5 w-5 text-gray-400" />
                        <h4 className="">
                          GST Percentage <span className="text-red-400">*</span>
                        </h4>
                      </label>
                      <input
                        type="text"
                        placeholder="GST Percentage"
                        name="gst_percent"
                        onChange={handleChangeForCategories}
                        value={categoryInputs?.gst_percent}
                        disabled={isEditing}
                        className={`mt-1 w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                      />

                      {requiredFields?.gst_percent && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields.gst_percent[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 sm:px-6 gap-5 mt-4 sm:mt-1 ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Applicable Date{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        name="gst_applicable_date"
                        value={categoryInputs?.gst_applicable_date || ""}
                        placeholder="GST Applicable Date"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChangeForCategories}
                        className={`mt-1 w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                        disabled={isEditing}
                      />
                      {requiredFields?.gst_applicable_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields.gst_applicable_date[0]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center  block text-sm font-medium text-gray-700 mb-1">
                        <NumberedListIcon className="h-5 w-5 text-gray-400" />
                        <h4>
                          HSN Code <span className="text-red-400">*</span>
                        </h4>
                      </label>
                      <div>
                        <input
                          type="text"
                          placeholder="HSN Code"
                          name="hsn_code"
                          onChange={handleChangeForCategories}
                          value={categoryInputs?.hsn_code}
                          disabled={isEditing}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                        />
                        {hsnCodeError && (
                          <p className="text-red-500 text-sm mt-1">
                            {hsnCodeError}
                          </p>
                        )}
                      </div>
                      {requiredFields?.hsn_code && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields.hsn_code[0]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        HSN Applicable Date{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        name="hsn_applicable_date"
                        value={categoryInputs?.hsn_applicable_date || ""}
                        placeholder="HSN Applicable Date"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChangeForCategories}
                        className={`mt-1 w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                        disabled={isEditing}
                      />
                      {requiredFields?.hsn_applicable_date && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields.hsn_applicable_date[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 sm:px-6 gap-5 mt-5">
                    {/* Input 5 */}
                    <div>
                      <label className="flex items-center  block text-sm font-medium text-gray-700 mb-1">
                        <CheckBadgeIcon className="h-5 w-5 text-gray-400" />
                        <h4>Active Status</h4>
                      </label>
                      <select
                        name="active_status"
                        onChange={handleChangeForCategories}
                        value={categoryInputs?.active_status}
                        disabled={isEditing}
                        className={`mt-1 w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                      >
                        <option value="" disabled>
                          Select Status
                        </option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>

                    {/* Margin From */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <NumberedListIcon className="h-5 w-5 text-gray-400" />
                        <span>Margin From</span>
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        name="margin_percent_from"
                        placeholder="Margin Percent From"
                        onChange={handleChangeForCategories}
                        value={categoryInputs.margin_percent_from}
                        disabled={isEditing}
                        min={50}
                        max={90}
                        className={`mt-1 w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      />
                      {requiredFields?.margin_percent_from && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields?.margin_percent_from}
                        </p>
                      )}
                    </div>

                    {/* Margin To */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <NumberedListIcon className="h-5 w-5 text-gray-400" />
                        <span>Margin To</span>
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        name="margin_percent_to"
                        placeholder="Margin Percent To"
                        onChange={handleChangeForCategories}
                        value={categoryInputs?.margin_percent_to}
                        disabled={isEditing}
                        min={50}
                        max={90}
                        className={`mt-1 w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      />
                      {requiredFields?.margin_percent_to && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields?.margin_percent_to}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 sm:px-6 gap-5 mt-5">
                    <div className="w-full sm:col-span-5">
                      <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-1">
                        <Bars3CenterLeftIcon className="h-5 w-5 text-gray-400" />
                        <h4>Description</h4>
                      </label>
                      <textarea
                        type="text"
                        rows={4}
                        name="description"
                        value={categoryInputs?.description}
                        placeholder="Description"
                        onChange={handleChangeForCategories}
                        disabled={isEditing}
                        className={`mt-1 w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none font-poppins`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-x-4 p-5">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setOpenDialogForCategory(false)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    )}

                    {saveBtnForCategory === "save" || item ? (
                      // <button
                      //   onClick={handleSubmitForCategories}
                      //   className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      // >
                      //   Save
                      // </button>
                      <SaveButton saveFunction={handleSubmitForCategories} />
                    ) : (
                      !isEditing && (
                        <button
                          onClick={handleUpdateForCategories}
                          className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                          Update
                        </button>
                      )
                    )}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}

      {showGSTHistoryDialogOpen && (
        <Dialog
          open={showGSTHistoryDialogOpen}
          onClose={() => {}}
          className="relative z-100"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

          <div
            className={`fixed inset-0 overflow-y-auto transition-all duration-400 ${
              collapsed ? "lg:ml-20" : "lg:ml-72"
            }`}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-10">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-0">
                <div className="bg-[#134b90] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    GST History
                  </h2>
                  <div className="flex gap-2">
                    {/* {isEditing && (
                                <div
                                  onClick={() => setIsEditing(false)}
                                  className="bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200 transition duration-200"
                                  title="Edit"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </div>
                              )} */}

                    <div
                      onClick={() => setShowGSTHistoryDialogOpen(false)}
                      className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200 transition duration-200"
                      title="Close"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="m-4 bg-white border rounded-md border-gray-200 p-4">
                  <div className=" sm:p-6 bg-gray-50 rounded-md ">
                    {gstHistoryDataPagination?.data?.length > 0 ? (
                      <>
                        <Table
                          headers={gstHistoryHeaders}
                          data={gstHistoryDataPagination?.data || []}
                          renderRow={renderRow}
                        />
                        <Pagination
                          meta={gstHistoryDataPagination}
                          onPageChange={(page) => setCurrentPage(page)}
                        />
                      </>
                    ) : (
                      <div className="text-center text-gray-600">
                        No GST history found.
                      </div>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}

      {showHSNHistoryDialogOpen && (
        <Dialog
          open={showHSNHistoryDialogOpen}
          onClose={() => {}}
          className="relative z-100"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

          <div
            className={`fixed inset-0 overflow-y-auto transition-all duration-400 ${
              collapsed ? "lg:ml-20" : "lg:ml-72"
            }`}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-10">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-0">
                <div className="bg-[#134b90] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    HSN History
                  </h2>
                  <div className="flex gap-2">
                    {/* {isEditing && (
                                <div
                                  onClick={() => setIsEditing(false)}
                                  className="bg-blue-100 text-blue-600 p-2 rounded-md cursor-pointer hover:bg-blue-200 transition duration-200"
                                  title="Edit"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </div>
                              )} */}

                    <div
                      onClick={() => setShowHSNHistoryDialogOpen(false)}
                      className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200 transition duration-200"
                      title="Close"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="m-4 bg-white border rounded-md border-gray-200 p-4">
                  <div className=" sm:p-6 bg-gray-50 rounded-md ">
                    {hsnHistoryDataPagination?.data?.length > 0 ? (
                      <>
                        <Table
                          headers={hsnHistoryHeaders}
                          data={hsnHistoryDataPagination?.data || []}
                          renderRow={renderRowForHsn}
                        />

                        <Pagination
                          meta={hsnHistoryDataPagination}
                          onPageChange={(page) => setCurrentPage(page)}
                        />
                      </>
                    ) : (
                      <div className="text-center text-gray-600">
                        No HSN history found.
                      </div>
                    )}
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

export default CatergoryDialogBox;
