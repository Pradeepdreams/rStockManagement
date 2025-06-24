import axios from "../../Utils/AxiosInstance";
import React from "react";
import { toast } from "react-toastify";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import { getBranchDataFromBalaSilksDB } from "../../Utils/indexDB";
import { useToast } from "../../Context/ToastProvider";

function GroupList({
    groupPagination,
    setOpen,
    branchId,
    setSaveBtn,
    setGroupInputs,
    fetchGroup,
    setIdCryptForGroup,
    setCurrentPage,
    setLoading,
    loading,
    setIsEditing,
    setOpenDialogForGroup,
    setSaveBtnForGroup,
    setEditIdForGroup
}) {

    const {triggerToast} = useToast();
    const handleViewForGroup = async (e, id_crypt) => {
        e.preventDefault();
        setLoading(true);
        setIsEditing(true);
        setOpenDialogForGroup(true);
        setEditIdForGroup(id_crypt);
        setSaveBtnForGroup("update");

        const token = localStorage.getItem("token");
         const branchData = await getBranchDataFromBalaSilksDB();
            const branchIds = branchData.map((branch) => branch.branch.id_crypt);
        try {
            const response = await axios.get(
                `public/api/groups/${id_crypt}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Branch-Id": branchIds[0],
                    },
                }
            );

            const group = response.data.data;
            setGroupInputs({
                name: group.name,
                is_active: group.is_active ? "yes" : "no",
                description: group.description,
            });
           
            
        } catch (error) {
            triggerToast("Error!", error.response?.data?.message, "error");
            // toast.error(error?.response?.data?.message || "Error fetching group.");
        } finally {
            setLoading(false);
        }
    };

    const headers = ["S.No", "Group Name", "Active Status", "description", "Actions"];

    const renderRow = (group, index) => (
        <>
            <td className="px-6 py-4 whitespace-nowrap">
                {groupPagination.groups.from + index}
            </td>
            <td className="px-6 py-4">{group.name}</td>
            <td className="px-6 py-4">
                <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${group.is_active == "1"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {group.is_active === 1 ? "Active" : "Inactive"}
                </span>
            </td>
            <td className={`px-6 py-4`}>
                {group.description}
            </td>
            <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                    <button
                        className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
                        onClick={(e) => handleViewForGroup(e, group.id_crypt)}
                    >
                        View
                    </button>

                    {/* <DeleteConfirmation
                        apiType="group"
                        id_crypt={group.id_crypt}
                        fetchDatas={fetchGroup}
                        branchId={branchId}
                        setLoading={setLoading}
                        loading={loading}
                    /> */}
                </div>
            </td>
        </>
    );

    return (
        <>
            <Table
                headers={headers}
                data={groupPagination?.groups?.data || []}
                renderRow={renderRow}
            />
            <Pagination
                meta={groupPagination?.groups}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </>
    );
}

export default GroupList;
