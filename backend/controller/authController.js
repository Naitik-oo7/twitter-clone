export const signup = async (req, res) => {
  res.status(201).json({
    message: "Signup successfull",
  });
};
export const login = async (req, res) => {
  res.status(201).json({
    message: "Login successfull",
  });
};

export const logout = async (req, res) => {
  res.status(200).json({ message: "Logout successfull" });
};
