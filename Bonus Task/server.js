const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/eventsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const eventSchema = new mongoose.Schema({
    eventName: String,
    organizerName: String,
    date: String,
    latitude: Number,
    longitude: Number,
});
const Event = mongoose.model("Event", eventSchema);

app.post("/api/events", async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.json({ success: true, eventId: event._id });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
