const express  = require("express");
const router   = express.Router();
const adminAuth = require("../middleware/auth");
const { createTeam, getAllTeams, deleteTeam, resetTeam } = require("../controllers/adminController");
const { getPublicLeaderboard } = require("../controllers/teamController");

router.post  ("/create-team",         adminAuth, createTeam);
router.get   ("/teams",               adminAuth, getAllTeams);
router.delete("/delete-team/:teamId", adminAuth, deleteTeam);
router.post  ("/reset-team/:teamId",  adminAuth, resetTeam);
router.get   ("/leaderboard",         adminAuth, getPublicLeaderboard);

module.exports = router;
