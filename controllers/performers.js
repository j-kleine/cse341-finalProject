const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Performers']
    const result = await mongodb.getDatabase().db().collection('performers').find();
    result.toArray().then((performers) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(performers);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Performers']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid performer id to find a performer.');
    }
    const performerId = new ObjectId(req.params.id);
    mongodb.getDatabase().db().collection('performers').find({ _id: performerId }).toArray().then((performer) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(performer[0]);
    });
};

const createPerformer = async (req, res) => {
    //#swagger.tags=['Performers']
    const { first_name, last_name, event_id } = req.body;
    if (!ObjectId.isValid(event_id)) {
        res.status(400).json('Must use a valid event id to create a performer.');
    }
    const eventId = new ObjectId(event_id);
    const existingEvent = await mongodb.getDatabase().db().collection('events').findOne({ _id: eventId });
    if (!existingEvent) {
        return res.status(404).json('Event not found.');
    }
    const eventTitle = existingEvent.event?.title;
    const performer = {
        first_name,
        last_name,
        event_id: eventId,
        event_title: eventTitle,
        created_at: new Date(),
        updated_at: new Date()
    };
    const response = await mongodb.getDatabase().db().collection('performers').insertOne({performer});
    if (response.acknowledged) {
        res.status(200).send('SUCCESS - Performer Created');
    } else {
        res.status(500).json(response.error || 'An error occured while creating the performer.');
    }
}

const updatePerformer = async (req, res) => {
    //#swagger.tags=['Performers']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid performer id to update a performer.');
    }
    const performerId = new ObjectId(req.params.id);
    const updatedPerformer = { $set: {
        "performer.first_name": req.body.first_name,
        "performer.last_name": req.body.last_name,
        "performer.updated_at": new Date()
    } };
    const response = await mongodb.getDatabase().db().collection('performers').updateOne({ _id: performerId }, updatedPerformer);
    if (response.modifiedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while updating the performer.');
    }
}

const deletePerformer = async (req, res) => {
    //#swagger.tags=['Performers']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid performer id to delete a performer.');
    }
    const performerId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('performers').deleteOne({ _id: performerId });
    if (response.deletedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while deleting the performer.');
    }
}

module.exports = {
    getAll,
    getSingle,
    createPerformer,
    updatePerformer,
    deletePerformer
};