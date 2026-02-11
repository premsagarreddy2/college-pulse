const Event = require("../models/Event");

// Create Event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, venue, durationHours } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            venue,
            durationHours,
            image: req.file ? `/uploads/${req.file.filename}` : null,
            createdBy: req.user._id
        });

        res.status(201).json(event);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get All Events
exports.getEvents = async (req, res) => {
    try {
        const { page = 1, limit = 5, search, date, status } = req.query;

        let query = {};

        // Search by title
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // Filter by date (future events)
        if (date) {
            query.date = { $gte: new Date(date) };
        }

        const events = await Event.find(query)
            .populate("createdBy", "name email")
            .sort({ date: 1 });

        const currentTime = new Date();

        // Calculate dynamic status
        let eventsWithStatus = events.map(event => {
            const startTime = new Date(event.date);
            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + event.durationHours);

            let calculatedStatus;

            if (currentTime < startTime) {
                calculatedStatus = "Upcoming";
            } else if (currentTime >= startTime && currentTime <= endTime) {
                calculatedStatus = "Ongoing";
            } else {
                calculatedStatus = "Completed";
            }

            return {
                ...event.toObject(),
                status: calculatedStatus
            };
        });

        // Apply status filtering if provided
        if (status) {
            eventsWithStatus = eventsWithStatus.filter(
                event => event.status === status
            );
        }

        //  Apply pagination AFTER filtering
        const total = eventsWithStatus.length;
        const startIndex = (page - 1) * limit;
        const paginatedEvents = eventsWithStatus.slice(
            startIndex,
            startIndex + parseInt(limit)
        );

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            events: paginatedEvents,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Register for Event (Student only)
exports.registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        // Prevent registration after event date
        const currentDate = new Date();
        if (event.date < currentDate) {
            return res.status(400).json({
                message: "Registration closed. Event date has passed."
            });
        }
        // Registration cutoff before X hours
        const REGISTRATION_CUTOFF_HOURS = 5;
        const cutoffTime = new Date(event.date);
        cutoffTime.setHours(cutoffTime.getHours() - REGISTRATION_CUTOFF_HOURS);

        if (currentDate >= cutoffTime) {
            return res.status(400).json({
                message: `Registration closed. Must register at least ${REGISTRATION_CUTOFF_HOURS} hours before event.`
            });
        }
        // Prevent duplicate registration
        if (event.registeredStudents.includes(req.user._id)) {
            return res.status(400).json({ message: "Already registered" });
        }

        event.registeredStudents.push(req.user._id);
        await event.save();

        res.json({ message: "Registered successfully 🎉" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get Events Registered by Student
exports.getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({
            registeredStudents: req.user._id,
        }).populate("createdBy", "name email role");

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// View Participants for an Event
exports.getEventParticipants = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("registeredStudents", "name email role")
            .populate("createdBy", "name email");

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({
            eventTitle: event.title,
            totalParticipants: event.registeredStudents.length,
            participants: event.registeredStudents,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update Event
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Only admin OR creator can update
        if (
            req.user.role !== "admin" &&
            event.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized to update this event" });
        }

        const { title, description, date, venue } = req.body;

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.venue = venue || event.venue;

        await event.save();

        res.json({ message: "Event updated successfully ✅", event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Delete Event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Only admin OR creator can delete
        if (
            req.user.role !== "admin" &&
            event.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized to delete this event" });
        }

        await event.deleteOne();

        res.json({ message: "Event deleted successfully 🗑️" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SINGLE EVENT
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("createdBy", "name email role")
            .populate("registeredStudents", "name email role");

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

