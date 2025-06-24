import React, { useEffect, useState } from "react";
import { useDialogForItems } from "../../Context/ItemDialogContext";
import { useOutletContext } from "react-router-dom";
import {
  Bars3CenterLeftIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  NumberedListIcon,
  PencilIcon,
  PercentBadgeIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "../../Utils/AxiosInstance";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { toast } from "react-toastify";
import Select from "react-select";
import { useDialogForCategory } from "../../Context/CategoryDialogContext";
import CatergoryDialogBox from "../Category/CatergoryDialogBox";
import { useToast } from "../../Context/ToastProvider";

function ItemDialogBox({
  fetchItems,
  fetchItemsAfterDialogClose,
  categoryPagination,
  setCategoriesData,
  categoriesData,
  hideplusiconforcategory,
  itemInputs,
  setItemInputs,
  vendorFlag,
  isEditing,
  setIsEditing,
}) {
  const {
    openDialogForItems,
    setOpenDialogForItems,
    editIdForItems,
    setEditIdForItems,
    saveBtnForItems,
  } = useDialogForItems();

  const { setCategoryInputs } = useDialogForCategory();
  const { triggerToast } = useToast();
  const [requiredFields, setRequiredFields] = useState({
    item_name: false,
    category_id: false,
    // margin_percent_from: false,
    // margin_percent_to: false,
    unit_of_measurement: false,
  });
  const { collapsed } = useOutletContext();
  const [attributesId, setAttributesId] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  // const [marginError, setMarginError] = useState("");
  const [attributeFields, setAttributeFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  console.log(errors, "errors");
  

  const [vendorItemsInputs, setVendorItemsInputs] = useState({
    item_name: "",
    category_id: "",
    attributes: [],
    margin_percent: "",
    margin_percent_from: "",
    margin_percent_to: "",
    reorder_level: "",
    unit_of_measurement: "",
    item_code: "",
  });

  const {
    openDialogForCategory,
    setOpenDialogForCategory,
    setSaveBtnForCategory,
  } = useDialogForCategory();

  const handleAddCategory = () => {
    setOpenDialogForCategory(true);
    setCategoryInputs({
      name: "",
      attributes: [],
      gst_percent: "",
      applicable_date: "",
      hsn_code: "",
      active_status: "",
      description: "",
    });
  };

  const handleChangeForVendorItems = (e) => {
    const { name, value } = e.target;

     if (name === "unit_of_measurement") {
    const alphabetOnly = /^[A-Za-z\s]*$/;

    if (!alphabetOnly.test(value)) {
      setErrors("Only alphabets are allowed.");
      return; // ✅ prevent update
    } else {
      setErrors("");
    }
    }

    setVendorItemsInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };


  const handleChangeForItems = async (e) => {
    const { name, value, idCrypt } = e.target;
    console.log(name, value);

    if (name === "category_id") {
      setCategoryId(value);
    }
    if (name === "unit_of_measurement") {
    const alphabetOnly = /^[A-Za-z\s]*$/;

    if (!alphabetOnly.test(value)) {
      setErrors("Only alphabets are allowed.");
      return; // ✅ prevent update
    } else {
      setErrors("");
    }
    }

    setItemInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    if (idCrypt) {
      const token = localStorage.getItem("token");
      const branchData = await getBranchDataFromBalaSilksDB();
      const branchIds = branchData.map((branch) => branch.branch.id_crypt);
      try {
        const responseForCategory = await axios.get(
          `public/api/categories/${idCrypt}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Branch-Id": branchIds[0],
            },
          }
        );

        setCategoriesData(responseForCategory.data);
        setAttributesId(
          responseForCategory.data.attributes?.map((attr) => attr.id)
        );

        // Optional: update attributeFields
        setAttributeFields(responseForCategory.data);
      } catch (error) {
        triggerToast("Fetch failed!", error.response.data.message, "error");
        console.error("Error fetching category attributes:", error);
      }
    }
  };

  const handleChangeForAttributeItems = (selectedOption, attributeId) => {
    // Ensure selectedOption is valid
    if (!selectedOption) return;

    const { value, label } = selectedOption; // Destructure both value and label

    const updatedAttributes = Array.isArray(itemInputs.attributes)
      ? [...itemInputs.attributes]
      : [];

    const existingAttributeIndex = updatedAttributes.findIndex(
      (attr) => attr.attribute_id === attributeId
    );

    if (existingAttributeIndex > -1) {
      // Update existing attribute with full object
      updatedAttributes[existingAttributeIndex] = {
        attribute_id: attributeId,
        attribute_value: { value, label }, // Store the full object with value and label
      };
    } else {
      // Add new attribute with full object
      updatedAttributes.push({
        attribute_id: attributeId,
        attribute_value: { value, label }, // Store the full object with value and label
      });
    }

    setItemInputs({
      ...itemInputs,
      attributes: updatedAttributes,
    });
  };

  const formattedAttributes = itemInputs?.attributes?.map((attr) => ({
    attribute_id: attr.attribute_id,
    attribute_value_id: attr.attribute_value?.value ?? null,
  }));

  const handleSubmitForItems = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    console.log(vendorItemsInputs, "payload");
    const payload = vendorFlag ? vendorItemsInputs : itemInputs;

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    try {
      const responseForItemsCreateData = await axios.post(
        "public/api/items",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForItemsCreateData, "responseForItemsCreateData");

      triggerToast("Create Success", "Item created successfully!", "success");

      // setOpenDialogForItems(false);
      if (vendorFlag) {
        await fetchItemsAfterDialogClose();
        setOpenDialogForItems(false);
      } else {
        await fetchItems();
        setOpenDialogForItems(false);
      }
    } catch (error) {
      triggerToast("Create failed!", error.response?.data?.message, "error");
      // toast.error(error?.response?.data?.message || "Something went wrong");
      setRequiredFields(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateForItems = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForItemsUpdateData = await axios.put(
        `public/api/items/${editIdForItems}`,
        itemInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForItemsUpdateData, "responseForItemsUpdateData");

      await fetchItems();
      if (responseForItemsUpdateData.data) {
        triggerToast("Success", "Item Updated successfully!", "success");
        setOpenDialogForItems(false);
        if (vendorFlag) {
          await fetchItemsAfterDialogClose();
          setOpenDialogForItems(false);
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      triggerToast("Update failed!", error.response?.data?.message, "error");
      // toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {openDialogForItems && (
        <Dialog
          open={openDialogForItems}
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
                <div className="bg-[#134b90] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Items
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
                      onClick={() => setOpenDialogForItems(false)}
                      className="bg-white text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white transition duration-200"
                      title="Close"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="m-4 bg-white border rounded-md border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-400 mb-4 ">
                    Items
                  </h3>

                  {vendorFlag ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-5 gap-y-6 bg-gray-50 rounded-md p-4">
                      {/* Item Name */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          <span>Item Name</span>{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="item_name"
                          placeholder="Item Name"
                          onChange={handleChangeForVendorItems}
                          value={vendorItemsInputs?.item_name}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                        {requiredFields.item_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.item_name}
                          </p>
                        )}
                      </div>

                      {/* Item Code (only when editing) */}
                      {editIdForItems && (
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                            <span>Item Code</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Item Code"
                            name="item_code"
                            onChange={handleChangeForVendorItems}
                            value={vendorItemsInputs.item_code}
                            disabled
                            className="w-full bg-white opacity-50 cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins"
                          />
                        </div>
                      )}

                      {/* Reorder Level */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <CheckBadgeIcon className="h-5 w-5 text-gray-400" />
                          <span>Reorder Level</span>
                        </label>
                        <input
                          type="text"
                          name="reorder_level"
                          placeholder="Reorder Level"
                          onChange={handleChangeForVendorItems}
                          value={vendorItemsInputs?.reorder_level}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                      </div>

                      {/* Unit Measurement */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Bars3CenterLeftIcon className="h-5 w-5 text-gray-400" />
                          <span>Unit Measurement</span>
                          <span className="text-red-400">*</span>
                        </label>
                        {/* <input
                          type="text"
                          name="unit_of_measurement"
                          placeholder="Unit Measurement"
                          onChange={handleChangeForVendorItems}
                          value={vendorItemsInputs?.unit_of_measurement}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                         {errors && (
    <p className="text-sm text-red-600 mt-1">{errors}</p>
  )} */}
  <input
  type="text"
  name="unit_of_measurement"
  placeholder="Unit Measurement"
  onChange={handleChangeForVendorItems}
  value={vendorItemsInputs?.unit_of_measurement}
  disabled={isEditing}
  className={`w-full bg-white ${
    isEditing ? "opacity-50 cursor-not-allowed" : ""
  } rounded-md border ${
    errors ? "border-red-500" : "border-gray-300"
  } px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
/>

{errors && (
  <p className="text-sm text-red-600 mt-1">{errors}</p>
)}


                        {requiredFields.unit_of_measurement && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.unit_of_measurement}
                          </p>
                        )}

                        
                      </div>

                      {/* Category Dropdown - spans full width */}
                      <div className="col-span-1">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <PercentBadgeIcon className="h-5 w-5 text-gray-400" />
                          <span>Category</span>
                          <span className="text-red-400">*</span>
                          {hideplusiconforcategory === "hide" ? (
                            ""
                          ) : (
                            <PlusCircleIcon
                              className="h-5 w-5 text-blue-400 cursor-pointer"
                              onClick={(e) => handleAddCategory(e)}
                            />
                          )}
                        </label>

                        <Select
                          name="category_id"
                          options={categoryPagination?.map((category) => ({
                            value: category.id,
                            label: category.name,
                            idCrypt: category.id_crypt,
                          }))}
                          value={
                            categoryPagination
                              ?.map((category) => ({
                                value: category.id,
                                label: category.name,
                                idCrypt: category.id_crypt,
                              }))
                              .find(
                                (option) =>
                                  Number(option.value) ===
                                  Number(vendorItemsInputs?.category_id)
                              ) || null
                          }
                          onChange={(selectedOption) => {
                            handleChangeForVendorItems({
                              target: {
                                name: "category_id",
                                value: selectedOption
                                  ? selectedOption.value
                                  : "",
                                idCrypt: selectedOption
                                  ? selectedOption.idCrypt
                                  : null,
                              },
                            });
                          }}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPosition="fixed"
                          classNamePrefix="select"
                          isDisabled={isEditing}
                        />

                        {requiredFields?.category_id && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields?.category_id}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-5 gap-y-6 bg-gray-50 rounded-md p-4">
                      {/* Item Name */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          <span>Item Name</span>{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="item_name"
                          placeholder="Item Name"
                          onChange={handleChangeForItems}
                          value={itemInputs?.item_name}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                        {requiredFields.item_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.item_name}
                          </p>
                        )}
                      </div>

                      {/* Item Code (only when editing) */}
                      {editIdForItems && (
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                            <span>Item Code</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Item Code"
                            name="item_code"
                            onChange={handleChangeForItems}
                            value={itemInputs.item_code}
                            disabled
                            className="w-full bg-white opacity-50 cursor-not-allowed rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins"
                          />
                        </div>
                      )}

                      {/* Margin From */}
                      {/* <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <NumberedListIcon className="h-5 w-5 text-gray-400" />
                        <span>Margin From</span>
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        name="margin_percent_from"
                        placeholder="Margin Percent From"
                        onChange={handleChangeForItems}
                        value={itemInputs?.margin_percent_from}
                        disabled={isEditing}
                        min={50}
                        max={90}
                        className={`w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                      />
                      {requiredFields?.margin_percent_from && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields.margin_percent_from}
                        </p>
                      )}
                    </div> */}

                      {/* Margin To */}
                      {/* <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <NumberedListIcon className="h-5 w-5 text-gray-400" />
                        <span>Margin To</span>
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        name="margin_percent_to"
                        placeholder="Margin Percent To"
                        onChange={handleChangeForItems}
                        value={itemInputs?.margin_percent_to}
                        disabled={isEditing}
                        min={50}
                        max={90}
                        className={`w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                      />
                      {requiredFields?.margin_percent_to && (
                        <p className="text-red-500 text-sm mt-1">
                          {requiredFields.margin_percent_to}
                        </p>
                      )}
                    </div> */}

                      {/* Reorder Level */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <CheckBadgeIcon className="h-5 w-5 text-gray-400" />
                          <span>Reorder Level</span>
                        </label>
                        <input
                          type="text"
                          name="reorder_level"
                          placeholder="Reorder Level"
                          onChange={handleChangeForItems}
                          value={itemInputs?.reorder_level}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                      </div>

                      {/* Unit Measurement */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Bars3CenterLeftIcon className="h-5 w-5 text-gray-400" />
                          <span>Unit Measurement</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="unit_of_measurement"
                          placeholder="Unit Measurement"
                          onChange={handleChangeForItems}
                          value={itemInputs?.unit_of_measurement}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />

                        {errors && (
  <p className="text-sm text-red-600 mt-1">{errors}</p>
)}

                        {requiredFields.unit_of_measurement && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.unit_of_measurement}
                          </p>
                        )}
                      </div>

                      {/* Category Dropdown - spans full width */}
                      <div className="col-span-1">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <PercentBadgeIcon className="h-5 w-5 text-gray-400" />
                          <span>Category</span>
                          <span className="text-red-400">*</span>
                          {hideplusiconforcategory === "hide" ? (
                            ""
                          ) : (
                            <PlusCircleIcon
                              className="h-5 w-5 text-blue-400 cursor-pointer"
                              onClick={(e) => handleAddCategory(e)}
                            />
                          )}
                        </label>
                        {/* <Select
                        name="category_id"
                        options={categoryPagination?.map((category) => ({
                          value: category.id,
                          label: category.name,
                          idCrypt: category.id_crypt,
                        }))}
                        value={
                          categoryPagination
                            .find(
                              (option) =>
                                option.value == itemInputs?.category_id
                            ) || null
                            ?.map((category) => ({
                              value: category.id,
                              label: category.name,
                              idCrypt: category.id_crypt,
                            }))
                        }
                        onChange={(selectedOption) => {
                          handleChangeForItems({
                            target: {
                              name: "category_id",
                              value: selectedOption ? selectedOption.value : "",
                              idCrypt: selectedOption
                                ? selectedOption.idCrypt
                                : null,
                            },
                          });
                        }}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPosition="fixed"
                        classNamePrefix="select"
                        isDisabled={isEditing}
                      /> */}

                        <Select
                          name="category_id"
                          options={categoryPagination?.map((category) => ({
                            value: category.id,
                            label: category.name,
                            idCrypt: category.id_crypt,
                          }))}
                          value={
                            categoryPagination
                              ?.map((category) => ({
                                value: category.id,
                                label: category.name,
                                idCrypt: category.id_crypt,
                              }))
                              .find(
                                (option) =>
                                  Number(option.value) ===
                                  Number(itemInputs?.category_id)
                              ) || null
                          }
                          onChange={(selectedOption) => {
                            handleChangeForItems({
                              target: {
                                name: "category_id",
                                value: selectedOption
                                  ? selectedOption.value
                                  : "",
                                idCrypt: selectedOption
                                  ? selectedOption.idCrypt
                                  : null,
                              },
                            });
                          }}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPosition="fixed"
                          classNamePrefix="select"
                          isDisabled={isEditing}
                        />

                        {requiredFields.category_id && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.category_id}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {categoriesData && (
                    <div className="p-4 border border-gray-200 rounded-md shadow-sm bg-white mt-4 mb-4">
                      <h4 className="text-md font-semibold text-gray-700 ">
                        Select Category Items
                      </h4>
                      <div className="mt-2 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead>
                                <tr>
                                  <th className="text-center py-3.5 pr-3 pl-4 text-sm font-semibold text-gray-900 sm:pl-0">
                                    S No
                                  </th>
                                  <th className="text-center py-3.5 pr-3 pl-4 text-sm font-semibold text-gray-900 sm:pl-0">
                                    Category Name
                                  </th>
                                  <th className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                                    HSN Code
                                  </th>
                                  <th className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                                    Attributes
                                  </th>
                                  <th className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                                    GST Percent
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                <tr>
                                  <td className="py-4 pr-3 pl-4 text-center text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                                    {1}
                                  </td>
                                  <td className="py-4 pr-3 pl-4 text-center text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                                    {categoriesData.name}
                                  </td>
                                  <td className="px-3 py-4 text-sm text-center whitespace-nowrap text-gray-500">
                                    {categoriesData.hsn_code}
                                  </td>
                                  <td className="px-3 py-4 text-sm text-center whitespace-nowrap text-gray-500">
                                    {categoriesData.attributes
                                      ?.map((attr) => attr.name)
                                      .join(", ")}
                                  </td>
                                  <td className="px-3 py-4 text-sm text-center whitespace-nowrap text-gray-500">
                                    {categoriesData.gst_percent}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className=" p-5 pb-5 sm:pb-0">
                    <div className="mt-3 sm:mt-4">
                      <div className="grid grid-cols-1 sm:hidden">
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setOpenDialogForItems(false)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    )}

                    {saveBtnForItems === "save" ? (
                      <button
                        onClick={handleSubmitForItems}
                        className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      >
                        Save
                      </button>
                    ) : (
                      !isEditing && (
                        <button
                          onClick={handleUpdateForItems}
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
    </>
  );
}

export default ItemDialogBox;
