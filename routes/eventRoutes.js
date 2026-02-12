const express = require("express");
const {
    createEvent,
    getEvents,
    registerForEvent,
    getMyEvents,
    getEventParticipants,
    updateEvent,
    deleteEvent,
    getEventById,
} = require("../controllers/eventController");


const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Event
// router.post("/", protect, authorize("admin", "coordinator"), createEvent);

// Get All Events (any logged-in user)
router.get("/", protect, getEvents);

// Register for Event (student only)
router.post("/:id/register", protect, authorize("student"), registerForEvent);

// Student Dashboard - My Registered Events
router.get(
    "/my-events",
    protect,
    authorize("student"),
    getMyEvents
);

// View Participants (Admin/Coordinator)
router.get(
    "/:id/participants",
    protect,
    authorize("admin", "coordinator"),
    getEventParticipants
);

// Update Event
router.put(
    "/:id",
    protect,
    authorize("admin", "coordinator"),
    updateEvent
);

// Delete Event
router.delete(
    "/:id",
    protect,
    authorize("admin", "coordinator"),
    deleteEvent
);

router.get("/:id", getEventById);

const upload = require("../config/upload");
router.post(
    "/",
    protect,
    authorize("admin", "coordinator"),
    upload.single("image"),
    createEvent
);

module.exports = router;

