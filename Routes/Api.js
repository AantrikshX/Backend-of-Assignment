const express = require("express")
const router = express.Router()
const upload = require("../config/multer-config")
const eventModel = require("../models/eventModel")

router.post("/events",upload.single("image"),async(req,res)=>{
    
    try{
        let {title , description , location , date , maxParticipants, currentParticipants } = req.body
        const event = await eventModel.create({
        image : req.file.buffer,
        imageType: req.file?.mimetype,
        title,
        description,
        location,
        date,
        maxParticipants,
        currentParticipants
      
    })
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });
    }
    catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message
    });
  }   
})
router.get("/events", async (req, res) => {
  try {
    const events = await eventModel.find();
    const updatedEvents = events.map(event => ({
      ...event._doc,
      image: event.image && event.imageType
        ? `data:${event.imageType};base64,${event.image.toString('base64')}`
        : null,
    }));

    res.send(updatedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send({ message: "Error fetching events", error });
  }
});



router.get("/events/:id", async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const updatedEvent = {
      ...event._doc,
      image: event.image
        ? `data:${event.imageType || 'image/jpeg'};base64,${event.image.toString('base64')}`
        : null,
    };

    res.json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
});



module.exports = router