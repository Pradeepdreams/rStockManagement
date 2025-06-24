import React, { useEffect, useState } from "react";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import {
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Select from "react-select";
import { useOutletContext } from "react-router-dom";
import axios from "../../Utils/AxiosInstance";
import { useToast } from "../../Context/ToastProvider";

function DiscountDialogBox({
        discountPaginationData,
        setOpenDialogForDiscount,
        setSaveBtnForDiscount,
        setDiscountInputs,
        fetchDiscount,
        setEditIdForDiscount,
        setCurrentPage,
        setLoading,
        loading,
        setIsEditing,
        isEditing,
        openDialogForDiscount,
        discountInputs,
        editIdForDiscount,
        saveBtnForDiscount
}) {
  const { collapsed } = useOutletContext();
  const { triggerToast } = useToast()
  const [requiredFields, setRequiredFields] = useState({
    discount_type: false,
    discount_percent: false,
    applicable_date: false,
  });

  const discountType = [
    { value: "Normal", label: "Normal" },
    { value: "Special", label: "Special" },
  ];


  const handleChangeForDiscount = async (e) => {
    const { name, value } = e.target;
    setDiscountInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForDiscount = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    try {
      await axios.post("public/api/discount-on-purchases", discountInputs, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      setOpenDialogForDiscount(false);
      triggerToast("Success", "Agent created successfully!", "success");
      // toast.success("Value created successfully!");

      await fetchDiscount();
    } catch (error) {
      triggerToast("Create failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data?.message || "Error creating value");
      setRequiredFields(error.response?.data?.errors);
    }
  };

  const handleUpdateForDiscount = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");


    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    setLoading(true);
    try {
      await axios.put(`public/api/discount-on-purchases/${editIdForDiscount}`, discountInputs, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      setOpenDialogForDiscount(false);
      await fetchDiscount();
      triggerToast("Success", "Value updated successfully!", "success");
      // toast.success("Value updated successfully!");
    } catch (error) {
      triggerToast("Update failed!", error.response?.data?.message, "error");
      // toast.error(error.response?.data?.message || "Error updating value");
    } finally {
      setLoading(false);
    }
  };

  // setIsEditing(true)

  return (
    <>
      {openDialogForDiscount && (
        <Dialog
          open={openDialogForDiscount}
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
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-0">
                <div className="bg-[#134b90] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Discounts
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
                      onClick={() => setOpenDialogForDiscount(false)}
                      className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={
                    isEditing ? handleUpdateForDiscount : handleSubmitForDiscount
                  }
                >
                  <div className="p-6 space-y-6 ">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount Type <span className="text-red-400">*</span>
                        </label>
                     <Select
                            name="discount_type"
                            options={discountType?.map((item) => ({
                              value: item.value,
                              label: item.label,
                            }))}
                            value={
                              discountType
                                ?.filter(
                                  (item) =>
                                    item.value === discountInputs?.discount_type
                                )
                                .map((item) => ({
                                  value: item.value,
                                  label: item.label,
                                }))[0] || null
                            }
                            onChange={(selectedOption) =>
                              handleChangeForDiscount({
                                target: {
                                  name: "discount_type",
                                  value: selectedOption
                                    ? selectedOption.value
                                    : null,
                                },
                              })
                            }
                            isDisabled={isEditing}
                            className="mt-2"
                            classNamePrefix="select"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
                              control: (base) => ({
                                ...base,
                                // backgroundColor: "#f3f4f6",
                                // cursor: "not-allowed",
                              }),
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                        {requiredFields?.discount_type && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields?.discount_type[0]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount Percent <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          name="discount_percent"
                          placeholder="Enter Discount Percent"
                          value={discountInputs.discount_percent}
                          onChange={handleChangeForDiscount}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />
                        {requiredFields?.discount_percent && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields?.discount_percent[0]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Applicable Date
                        </label>
                        <input
                          type="date"
                          name="applicable_date"
                          value={discountInputs.applicable_date}
                          onChange={handleChangeForDiscount}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none`}
                          disabled={isEditing}
                        />

                          {requiredFields?.applicable_date && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields?.applicable_date[0]}
                          </p>
                        )}
                      </div>
                    
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setOpenDialogForDiscount(false)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    )}

                    {saveBtnForDiscount === "save" ? (
                      <button
                        onClick={handleSubmitForDiscount}
                        className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      >
                        Save
                      </button>
                    ) : (
                      !isEditing && (
                        <button
                          onClick={handleUpdateForDiscount}
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

export default DiscountDialogBox;
