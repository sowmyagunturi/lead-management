import Lead from "../Models/Lead.js";

// @desc    Create new lead
// @route   POST /leads
// @access  Private

export const createLead = async (req, res) => {
  try {
    // Destructure fields from request body
    const {
      first_name,
      last_name,
      email,
      phone,
      company,
      city,
      state,
      source,
      status,
      score,
      lead_value,
      last_activity_at,
      is_qualified,
    } = req.body;

    // Create new lead with logged-in user's ID
    const lead = new Lead({
      user: req.user.id,   // coming from auth middleware
      first_name,
      last_name,
      email,
      phone,
      company,
      city,
      state,
      source,
      status,
      score,
      lead_value,
      last_activity_at,
      is_qualified,
    });

    // Save to DB
    await lead.save();

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all leads (with pagination + filters)
// @route   GET /leads
// @access  Private
/*
export const getLeads = async (req, res) => {
  try {
    let { page = 1, limit , ...filters } = req.query;
    page = parseInt(page);
    limit = Math.min(parseInt(limit), 100);

    const query = {};

    // Always restrict leads to logged-in user
    query.user = req.user.id;   // <-- comes from JWT middleware

    // String filters
    if (filters.email) query.email = { $regex: filters.email, $options: "i" };
    if (filters.company) query.company = { $regex: filters.company, $options: "i" };
    if (filters.city) query.city = { $regex: filters.city, $options: "i" };

    // Enums
    if (filters.status) query.status = filters.status;
    if (filters.source) query.source = { $in: filters.source.split(",") };

    // Boolean
    if (filters.is_qualified) query.is_qualified = filters.is_qualified === "true";

    // Numbers
    if (filters.score_gt) query.score = { ...query.score, $gt: Number(filters.score_gt) };
    if (filters.score_lt) query.score = { ...query.score, $lt: Number(filters.score_lt) };
    if (filters.lead_value_between) {
      const [min, max] = filters.lead_value_between.split(",").map(Number);
      query.lead_value = { $gte: min, $lte: max };
    }

    // Dates
    if (filters.created_after) query.createdAt = { ...query.createdAt, $gte: new Date(filters.created_after) };
    if (filters.created_before) query.createdAt = { ...query.createdAt, $lte: new Date(filters.created_before) };

    // Count & fetch
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: leads,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
*/



export const getLeads = async (req, res) => {
  try {
    // Fetch all leads for the logged-in user
    const leads = await Lead.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Convert last_activity_at to proper Date objects
    const processedLeads = leads.map(lead => ({
      ...lead.toObject(),
      last_activity_at: lead.last_activity_at ? new Date(lead.last_activity_at) : null
    }));

    res.json({
      data: processedLeads
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get single lead by ID
// @route   GET /leads/:id
// @access  Private
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update lead
// @route   PUT /leads/:id
// @access  Private
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /leads/:id
// @access  Private
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
