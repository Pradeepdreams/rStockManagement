import React, { useEffect, useState } from "react";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import {
  PencilIcon,
  XMarkIcon,
  UserCircleIcon,
  PercentBadgeIcon,
  PlusIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Select from "react-select";
import { useOutletContext } from "react-router-dom";
import AttributeValuesList from "./AttributeValuesList";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import { RadioIcon } from "@heroicons/react/24/solid";
import { useToast } from "../../Context/ToastProvider";
import { useSearch } from "../../Context/SearchContext";
import { Tooltip } from "react-tooltip";
import { useDiscountDialog } from "../../Context/DiscountDialogContext";

function AttributeValuesCreate() {
  const { collapsed } = useOutletContext();
  const { triggerToast } = useToast();
  const [open, setOpen] = useState(false);
  const [attributeValuesPagination, setAttributeValuesPagination] = useState(
    []
  );
  const [branchId, setBranchId] = useState([]);
  const [saveBtn, setSaveBtn] = useState("save");
  const [idCryptForAttributeValues, setIdCryptForAttributeValues] =
    useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [attributesPagination, setAttributesPagination] = useState([]);
  const [filterData, setFilterData] = useState({});

  const [attributeValuesInputs, setAttributeValuesInputs] = useState({
    values: "",
    attribute_id: "",
  });
  const [requiredFields, setRequiredFields] = useState({
    values: false,
    attribute_id: false,
  });
  const { searchTerm } = useSearch();
  const {
      openDialogForDiscount,
      toggleDialog,
      setOpenDialogForDiscount,
      discountPaginationData,
      setDiscountPaginationData,
      saveBtnForDiscount,
      setSaveBtnForDiscount,
      editIdForDiscount,
      setEditIdForDiscount,
      discountInputs,
      setDiscountInputs,
    } = useDiscountDialog();

  const fetchAttributeValues = async (page = 1, filters = filterData) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    setBranchId(branchIds[0]);
    console.log(branchIds[0], "crypt");

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page,
      ...filters,
    });
    

    if (searchTerm && searchTerm.trim() !== "") {
      queryParams.append("search", searchTerm);
    }


    try {
      const response = await axios.get(
        `public/api/attribute-values?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setAttributeValuesPagination(response.data);

      const responseForAttributes = await axios.get(`public/api/attributes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      setAttributesPagination(
        responseForAttributes.data.attributes?.data || []
      );
    } catch (error) {
      triggerToast("Error", error?.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributeValues(currentPage);
  }, [currentPage]);

  const serachAttributeValuesFetch = async (page = 1, searchTerm) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page,
      search: searchTerm,
    });

    try {
      const response = await axios.get(
        `public/api/attribute-values?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      setAttributeValuesPagination(response.data);
    } catch (error) {
      triggerToast("Error", error?.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    serachAttributeValuesFetch(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleChangeForAttributeValues = (e) => {
    const { name, value } = e.target;
    setAttributeValuesInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddForAttributeValues = () => {
    setOpen(true);
    setSaveBtn("save");
    setIsEditing(false);
    setAttributeValuesInputs({
      attribute_id: "",
    });
  };

  const handleSubmitForAttributeValues = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("public/api/attribute-values", attributeValuesInputs, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchId,
        },
      });

      setOpen(false);
      triggerToast(
        "Success",
        "Attributes Value created successfully!",
        "success"
      );
      await fetchAttributeValues();
    } catch (error) {
      triggerToast("Create failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data?.message || "Error creating value");
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleUpdateForAttributeValues = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // if (!attributeValuesInputs.values || !attributeValuesInputs.attribute_id) {
    //   toast.error("All fields are required.");
    //   return;
    // }

    setLoading(true);
    try {
      await axios.put(
        `public/api/attribute-values/${idCryptForAttributeValues}`,
        attributeValuesInputs,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );
      setOpen(false);
      triggerToast(
        "Success",
        "Attributes Value updated successfully!",
        "success"
      );
      await fetchAttributeValues();
      // toast.success("Value updated successfully!");
    } catch (error) {
      triggerToast("Update failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data?.message || "Error updating value");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Sub Attributes"
        description="A list of all Sub Attributes"
        buttonName="Add Sub Attribute"
        setOpen={setOpen}
        handleDialogOpen={handleAddForAttributeValues}
      />

      <AttributeValuesList
        attributeValuesPagination={attributeValuesPagination}
        setOpen={setOpen}
        branchId={branchId}
        setBranchId={setBranchId}
        setSaveBtn={setSaveBtn}
        setAttributeValuesInputs={setAttributeValuesInputs}
        fetchAttributeValues={fetchAttributeValues}
        setIdCryptForAttributeValues={setIdCryptForAttributeValues}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
        filterData={filterData}
        setFilterData={setFilterData}
      />

      {open && (
        <Dialog open={open} onClose={() => {}} className="relative z-50">
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
                    Attribute Values
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
                      onClick={() => setOpen(false)}
                      className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={
                    isEditing
                      ? handleUpdateForAttributeValues
                      : handleSubmitForAttributeValues
                  }
                >
                  <div className="p-6 space-y-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attribute
                          </label>
                          <span className="text-red-400">*</span>
                        </div>

                        <Select
                          name="attribute_id"
                          options={attributesPagination.map((attr) => ({
                            value: attr.id,
                            label: attr.name,
                          }))}
                          value={
                            attributesPagination
                              .map((attr) => ({
                                value: attr.id,
                                label: attr.name,
                              }))
                              .find(
                                (option) =>
                                  option.value ===
                                  attributeValuesInputs.attribute_id
                              ) || null
                          }
                          onChange={(selectedOption) => {
                            setAttributeValuesInputs((prev) => ({
                              ...prev,
                              attribute_id: selectedOption
                                ? selectedOption.value
                                : "",
                            }));
                          }}
                          isDisabled={isEditing}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                          menuPosition="fixed"
                          // className="mt-2"
                        />
                        {requiredFields.attribute_id && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.attribute_id}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Attribute Value
                          </label>
                          <span className="text-red-400">*</span>
                           {/* <PlusCircleIcon
                            data-tooltip-id="discount"
                            data-tooltip-content="Add Discount"
                              className="h-5 w-5 text-blue-600 cursor-pointer focus:outline-0 hover:text-blue-500"
                            onClick={()=>setOpenDialogForDiscount(true)}
                            />
                               <Tooltip
                            id="discount"
                            place="top"
                            effect="solid"
                            className="hsn"
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          /> */}
                        </div>
                        <input
                          type="text"
                          name="values"
                          placeholder="Enter Attribute Value"
                          value={attributeValuesInputs.values}
                          onChange={handleChangeForAttributeValues}
                          className={` w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />
                        {requiredFields.values && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.values}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    )}

                    {saveBtn === "save" ? (
                      <button
                        onClick={handleSubmitForAttributeValues}
                        className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      >
                        Save
                      </button>
                    ) : (
                      !isEditing && (
                        <button
                          onClick={handleUpdateForAttributeValues}
                          className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                          Update
                        </button>
                      )
                    )}
                  </div>
                </form>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default AttributeValuesCreate;
