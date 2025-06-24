import axios from "../../Utils/AxiosInstance";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import DeleteConfirmation from "../../Utils/DeleteConfirmation";

import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import { useDialogForRole } from "../../Context/RoledialogContext";

function RoleList({
  setLoading,
  fetchRoles,
  branchId,
  loading,
  setCurrentPage,
  roleListPagination,
  setSelectedPermissions,
  fetchRole,
}) {
  const {setRolesInput } = useDialogForRole();

  const {
    setOpenDialogForRole,
    setSaveBtnForRole,
    setEditIdForRole,
  } = useDialogForRole();



  const handleViewForRole = async (e, id_crypt) => {
    setOpenDialogForRole(true);
    setEditIdForRole(id_crypt);
    setLoading(true);
    setSaveBtnForRole("update");

    const token = localStorage.getItem("token");

    try {
      const responseForRoleEditData = await axios.get(
        `public/api/roles/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchId,
          },
        }
      );

      const roleViewData = responseForRoleEditData.data;
      console.log(roleViewData, "roleViewData");

      const roleNames = roleViewData.map((item) => item.name);
      const allPermissions = roleViewData.flatMap((item) =>
        item.permissions.map((perm) => perm.id)
      );
      const selectedPermissionsObj = {};
      roleViewData.forEach((role) => {
        role.permissions.forEach((perm) => {
          if (!selectedPermissionsObj["general"]) {
            selectedPermissionsObj["general"] = [];
          }
          selectedPermissionsObj["general"].push(perm.id);
        });
      });

      setRolesInput({
        name: roleNames.join(", "),
        permissions: allPermissions,
      });

      setSelectedPermissions(selectedPermissionsObj);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };


  const headers = ["S.No", "Role Name", "Actions"];


  const renderRow = (role, index) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        {roleListPagination.from + index}
      </td>
      <td className="px-6 py-4">{role.name}</td>

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
            onClick={(e) => handleViewForRole(e, role.id_crypt)}
          >
            View
          </button>

          <DeleteConfirmation
            apiType="roles"
            id_crypt={role.id_crypt}
            fetchDatas={fetchRole}
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
        data={roleListPagination?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={roleListPagination}
        // onPageChange={(page) => setCurrentPage(page)}
        onPageChange={(page) => {
          setCurrentPage(page);
          fetchRole(page);
        }}
      />
    </>
  );
}

export default RoleList;
