import axios from "../../Utils/AxiosInstance";
import React from "react";
import { toast } from "react-toastify";
import DeleteConfirmation from "../../Utils/DeleteConfirmation";
import Pagination from "../../Utils/Pagination";
import Table from "../../Utils/Table";
import ViewButton from "../../Utils/ViewButton";
import {
  FaHashtag,
  FaPercent,
  FaCalendarAlt,
  FaRupeeSign,
  FaFileAlt,
} from "react-icons/fa";

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
  {/* Index with Badge */}
  <td className="px-6 py-4 whitespace-nowrap text-left">
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
      <FaHashtag className="text-gray-500" />
      {sectionPagination?.from + index}
    </span>
  </td>

  {/* Name */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
      <FaFileAlt className="text-blue-600" />
      {section.name || "N/A"}
    </span>
  </td>

  {/* Percent With PAN */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
      <FaPercent className="text-green-600" />
      {section.percent_with_pan ?? "N/A"} 
    </span>
  </td>

  {/* Percent Without PAN */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 border border-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
      <FaPercent className="text-red-600" />
      {section.percent_without_pan ?? "N/A"}
    </span>
  </td>

  {/* Applicable Date */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium">
      <FaCalendarAlt className="text-yellow-600" />
      {section.applicable_date || "N/A"}
    </span>
  </td>

  {/* Amount Limit */}
  <td className="px-6 py-4 text-left">
    <span className="inline-flex items-center gap-1  px-2 py-1 rounded text-sm font-medium">
      <FaRupeeSign className="text-purple-600" />
      {section.amount_limit ?? "N/A"}
    </span>
  </td>

  {/* Actions */}
  <td className="px-6 py-4 text-center">
    <div className="flex gap-2">
      <ViewButton onView={handleViewForsection} item={section} />

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
