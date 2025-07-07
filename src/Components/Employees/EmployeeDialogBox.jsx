import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Bars3CenterLeftIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  CurrencyRupeeIcon,
  DocumentChartBarIcon,
  EnvelopeIcon,
  HomeModernIcon,
  ListBulletIcon,
  LockClosedIcon,
  MapPinIcon,
  NumberedListIcon,
  PencilIcon,
  PercentBadgeIcon,
  PlusCircleIcon,
  RectangleGroupIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/16/solid";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "../Utils/AxiosInstance";
// import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import { getBranchDataFromBalaSilksDB } from "../Utils/indexDB";
import { errorDialog } from "../Context/ErrorContext";
import SaveButton from "../Utils/SaveButton";

function EmployeeDialogBox({
  openDialogForEmployee,
  setOpenDialogForEmployee,
  saveBtnForEmployee,
  editIdForEmployee,
  employeeInputs,
  setEmployeeInputs,
  isEditing,
  setIsEditing,
  pincodePagination,
  branchPagination,
  qualificationPagination,
  rolePagination,
  fetchEmployeesData,
  setEditIdForEmployee,
  setOpenDialogForQualification,
}) {
  const { collapsed } = useOutletContext();
  const { checkAuthError } = errorDialog();
  const [requiredFields, setRequiredFields] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    phone: "",
    date_of_join: "",
    qualification_id: "",
    status: "",
    salary: "",
    branch_id: "",
    roles: "",
    address_line_1: "",
    address_line_2: "",
    country: "",
    state: "",
    city: "",
    pincode_id: "",
  });

  const navigate = useNavigate();

  const handleChangeForEmployees = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    if (name === "pincode_id") {
      const selectedIds = Array.isArray(value) ? value : [value];
      const selectedPincodeObjects = pincodePagination?.filter((item) =>
        selectedIds.includes(item.id)
      );

      const selectedPincode = selectedPincodeObjects[0]; // Assuming single select

      if (selectedPincode) {
        setEmployeeInputs((prev) => ({
          ...prev,
          country: selectedPincode.country,
          state: selectedPincode.state,
          city: selectedPincode.city,
        }));
      }
    }
    setEmployeeInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const transformEmployeeData = (formData) => {
    const { branch_id, roles, ...rest } = formData;

    // Transforming into the required format
    return {
      ...rest,
      branches: [
        {
          branch_id,
          role_ids: roles,
        },
      ],
    };
  };

  const handleSubmitForEmployees = async (e) => {
    e.preventDefault();
    console.log(employeeInputs, "Employee Inputs");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const formattedData = transformEmployeeData(employeeInputs);

    try {
      const response = await axios.post("public/api/employees", formattedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      setOpenDialogForEmployee(false);
      await fetchEmployeesData();
      console.log(response, "employee res");
      toast.success("Employee added successfully");
    } catch (error) {
      setRequiredFields(error.response.data.errors);
      checkAuthError(error);
    }
  };
  const handleUpdateForEmployees = async (e) => {
    e.preventDefault();
    console.log(employeeInputs, "Employee Inputs");
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const formattedData = transformEmployeeData(employeeInputs);
    try {
      const response = await axios.put(
        `public/api/employees/${editIdForEmployee}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(response, "employee res");
      setOpenDialogForEmployee(false);
      await fetchEmployeesData();

      toast.success("Employee added successfully");
    } catch (error) {
      setRequiredFields(error.response.data.errors);
    }
  };

  const handleDialogCloseForEmployee = () => {
    setOpenDialogForEmployee(false);
    setRequiredFields({});
    setEmployeeInputs({
      first_name: "",
      last_name: "",
      gender: "",
      email: "",
      phone: "",
      date_of_join: "",
      qualification_id: "",
      status: "",
      salary: "",
      branch_id: "",
      roles: "",
      address_line_1: "",
      address_line_2: "",
      country: "",
      state: "",
      city: "",
      pincode_id: "",
    });
    setEditIdForEmployee("");
  };

  const handleAddQualification = () => {
    setOpenDialogForQualification(true);
  };

  return (
    <>
      {openDialogForEmployee && (
        <Dialog
          open={openDialogForEmployee}
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
                    Employees
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
                      onClick={handleDialogCloseForEmployee}
                      className="bg-white text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white transition duration-200"
                      title="Close"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="m-4 bg-white border rounded-md border-gray-200 p-4">
                  {/* <h3 className="text-lg font-semibold text-gray-400 mb-4 ">
                    Employees
                  </h3> */}

                  <div className="gap-x-5 gap-y-6 bg-gray-50 rounded-md p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6">
                      {/* Item Name */}
                      <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <RectangleGroupIcon className="h-5 w-5 text-gray-400" />
                          <span>First Name</span>{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          placeholder="First Name"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.first_name}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                        {requiredFields.first_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.first_name}
                          </p>
                        )}
                      </div>

                      {/* Margin From */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <RectangleGroupIcon className="h-5 w-5 text-gray-400" />
                          <span>Last Name</span>
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          placeholder="Last Name"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.last_name}
                          disabled={isEditing}
                          min={50}
                          max={90}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                        {requiredFields.last_name && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.last_name}
                          </p>
                        )}
                      </div>

                      {/* Margin To */}
                      <div className="flex flex-col ">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                            <span>Gender</span>
                            <span className="text-red-400">*</span>
                          </label>

                          {/* <div className="bg-white flex flex-wrap gap-4 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins"> */}

                          <Select
                            name="gender"
                            options={[
                              { value: "Male", label: "Male" },
                              { value: "Female", label: "Female" },
                              { value: "Other", label: "Other" },
                            ]}
                            value={
                              employeeInputs.gender
                                ? {
                                    value: employeeInputs.gender,
                                    label: employeeInputs.gender,
                                  }
                                : null
                            }
                            onChange={(selectedOption) => {
                              handleChangeForEmployees({
                                target: {
                                  name: "gender",
                                  value: selectedOption?.value,
                                },
                              });
                            }}
                            className="w-full mt-1"
                            classNamePrefix="select"
                            isDisabled={isEditing}
                          />

                          {/* </div> */}

                          {requiredFields.gender && (
                            <p className="text-red-500 text-sm mt-1">
                              {requiredFields.gender}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Reorder Level */}
                      <div className="w-full col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 ">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                          <span>Email</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="email"
                          placeholder="Email"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.email}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                        {requiredFields.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.email}
                          </p>
                        )}
                      </div>

                      <div
                        className={`${editIdForEmployee ? "hidden" : "block"}`}
                      >
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <LockClosedIcon className="h-5 w-5 text-gray-400" />
                          <span>Password</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="password"
                          placeholder="Enter Password"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.password}
                          //   disabled
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                        {requiredFields.password && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.password}
                          </p>
                        )}
                      </div>

                      <div className="w-full ">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <NumberedListIcon className="h-5 w-5 text-gray-400" />
                          <span>Phone</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          name="phone"
                          placeholder="Enter Phone Number"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.phone}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        />
                        {requiredFields.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-6 mt-8">
                      {/* Unit Measurement */}

                      <div className="w-full col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3 md:order-last">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <Bars3CenterLeftIcon className="h-5 w-5 text-gray-400" />
                          <span className="flex gap-2">
                            Qualification{" "}
                            <PlusCircleIcon
                              className="h-5 w-5 text-blue-400"
                              onClick={handleAddQualification}
                            />
                          </span>
                        </label>
                        <Select
                          name="qualification_id"
                          options={
                            qualificationPagination?.map((qualification) => ({
                              value: qualification.id,
                              label: qualification.name,
                            })) || []
                          }
                          value={
                            qualificationPagination
                              ?.map((qualification) => ({
                                value: qualification.id,
                                label: qualification.name,
                              }))
                              .find(
                                (option) =>
                                  option.value ===
                                  employeeInputs?.qualification_id
                              ) || null
                          }
                          onChange={(selectedOption) => {
                            handleChangeForEmployees({
                              target: {
                                name: "qualification_id",
                                value: selectedOption?.value || null,
                              },
                            });
                          }}
                          className="w-full mt-2"
                          classNamePrefix="select"
                          isDisabled={isEditing}
                          placeholder="Select Qualification"
                        />
                      </div>

                      <div className="w-full md:order-second">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                          <span>Date Of Join</span>
                        </label>
                        <input
                          type="date"
                          name="date_of_join"
                          placeholder="Enter Date Of Join"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.date_of_join}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5 mt-8">
                      {/* Status */}
                      <div className="col-span-1">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <ShieldExclamationIcon className="h-5 w-5 text-gray-400" />
                          <span>Status</span>
                        </label>
                        <select
                          name="is_active"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.is_active}
                          disabled={isEditing}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        >
                          <option value="" disabled>
                            Select Status
                          </option>
                          <option value="0">Inactive</option>
                          <option value="1">Active</option>
                        </select>

                        {requiredFields.is_active && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.is_active}
                          </p>
                        )}
                      </div>

                      {/* Salary */}
                      <div className="col-span-1">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                          <span>Salary</span>
                        </label>
                        <input
                          type="number"
                          name="salary"
                          placeholder="Enter Salary"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.salary}
                          disabled={isEditing}
                          className={`mt-1 w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        />
                        {requiredFields.salary && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.salary}
                          </p>
                        )}
                      </div>

                      {/* Branch */}
                      <div className="col-span-1">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <DocumentChartBarIcon className="h-5 w-5 text-gray-400" />
                          <span>Branch</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <Select
                          name="branch_id"
                          options={
                            branchPagination?.map((branch) => ({
                              value: branch.id,
                              label: branch.name,
                            })) || []
                          }
                          value={
                            branchPagination
                              ?.map((branch) => ({
                                value: branch.id,
                                label: branch.name,
                              }))
                              .find(
                                (option) =>
                                  option.value === employeeInputs?.branch_id
                              ) || null
                          }
                          onChange={(selectedOption) => {
                            handleChangeForEmployees({
                              target: {
                                name: "branch_id",
                                value: selectedOption?.value || null,
                              },
                            });
                          }}
                          className="w-full mt-2"
                          classNamePrefix="select"
                          isDisabled={isEditing}
                          placeholder="Select Branch"
                          />
                        {requiredFields.branch_id && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.branch_id}
                          </p>
                        )}
                      </div>

                      <div className="">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <UserPlusIcon className="h-5 w-5 text-gray-400" />
                          <span>Role</span>{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <Select
                          isMulti
                          name="roles"
                          options={
                            rolePagination?.map((role) => ({
                              value: role.id,
                              label: role.name,
                            })) || []
                          }
                          value={rolePagination
                            ?.filter((role) =>
                              employeeInputs?.roles?.includes(role.id)
                            )
                            .map((role) => ({
                              value: role.id,
                              label: role.name,
                            }))}
                          onChange={(selectedOptions) => {
                            handleChangeForEmployees({
                              target: {
                                name: "roles",
                                value: selectedOptions.map(
                                  (option) => option.value
                                ),
                              },
                            });
                          }}
                          className="w-full mt-2"
                          classNamePrefix="select"
                          isDisabled={isEditing}
                          placeholder="Select Role"
                        />

                        {requiredFields.role_ids && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.role_ids}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-5 gap-y-6 mt-8">
                      <div className="w-full">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <ListBulletIcon className="h-5 w-5 text-gray-400" />
                          <span>Address Line 1</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="address_line_1"
                          placeholder="Enter Address Line 1"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.address_line_1}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                        {requiredFields.address_line_1 && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.address_line_1}
                          </p>
                        )}
                      </div>

                      <div className="w-full">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <ListBulletIcon className="h-5 w-5 text-gray-400" />
                          <span>Address Line 2</span>
                        </label>
                        <input
                          type="text"
                          name="address_line_2"
                          placeholder="Enter Address Line 2"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.address_line_2}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6 mt-8">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <MapPinIcon className="h-5 w-5 text-gray-400" />
                          <span>Country</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="country"
                          placeholder="Enter Country"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.country}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                        {requiredFields.country && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.country}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <ChartPieIcon className="h-5 w-5 text-gray-400" />
                          <span>State</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          placeholder="Enter State"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.state}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                        {requiredFields.state && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <HomeModernIcon className="h-5 w-5 text-gray-400" />
                          <span>City</span>
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          placeholder="Enter City"
                          onChange={handleChangeForEmployees}
                          value={employeeInputs.city}
                          disabled={isEditing}
                          className={`w-full bg-white ${
                            isEditing && "opacity-50 cursor-not-allowed"
                          } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                        />
                        {requiredFields.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <NumberedListIcon className="h-5 w-5 text-gray-400" />
                          <span>Pincode</span>
                          <span className="text-red-400">*</span>
                        </label>
                        {/* <input
                        type="number"
                        name="pincode"
                        placeholder="Enter Pincode"
                        onChange={handleChangeForEmployees}
                        value={employeeInputs.pincode}
                        disabled={isEditing}
                        className={`w-full bg-white ${
                          isEditing && "opacity-50 cursor-not-allowed"
                        } rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none font-poppins`}
                      /> */}

                        <Select
                          name="pincode_id"
                          options={
                            pincodePagination?.map((pincode) => ({
                              value: pincode.id,
                              label: pincode.pincode,
                            })) || []
                          }
                          value={
                            pincodePagination
                              ?.map((pincode) => ({
                                value: pincode.id,
                                label: pincode.pincode,
                              }))
                              .find(
                                (option) =>
                                  option.value === employeeInputs?.pincode_id
                              ) || null
                          }
                          onChange={(selectedOption) => {
                            handleChangeForEmployees({
                              target: {
                                name: "pincode_id",
                                value: selectedOption?.value || null,
                              },
                            });
                          }}
                          className="w-full mt-1"
                          classNamePrefix="select"
                          placeholder="Select Pincode"
                          isDisabled={isEditing}
                        />

                        {requiredFields.pincode_id && (
                          <p className="text-red-500 text-sm mt-1">
                            {requiredFields.pincode_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-x-4 p-5">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setOpenDialogForEmployee(false)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    )}

                    {saveBtnForEmployee === "save" ? (
                      // <button
                      //   onClick={handleSubmitForEmployees}
                      //   className="inline-flex items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      // >
                      //   Save
                      // </button>
                      <SaveButton saveFunction={handleSubmitForEmployees} />
                    ) : (
                      !isEditing && (
                        <button
                          onClick={handleUpdateForEmployees}
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

export default EmployeeDialogBox;
