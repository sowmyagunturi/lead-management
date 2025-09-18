import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateLead.css";

const AddLeadForm = ({ onLeadAdded }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "",
    status: "new",
    score: "",
    lead_value: "",
    is_qualified: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(updatedData);
    console.log("Updated formData:", updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.email) {
      alert("First Name and Email are required");
      return;
    }

    try {
      console.log("Submitting formData:", formData);

      const bodyData = {
        ...formData,
        score: formData.score ? Number(formData.score) : 0,
        lead_value: formData.lead_value ? Number(formData.lead_value) : 0,
      };

      const response = await fetch("http://localhost:8080/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server error:", data);
        throw new Error(data.message || "Failed to add lead");
      }

      console.log("Lead added successfully:", data);

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        city: "",
        state: "",
        source: "",
        status: "new",
        score: "",
        lead_value: "",
        is_qualified: false,
      });

      if (onLeadAdded) onLeadAdded(data.data);

      navigate("/home");
    } catch (err) {
      console.error("Error adding lead:", err);
      alert(`Error adding lead: ${err.message}`);
    }
  };

  return (
    <div className="create-lead-page">
      <form onSubmit={handleSubmit} className="create-lead-form">
        <h2 className="form-title">Add Lead</h2>

        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
          />
        </div>

        <div className="form-group">
  <label htmlFor="source">Source</label>
  <select
    id="source"
    name="source"
    value={formData.source}
    onChange={handleChange}
  >
    <option value="">Select Source</option>
    <option value="website">Website</option>
    <option value="facebook_ads">Facebook Ads</option>
    <option value="google_ads">Google Ads</option>
    <option value="referral">Referral</option>
    <option value="events">Events</option>
    <option value="other">Other</option>
  </select>
</div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
            <option value="won">Won</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="score">Score</label>
          <input
            id="score"
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
            placeholder="Score"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lead_value">Lead Value</label>
          <input
            id="lead_value"
            type="number"
            name="lead_value"
            value={formData.lead_value}
            onChange={handleChange}
            placeholder="Lead Value"
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="is_qualified"
            name="is_qualified"
            checked={formData.is_qualified}
            onChange={handleChange}
          />
          <label htmlFor="is_qualified">Qualified</label>
        </div>

        <button type="submit" className="submit-btn">
          Add Lead
        </button>
      </form>
    </div>
  );
};

export default AddLeadForm;
