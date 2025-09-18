// Middleware/validateLead.js
export const validateLead = (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    source,
    status,
    score
  } = req.body;
  
  // Required fields
  if (!first_name || !last_name || !email || !phone || !source) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: first_name, last_name, email, phone, source"
    });
  }

  // Email validation
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format"
    });
  }

  // Phone validation (basic)
  const phoneRegex = /^\+?\d{7,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Invalid phone number"
    });
  }

  // Source enum validation
  const allowedSources = ["website", "facebook_ads", "google_ads", "referral", "events", "other"];
  if (!allowedSources.includes(source)) {
    return res.status(400).json({
      success: false,
      message: `Invalid source. Allowed values: ${allowedSources.join(", ")}`
    });
  }

  // Status enum validation (optional)
  const allowedStatus = ["new", "contacted", "qualified", "lost", "won"];
  if (status && !allowedStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed values: ${allowedStatus.join(", ")}`
    });
  }

  // Score validation (optional)
  if (score && (score < 0 || score > 100)) {
    return res.status(400).json({
      success: false,
      message: "Score must be between 0 and 100"
    });
  }
  
  // If all validations pass, proceed
  next();
};
