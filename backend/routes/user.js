const router = require("express").Router();

const {
  createUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getUsers,
  getUser,
  deleteUser,
  resendOTP,
} = require("../controllers/user");

const { isResetTokenValid } = require("../middlewares/tokenValidator");
const {
  validateUser,
  validate,
  validateNewPassword,
} = require("../middlewares/validator");

router.post("/create", validateUser, validate, createUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password",
  isResetTokenValid,
  validateNewPassword,
  validate,
  resetPassword
);
router.post("/change-password", validateNewPassword, validate, changePassword);
router.post("/get-users", getUsers);
router.post("/get-user", getUser);
router.post("/delete-user", deleteUser);

module.exports = router;
