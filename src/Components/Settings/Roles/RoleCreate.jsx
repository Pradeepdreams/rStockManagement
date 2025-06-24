import React, { useEffect, useState } from "react";

import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../Utils/AxiosInstance";
import Loader from "../../Utils/Loader";
import RoleDilaog from "./RoleDilaog";
import HeadersAndAddButton from "../../Utils/HeadersAndAddButton";
import { useDialogForRole } from "../../Context/RoledialogContext";
import RoleList from "./RoleList";

function RoleCreate() {
  const { collapsed } = useOutletContext();
 

  const [rolePagination, setRolePagination] = useState([]);
  const [roleListPagination, setRoleListPagination] = useState([]);
  const [branchId, setBranchId] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState({});
  

  const { openDialogForRole, setOpenDialogForRole, setRolesInput , setSaveBtnForRole } = useDialogForRole();

  const fetchRole = async (page=1) => {
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const response = await axios.get(`public/api/permissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        "X-Branch-Id": branchIds[0],
      });


      setRolePagination(response.data);

      const responseForRolesList = await axios.get(`public/api/roles?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        "X-Branch-Id": branchIds[0],
      });


      setRoleListPagination(responseForRolesList.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRole(currentPage);
  }, []);



  useEffect(() => {
    fetchRole(currentPage);
  }, [currentPage]);

  const handleAddForRole = () => {
    setOpenDialogForRole(true);
    setSaveBtnForRole("save");
    setRolesInput({
      name: "",
      permissions: [],
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Roles"
        description="A list of all roles"
        buttonName="Add Role"
        setOpenDialogForRole={setOpenDialogForRole}
        handleDialogOpen={handleAddForRole}
      />

      <RoleList
        rolePagination={rolePagination}
        setLoading={setLoading}
        fetchRole={fetchRole}
        roleListPagination={roleListPagination}
        setSelectedPermissions={setSelectedPermissions}
        selectedPermissions={selectedPermissions}
        setCurrentPage={setCurrentPage}

      />

      {openDialogForRole && (
        <RoleDilaog
          openDialogForRole={openDialogForRole}
          setOpenDialogForRole={setOpenDialogForRole}
          fetchRole={fetchRole}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          setRolePagination={setRolePagination}
          rolePagination={rolePagination}
          roleListPagination={roleListPagination}
          setSelectedPermissions={setSelectedPermissions}
          selectedPermissions={selectedPermissions}
          setCurrentPage={setCurrentPage}
          setRolesInput={setRolesInput}
        />
      )}
    </>
  );
}

export default RoleCreate;
