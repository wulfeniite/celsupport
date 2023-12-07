const router = require("express").Router();

const {
  createComplaint,
  getComplaints,
  getComplaint,
  deleteComplaint,
  resolveComplaint,
  openComplaint,
  getAllComplaints,
} = require("../controllers/complaint");

router.post("/create-complaint", createComplaint);
router.post("/get-complaints", getComplaints);
router.post("/get-complaint", getComplaint);
router.post("/delete-complaint", deleteComplaint);
router.post("/resolve-complaint", resolveComplaint);
router.post("/open-complaint", openComplaint);
router.post("/get-all-complaints", getAllComplaints);

module.exports = router;
