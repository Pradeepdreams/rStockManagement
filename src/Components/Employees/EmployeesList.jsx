import axios from "../Utils/AxiosInstance";
import React from "react";
import { getBranchDataFromBalaSilksDB } from "../Utils/indexDB";
import Table from "../Utils/Table";
import Pagination from "../Utils/Pagination";
import DeleteConfirmation from "../Utils/DeleteConfirmation";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBuilding,
  FaVenusMars,
  FaEnvelope,
  FaPhone,
  FaFemale 
} from "react-icons/fa";
import { FaHashtag, FaMars, FaVenus } from "react-icons/fa6";
import { IoMdMale } from "react-icons/io";
import ViewButton from "../Utils/ViewButton";

function EmployeesList({
  setOpenDialogForEmployee,
  setSaveBtnForEmployee,
  setEditIdForEmployee,
  setEmployeeInputs,
  setRequiredFields,
  employeePaginationData,
  setCurrentPage,
  fetchEmployeesData,
  loading,
  setLoading,
  setIsEditing,
}) {
  console.log(employeePaginationData, "list");

  const navigate = useNavigate();

  const handleEditForEmployee = async (e, id_crypt) => {
    e.preventDefault();
    setOpenDialogForEmployee(true);
    const token = localStorage.getItem("token");
    setSaveBtnForEmployee("update");
    setEditIdForEmployee(id_crypt);
    setIsEditing(true);

    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);
    try {
      const responseForEdit = await axios.get(
        `public/api/employees/${id_crypt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );

      const employeeEditData = responseForEdit.data;
      console.log(employeeEditData, "edit");

      setEmployeeInputs({
        first_name: employeeEditData.first_name,
        last_name: employeeEditData.last_name,
        gender: employeeEditData.gender,
        email: employeeEditData.email,
        phone: employeeEditData.phone,
        date_of_join: employeeEditData.date_of_join,
        qualification_id: employeeEditData.qualification_id,
        is_active: employeeEditData.is_active == true ? "1" : "0",
        salary: employeeEditData.salary,
        branch_id: employeeEditData?.user?.branch_data?.[0]?.branch_id, // Get the first branch_id
        roles:
          employeeEditData?.user?.branch_data?.[0]?.roles?.map(
            (role) => role.id
          ) || [], // Map the roles to get role ids
        address_line_1: employeeEditData.address_line_1,
        address_line_2: employeeEditData.address_line_2,
        country: employeeEditData.country,
        state: employeeEditData.state,
        city: employeeEditData.city,
        pincode_id: employeeEditData.pincode_id,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/crm/");
        return;
      }
    }
  };

  const headers = [
    "S.No",
    "Name",
    "Branch",
    "Gender",
    "Email",
    "Phone No",

    "Actions",
  ];

  const renderRow = (item, index) => (
    // <>
    //   <td className="px-6 py-4 whitespace-nowrap">
    //     {employeePaginationData.from + index}
    //   </td>
    //   <td className="px-6 py-4">
    //     {item.first_name
    //       ? `${item.first_name} ${item.last_name}`
    //       : "N/A"}
    //   </td>
    //   <td className="px-6 py-4">
    //     {item.user?.branch_data?.[0]?.branch_name || "N/A"}
    //   </td>
    //   <td className="px-6 py-4">{item.gender || "N/A"}</td>
    //   <td className="px-6 py-4">{item.email || "N/A"}</td>
    //   <td className="px-6 py-4">{item.phone || "N/A"}</td>

    //   <td className="px-6 py-4 ">
    //     <div className="flex items-center space-x-2">
    //       <button
    //         className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
    //         onClick={(e) => handleEditForEmployee(e, item.id_crypt)}
    //       >
    //         View
    //       </button>

    //       <DeleteConfirmation
    //         apiType="employee"
    //         id_crypt={item.id_crypt}
    //         fetchDatas={fetchEmployeesData}
    //         setLoading={setLoading}
    //         loading={loading}
    //       />
    //     </div>
    //   </td>
    // </>

    <>
      <td className="px-6 py-4 text-sm text-left text-left font-medium text-gray-700 whitespace-nowrap">
        
         <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                <FaHashtag className="text-gray-500" />
               {employeePaginationData.from + index}
              </span>
      </td>

      <td className="px-6 py-4 text-sm text-left text-gray-900 font-semibold flex items-center gap-2">
        <FaUser className="text-blue-600" />
        {item.first_name ? `${item.first_name} ${item.last_name}` : "N/A"}
      </td>

      <td className="px-6 py-4 text-sm text-left text-gray-700">
        {/* <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium"> */}
        {/* <FaBuilding /> */}
        {item.user?.branch_data?.[0]?.branch_name || "N/A"}
        {/* </span> */}
      </td>

      {/* <td className="px-6 py-4 text-sm text-left text-gray-700">
        <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
        <FaVenusMars />
        {item.gender? item.gender.charAt(0).toUpperCase() + item.gender.slice(1) : "N/A"}
        </span>
      </td> */}

<td className="px-6 py-4 text-sm text-left text-gray-700">
  <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
    {item.gender === 'female' && <FaVenus className="w-2 h-4"/>}
    {item.gender === 'Male' && <IoMdMale className="w-3 h-4" />}
    {item.gender
      ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1)
      : 'N/A'}
  </span>
</td>


      <td className="px-6 py-4 text-sm text-left text-gray-700">
        <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
          <FaEnvelope />
          {item.email || "N/A"}
        </span>
      </td>

      <td className="px-6 py-4 text-sm text-left text-gray-700">
        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          <FaPhone />
          {item.phone || "N/A"}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
        {
          /*
 <button
            className="bg-[var(--hd-bg)] hover:bg-white hover:text-[var(--hd-bg)] border border-[var(--hd-bg)] text-white px-3 py-1 rounded text-xs transition duration-200 font-semibold"
            onClick={(e) => handleEditForEmployee(e, item.id_crypt)}
          >
            View
          </button>
          */

        }
         
          <ViewButton onView={handleEditForEmployee} item={item} />


          <DeleteConfirmation
            apiType="employee"
            id_crypt={item.id_crypt}
            fetchDatas={fetchEmployeesData}
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
        data={employeePaginationData?.data || []}
        renderRow={renderRow}
      />
      <Pagination
        meta={employeePaginationData}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

export default EmployeesList;
