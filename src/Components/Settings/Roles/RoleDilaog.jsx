import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import axios from "../../Utils/AxiosInstance";
import { useDialogForRole } from "../../Context/RoledialogContext";

const RoleDialog = ({
  openDialogForRole,
  setOpenDialogForRole,
  rolePagination,
  setSelectedPermissions,
  selectedPermissions,
  fetchRole,
  setRolesInput,
}) => {
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const { collapsed } = useOutletContext();

  const { rolesInput, saveBtnForRole, setEditIdForRole, editIdForRole } =
    useDialogForRole();
  const [selectAllCategories, setSelectAllCategories] = useState({});

  // const handleRoleChange = (e) => {
  //   const { name, value } = e.target;
  //   setRolesInput({
  //     ...rolesInput,
  //     [name]: value,
  //   });
  // };
  // Handle checkbox change
  const handleCheckboxChange = (category, permissionValue, isChecked) => {
    setRolesInput((prevState) => {
      const currentPermissions = prevState.permissions || [];

      if (!isChecked && currentPermissions.includes(permissionValue)) {
        return {
          ...prevState,
          permissions: currentPermissions.filter(
            (val) => val !== permissionValue
          ),
        };
      }

      if (isChecked && !currentPermissions.includes(permissionValue)) {
        return {
          ...prevState,
          permissions: [...currentPermissions, permissionValue],
        };
      }

      return prevState;
    });

    setSelectedPermissions((prevState) => {
      const currentPermissions = prevState[category] || [];

      if (!isChecked && currentPermissions.includes(permissionValue)) {
        return {
          ...prevState,
          [category]: currentPermissions.filter(
            (val) => val !== permissionValue
          ),
        };
      }

      if (isChecked && !currentPermissions.includes(permissionValue)) {
        return {
          ...prevState,
          [category]: [...currentPermissions, permissionValue],
        };
      }

      return prevState;
    });
  };

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "selectAll") {
      const allPermissions = Object.values(rolePagination)
        .flat()
        .map((permission) => permission.id);

      if (checked) {
        setRolesInput((prevState) => ({
          ...prevState,
          permissions: allPermissions,
        }));

        const updatedSelectedPermissions = {};
        Object.keys(rolePagination).forEach((category) => {
          updatedSelectedPermissions[category] = rolePagination[category].map(
            (permission) => permission.id
          );
        });

        setSelectedPermissions(updatedSelectedPermissions);
      } else {
        setRolesInput((prevState) => ({
          ...prevState,
          permissions: [],
        }));

        setSelectedPermissions({});
      }
    } else {
      setRolesInput({
        ...rolesInput,
        [name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");

    const payload = {
      role_name: rolesInput.name,
      permission_ids: rolesInput.permissions,
    };

    console.log(payload, "payload");

    try {
      const response = await axios.post("public/api/roles", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });

      await fetchRole();
      console.log(response, "role res");
      setOpenDialogForRole(false);
    } catch (error) {
      console.log(error);
    }

    console.log("Form submitted with payload:", payload);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    const token = localStorage.getItem("token");
    const payload = {
      role_name: rolesInput.name,
      permission_ids: rolesInput.permissions,
    };

    try {
      const response = await axios.put(
        `public/api/roles/${editIdForRole}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      console.log(response, "role res");
      await fetchRole();
      setOpenDialogForRole(false);
      await fetchRole();
    } catch (error) {
      console.log(error);
    }

    console.log("Form submitted with payload:", payload);
  };

  const handleRoleDialogClose = () => {
    setRolesInput({
      name: "",
      permissions: [],
    });
    setOpenDialogForRole(false);
  };

  const handleCategorySelectAll = (category, isChecked) => {
    const permissions = rolePagination[category].map((p) => p.id);

    setRolesInput((prevState) => {
      const currentPermissions = new Set(prevState.permissions);

      if (isChecked) {
        permissions.forEach((perm) => currentPermissions.add(perm));
      } else {
        permissions.forEach((perm) => currentPermissions.delete(perm));
      }

      return {
        ...prevState,
        permissions: Array.from(currentPermissions),
      };
    });

    setSelectAllCategories((prevState) => ({
      ...prevState,
      [category]: isChecked,
    }));
  };

  return (
    <>
      {openDialogForRole && (
        <Dialog
          open={openDialogForRole}
          onClose={() => setOpenDialogForRole(false)}
          className="relative z-50"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

          <div
            className={`fixed inset-0 overflow-y-auto transition-all duration-400 ${
              collapsed ? "lg:ml-20" : "lg:ml-72"
            }`}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-10">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-100 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-0">
                <div className="bg-[#134b90] text-white p-4 flex items-center justify-between">
                  <h2
                    style={{ fontFamily: "poppins" }}
                    className="font-semibold"
                  >
                    Roles and Permissions
                  </h2>
                  <div
                    onClick={handleRoleDialogClose}
                    className="bg-red-100 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="p-6 bg-gray-50 space-y-6">
                    <div className="overflow-x-auto">
                      <div className="px-4 sm:px-6 lg:px-8">
                        <div className="mt-8 flow-root">
                          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-6">
                            <div className="p-4 sm:p-6 lg:p-8">
                              <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Role Name{" "}
                                  <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  value={rolesInput.name}
                                  onChange={handleRoleChange}
                                  placeholder="Enter Role"
                                  className="mt-1 w-full bg-white rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                />
                              </div>

                              <div className="mb-6 flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  name="selectAll"
                                  checked={
                                    rolesInput.permissions.length ===
                                    Object.values(rolePagination).flat().length
                                  }
                                  onChange={handleRoleChange}
                                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                  Select All
                                  <span className="text-red-400 ml-1">*</span>
                                </label>
                              </div>

                              <div className="overflow-x-auto rounded-md">
                                <table className="min-w-full divide-y divide-gray-300">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                                        Category
                                      </th>
                                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                                        Permissions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {Object.keys(rolePagination).map(
                                      (category) => {
                                        const allPermissions = rolePagination[
                                          category
                                        ].map((p) => p.id);
                                        const isAllSelected =
                                          allPermissions.every((perm) =>
                                            rolesInput.permissions.includes(
                                              perm
                                            )
                                          );

                                        return (
                                          <tr
                                            key={category}
                                            className="border-b"
                                          >
                                            <td className="py-4 px-4 text-sm font-medium text-gray-900">
                                              {category
                                                .charAt(0)
                                                .toUpperCase() +
                                                category.slice(1)}
                                            </td>
                                            <td className="py-4 px-4">
                                              <div className="mb-2 flex items-center space-x-2">
                                                <input
                                                  type="checkbox"
                                                  name={`selectAll_${category}`}
                                                  checked={isAllSelected}
                                                  onChange={(e) =>
                                                    handleCategorySelectAll(
                                                      category,
                                                      e.target.checked
                                                    )
                                                  }
                                                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <label className="text-sm font-medium text-gray-700">
                                                  Select All
                                                </label>
                                              </div>

                                              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-2">
                                                {rolePagination[category].map(
                                                  (permission) => (
                                                    <div
                                                      key={permission.id_crypt}
                                                      className="flex items-center"
                                                    >
                                                      <input
                                                        type="checkbox"
                                                        id={permission.id}
                                                        checked={rolesInput.permissions.includes(
                                                          permission.id
                                                        )}
                                                        onChange={(e) =>
                                                          handleCheckboxChange(
                                                            category,
                                                            permission.id,
                                                            e.target.checked
                                                          )
                                                        }
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                                                      />
                                                      <label
                                                        htmlFor={
                                                          permission.id_crypt
                                                        }
                                                        className="cursor-pointer"
                                                      >
                                                        {permission.name
                                                          .split("_")[0]
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                          permission.name
                                                            .split("_")[0]
                                                            .slice(1)}
                                                      </label>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setOpenDialogForRole(false)}
                        className="text-sm cursor-pointer font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      {saveBtnForRole === "save" ? (
                        <button
                          type="submit"
                          className="inline-flex cursor-pointer items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          type="submit"
                          onClick={handleUpdate}
                          className="inline-flex cursor-pointer items-center rounded-md bg-[#134b90] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default RoleDialog;
