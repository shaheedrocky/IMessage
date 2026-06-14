export const checkAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error from check auth controlller: ", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
