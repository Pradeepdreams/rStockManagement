import axios from "../../Utils/AxiosInstance";
import React from "react";
import { toast } from "react-toastify";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";

function SectionList({
    sectionPagination,
    setOpen,
    branchId,
    setSaveBtn,
    setSectionInputs,
    fetchSection,
    setIdCryptForSection,
    setCurrentPage,
    setLoading,
    loading,
    setIsEditing,
    setRequiredFields
}) {


    const handleViewForsection = async (e, id_crypt) => {
      
        e.preventDefault();
        setLoading(true);
        setIsEditing(true);
        setOpen(true);
        setIdCryptForSection(id_crypt);
        setSaveBtn("update");
        // setRequiredFields({
        //     name: "",
        //     percent_with_pan: "",
        //     percent_without_pan: "",
        //     applicable_date: "",
        //     amount_limit: "",
        // })

        const token = localStorage.getItem("token");
        try {
            const responseForSectionEditData = await axios.get(
                `public/api/tds-sections/${id_crypt}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Branch-Id": branchId,
                    },
                }
            );
       
            const section = responseForSectionEditData.data;
            setSectionInputs({
                name: section.name,
                percent_with_pan: section.percent_with_pan,
                percent_without_pan: section.percent_without_pan,
                applicable_date: section.applicable_date,
                amount_limit: section.amount_limit,

            });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }

        setOpen(true);
    };

    const headers = [
        "S.No",
        "Name",
        "Percent With Pan",
        "Percent Without Pan",
        "Applicable Date",
        "Amount Limit",
        "Actions"
    ];




    const renderRow = (section, index) => (
        <>
            <td className="px-6 py-4 whitespace-nowrap">
                {sectionPagination?.from + index}
            </td>
            <td className="px-6 py-4">{section.name}</td>
            <td className="px-6 py-4">{section.percent_with_pan}</td>
            <td className="px-6 py-4">{section.percent_without_pan}</td>
            <td className="px-6 py-4">{section.applicable_date}</td>
            <td className="px-6 py-4">{section.amount_limit}</td>


            <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                    <button
                        className="bg-indigo-500 hover:bg-indigo-500 text-white px-4 py-1 rounded-md text-xs shadow"
                        onClick={(e) =>
                            handleViewForsection(e, section.id_crypt)
                        }
                    >
                        View
                    </button>

                    <DeleteConfirmation
                        apiType="sections"
                        id_crypt={section.id_crypt}
                        fetchDatas={fetchSection}
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
                data={sectionPagination?.data || []}
                renderRow={renderRow}
            />
            <Pagination
                meta={sectionPagination}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </>
    );
}

export default SectionList;
