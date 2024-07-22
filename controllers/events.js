const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Events]
    const result = await mongodb.getDatabase().db().collection('events').find();
    result.toArray().then((events) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(events);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Events]
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid event id to find an event.');
    }
    const eventId = new ObjectId(req.params.id);
    mongodb.getDatabase().db().collection('events').find({ _id: eventId }).toArray().then((event) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(event[0]);
    });
};

const createEvent = async (req, res) => {
    //#swagger.tags=['Events]
    const event = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        created_by: req.body.created_by,
        created_at: new Date(),
        updated_at: new Date()
    };
    const response = await mongodb.getDatabase().db().collection('events').insertOne({event});
    if (response.acknowledged) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while creating the event.');
    }
}

const updateEvent = async (req, res) => {
    //#swagger.tags=['Events]
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid event id to update an event.');
    }
    const eventId = new ObjectId(req.params.id);
    const existingEvent = await mongodb.getDatabase().db().collection('events').findOne({ _id: eventId });
    const createdAt = existingEvent.created_at;
    const updatedEvent = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        created_by: req.body.created_by,
        created_at: createdAt,
        updated_at: new Date()
    };
    const response = await mongodb.getDatabase().db().collection('events').replaceOne({ _id: eventId }, updatedEvent);
    if (response.modifiedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while updating the event.');
    }
}

const deleteEvent = async (req, res) => {
    //#swagger.tags=['Events]
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid event id to delete an event.');
    }
    const eventId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('events').deleteOne({ _id: eventId });
    if (response.deletedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while deleting the event.');
    }
}

module.exports = {
    getAll,
    getSingle,
    createEvent,
    updateEvent,
    deleteEvent
};