module.exports.getAdminDashboard = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Welcome admin",
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
