import React, { useEffect, useState } from 'react'
import { useDialogForCustomer } from '../Context/CustomerDilaogContext';
import { useToast } from '../Context/ToastProvider';
import { getBranchDataFromBalaSilksDB } from '../Utils/indexDB';
import axios from '../Utils/AxiosInstance';
import { useSearch } from '../Context/SearchContext';
import CustomersDialogBox from './CustomersDialogBox';
import CustomersList from './CustomersList';
import HeadersAndAddButton from '../Utils/HeadersAndAddButton';
import Loader from '../Utils/Loader';

function CustomersCreate() {
    const {
        openDialogForCustomer,
        setOpenDialogForCustomer,
        customerPaginationData,
        setCustomerPaginationData,
        saveBtnForCustomer,
        setSaveBtnForCustomer,
        editIdForCustomer,
        setEditIdForCustomer,
        customerInputs,
        setCustomerInputs,
      } = useDialogForCustomer();
 
       const {triggerToast} = useToast();
      
        const {searchTerm} = useSearch();
        const [loading, setLoading] = useState(false);
        const [currentPage, setCurrentPage] = useState(1);
        const [isEditing, setIsEditing] = useState(false);
       

  const fetchCustomersData = async (page = 1) => {
    setLoading(true);
    const branchData = await getBranchDataFromBalaSilksDB();
    const branchIds = branchData.map((branch) => branch.branch.id_crypt);

    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page,
    });

    try {

      const response = await axios.get(`public/api/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Branch-Id": branchIds[0],
        },
      });
      console.log(response, "customers");
      
      setCustomerPaginationData(response.data.customers);
    } catch (error) {
        console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersData(currentPage);
  }, [currentPage]);

   const searchCustomerFetch=async(searchTerm)=>{
     const branchData = await getBranchDataFromBalaSilksDB();
      const branchIds = branchData.map((branch) => branch.branch.id_crypt);
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: 1,
        search: searchTerm,
      })
      try {
        const responseForCustomers = await axios.get(
          `public/api/customers?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Branch-Id": branchIds[0],
            },
          }
        );
        console.log(responseForCustomers.data, "customer");
        
        setCustomerPaginationData(responseForCustomers.data.customers);

      } catch (error) {
       console.log(error);
       
      }
    }
  
    useEffect(() => {
      searchCustomerFetch(searchTerm);
    }, [searchTerm]);


  const handleAddForCustomers = () => {
    console.log("Add Employee");

    setOpenDialogForCustomer(true);
    setSaveBtnForCustomer("save");
    setEditIdForCustomer("");
    setIsEditing(false);
    setCustomerInputs({
      name:"",
        customer_type:"",
        email:"",
        phone:"",
        address_line1:"",
        address_line2:"",
        city:"",
        state:"",
        country:"",
        pincode:"",
        gst_number:"",
        gst_type:"",
        pan_number:"",
        credit_limit:"",
        customer_group:"",
    });
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <HeadersAndAddButton
        title="Customers"
        description="A list of all Customers"
        buttonName="Add Customer"
        setOpenDialogForCustomer={setOpenDialogForCustomer}
        handleDialogOpen={handleAddForCustomers}

      />

      <CustomersList
        customerPaginationData={customerPaginationData}
        setOpenDialogForCustomer={setOpenDialogForCustomer}
        setSaveBtnForCustomer={setSaveBtnForCustomer}
        setCustomerInputs={setCustomerInputs}
        fetchCustomersData={fetchCustomersData}
        setEditIdForCustomer={setEditIdForCustomer}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        loading={loading}
        setIsEditing={setIsEditing}
      />

      {openDialogForCustomer && (
        <CustomersDialogBox
          openDialogForCustomer={openDialogForCustomer}
          setOpenDialogForCustomer={setOpenDialogForCustomer}
          customerInputs={customerInputs}
          setCustomerInputs={setCustomerInputs}
          saveBtnForCustomer={saveBtnForCustomer}
          setSaveBtnForCustomer={setSaveBtnForCustomer}
          fetchCustomersData={fetchCustomersData}
          setEditIdForCustomer={setEditIdForCustomer}
          editIdForCustomer={editIdForCustomer}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        
        />
      )}

   
    </>
  );
}

export default CustomersCreate