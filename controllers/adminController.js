const { teams } = require("../models/collections");

// POST /admin/create-team
const createTeam = async (req, res) => {
    try {
        const { teamId, password } = req.body;
        if (!teamId || !password)
            return res.status(400).json({ error: "Team ID and password required" });

        const exists = await teams().findOne({ teamId });
        if (exists)
            return res.status(400).json({ error: "Team ID already exists" });

        await teams().insertOne({
            teamId,
            password,
            createdAt: new Date().toISOString(),
            attempts:  15,
            startTime: null,
            bestScore: null
        });

        res.json({ success: true, message: "Team created successfully" });
    } catch (err) {
        console.error("[adminController.createTeam]", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET /admin/teams
const getAllTeams = async (req, res) => {
    try {
        const allTeams = await teams().find({}, { projection: { _id: 0 } }).toArray();
        res.json(allTeams);
    } catch (err) {
        console.error("[adminController.getAllTeams]", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// DELETE /admin/delete-team/:teamId
const deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        await teams().deleteOne({ teamId });
        await leaderboard().deleteMany({ teamId });
        res.json({ success: true });
    } catch (err) {
        console.error("[adminController.deleteTeam]", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// POST /admin/reset-team/:teamId
const resetTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const result = await teams().updateOne(
            { teamId },
            { $set: { attempts: 15, startTime: null } }
        );
        if (result.matchedCount > 0) res.json({ success: true });
        else res.status(404).json({ success: false, error: "Team not found" });
    } catch (err) {
        console.error("[adminController.resetTeam]", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { createTeam, getAllTeams, deleteTeam, resetTeam };
