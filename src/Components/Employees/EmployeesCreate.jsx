import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDialogForEmployee } from "../Context/EmployeeDialogContext";
import { getBranchDataFromBalaSilksDB } from "../Utils/indexDB";
import axios from "../Utils/AxiosInstance";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Utils/Loader";
import HeadersAndAddButton from "../Utils/HeadersAndAddButton";
import EmployeeDialogBox from "./EmployeeDialogBox";
import EmployeesList from "./EmployeesList";
import { errorDialog } from "../Context/ErrorContext";
import { useDialogForQualification } from "../Context/QualificationContext";
import QualificationDialogBox from "../Masters/Qualification/QualificationDialogBox";
import { useToast } from "../Context/ToastProvider";
import { useSearch } from "../Context/SearchContext";
import { FaDownload, FaUserAlt, FaUsersCog  } from "react-icons/fa";

function EmployeesCreate() {
  const {
    openDialogForEmployee,
    setOpenDialogForEmployee,
    employeePaginationData,
    setEmployeePaginationData,
    saveBtnForEmployee,
    setSaveBtnForEmployee,
    editIdForEmployee,
    setEditIdForEmployee,
    employeeInputs,
    setEmployeeInputs,
  } = useDialogForEmployee();

  const {
    openDialogForQualification,
    setOpenDialogForQualification,
    saveBtnForQualification,
    setQualificationInputs,
    setSaveBtnForQualification,
    qualificationInputs,
  } = useDialogForQualification();

  const {searchTerm} = useSearch();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [pincodePagination, setPincodePagination] = useState([]);
  const [branchPagination, setBranchPagination] = useState([]);
  const [qualificationPagination, setQualificationPagination] = useState([]);
  const [rolePagination, setRolePagination] = useState([]);
  const { checkAuthError } = errorDialog();

  const {triggerToast} = useToast();

  const fetchEmployeesData = async (page = 1,searchTerm) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page,
      //   ...filters,
    });

    try {
      const responseForPincode = await axios.get(`public/api/pincodes/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      setPincodePagination(responseForPincode?.data);

      const responseForBranch = await axios.get(`public/api/branches/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
 

      setBranchPagination(responseForBranch?.data);

    await AfterFetchQualifications();

      const responseForRole = await axios.get(`public/api/roles/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
   

      setRolePagination(responseForRole?.data);

      const response = await axios.get(`public/api/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });


      setEmployeePaginationData(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch attribute values"
      );
      checkAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesData(currentPage);
  }, [currentPage]);

   const searchEmployeeFetch=async(searchTerm)=>{
     const branchData = await getBranchDataFromBalaSilksDB();
      const branchIds = branchData.map((branch) => branch.branch.id_crypt);
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: 1,
        search: searchTerm,
      })
      try {
        const responseForEmployees = await axios.get(
          `public/api/employees?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Branch-Id": branchIds[0],
            },
          }
        );
        console.log(responseForEmployees.data.data, "employee");
        
        setEmployeePaginationData(responseForEmployees.data.data);

      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch categories"
        );
      }
    }
  
    useEffect(() => {
      searchEmployeeFetch(searchTerm);
    }, [searchTerm]);

  const AfterFetchQualifications=async()=>{
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");
    try {
        const responseForQualification = await axios.get(
        `public/api/qualifications/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Branch-Id": branchIds[0],
          },
        }
      );
      console.log(responseForQualification?.data, "qualification");

      setQualificationPagination(responseForQualification?.data);
    } catch (error) {
      triggerToast("Create failed!", error.response?.data?.message, "error");
    }
  }

  const handleAddForEmployees = () => {
    console.log("Add Employee");

    setOpenDialogForEmployee(true);
    setSaveBtnForEmployee("save");
    setEditIdForEmployee("");
    setIsEditing(false);
    setEmployeeInputs({
      first_name: "",
      last_name: "",
      gender: "",
      email: "",
      mobile: "",
      date_of_join: "",
      qualification_id: "",
      is_active: "",
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
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Employees"
        description="A list of all employees"
        buttonName="Add Employee"
        setOpenDialogForEmployee={setOpenDialogForEmployee}
        handleDialogOpen={handleAddForEmployees}
        buttonIcon={<FaUsersCog  />}
        pdfDownload={<FaDownload />}
        // pdf={true}
        // pdfText={"Download Employees Report"}

      />

      <EmployeesList
        employeePaginationData={employeePaginationData}
        setOpenDialogForEmployee={setOpenDialogForEmployee}
        setSaveBtnForEmployee={setSaveBtnForEmployee}
        setEmployeeInputs={setEmployeeInputs}
        fetchEmployeesData={fetchEmployeesData}
        setEditIdForEmployee={setEditIdForEmployee}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
      />

      {openDialogForEmployee && (
        <EmployeeDialogBox
          openDialogForEmployee={openDialogForEmployee}
          setOpenDialogForEmployee={setOpenDialogForEmployee}
          employeeInputs={employeeInputs}
          setEmployeeInputs={setEmployeeInputs}
          saveBtnForEmployee={saveBtnForEmployee}
          setSaveBtnForEmployee={setSaveBtnForEmployee}
          fetchEmployeesData={fetchEmployeesData}
          setEditIdForEmployee={setEditIdForEmployee}
          editIdForEmployee={editIdForEmployee}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          pincodePagination={pincodePagination}
          branchPagination={branchPagination}
          qualificationPagination={qualificationPagination}
          rolePagination={rolePagination}
          setOpenDialogForQualification={setOpenDialogForQualification}
        />
      )}

      {openDialogForQualification && (
        <QualificationDialogBox
          openDialogForQualification={openDialogForQualification}
          setOpenDialogForQualification={setOpenDialogForQualification}
          fetchEmployeesData={fetchEmployeesData}
          saveBtnForQualification={saveBtnForQualification}
          setQualificationInputs={setQualificationInputs}
          qualificationInputs={qualificationInputs}
          employeeFlag={true}
          AfterFetchQualifications={AfterFetchQualifications}
        />
      )}
    </>
  );
}

export default EmployeesCreate;
