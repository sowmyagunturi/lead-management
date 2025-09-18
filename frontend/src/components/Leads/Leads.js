import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

const Leads = () => {

  const [rowData, setRowData] = useState([]);
  console.log(rowData);
  // Delete a lead
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      const response = await fetch(`https://lead-management-bend.onrender.com/leads/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete lead");

      // Remove the lead from rowData
      setRowData(prevData => prevData.filter(row => row._id !== id));
      alert("Lead deleted successfully");
    } catch (error) {
      console.error("Error deleting lead:", error.message);
      alert("Error deleting lead");
    }
  };

const onCellValueChanged = async (params) => {
  const updatedData = params.data;
  console.log("Updated row:", updatedData);

  try {
    const response = await fetch(`https://lead-management-bend.onrender.com/leads/${updatedData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });

    // ✅ Check if not OK and print full error response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update lead: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("Update success:", result);

    alert("Lead updated successfully");
  } catch (error) {
    console.error("Error updating lead:", error); // full error, not just .message
    alert("Error updating lead: " + error.message);
  }
};



  // Column definitions including Actions column
  const columnDefs = [
    { headerName: "First Name", field: "first_name", sortable: true, filter: true,editable: true },
    { headerName: "Last Name", field: "last_name", sortable: true, filter: true,editable: true },
    { headerName: "Email", field: "email", sortable: true, filter: true,editable: true },
    { headerName: "Phone", field: "phone", sortable: true, filter: true,editable: true },
    { headerName: "Company", field: "company", sortable: true, filter: true,editable: true },
    { headerName: "City", field: "city", sortable: true, filter: true,editable: true },
    { headerName: "State", field: "state", sortable: true, filter: true,editable: true },
    { headerName: "Source", field: "source", sortable: true, filter: true ,editable: true},
    { headerName: "Status", field: "status", sortable: true, filter: true ,editable: true},
    { headerName: "Score", field: "score", sortable: true, filter: true,editable: true },
    { headerName: "Lead Value", field: "lead_value", sortable: true, filter: true,editable: true },
{
  headerName: "Last Activity",
  field: "last_activity_at",
  sortable: true,
  filter: true,
  editable: true,
  cellEditor: "agDateCellEditor",
  valueFormatter: params => {
    if (!params.value) return "";
    const date = new Date(params.value);
    return isNaN(date) ? "" : date.toLocaleDateString();
  },
  valueParser: params => {
    const date = new Date(params.newValue);
    return isNaN(date) ? null : date;
  }
}


,
    {
      headerName: "Qualified",
      field: "is_qualified",
      sortable: true,
      filter: true,
      valueFormatter: params => params.value ? "Yes" : "No",
      editable: true
    },
    { headerName: "Created At", field: "createdAt", sortable: true, filter: true,editable: true },
    { headerName: "Updated At", field: "updatedAt", sortable: true, filter: true,editable: true },
    {
  headerName: "Actions",
  field: "actions",
  cellRenderer: (params) => {
    return (
      <button
        style={{ color: "red", cursor: "pointer" }}
        onClick={() => handleDelete(params.data._id)}
      >
        Delete
      </button>
    );
  },
  width: 100,
}
,
  ];

  // Fetch leads from backend
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("http://localhost:8080/leads/", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch leads");

        const result = await response.json();
        console.log("Fetched leads:", result.data);
        setRowData(result.data);
      } catch (error) {
        console.error("Error fetching leads:", error.message);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  );
};

export default Leads;
