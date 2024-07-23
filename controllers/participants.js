const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Participants']
    const result = await mongodb.getDatabase().db().collection('participants').find();
    result.toArray().then((participants) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(participants);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Participants']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid participant id to find a participant.');
    }
    const participantId = new ObjectId(req.params.id);
    mongodb.getDatabase().db().collection('participants').find({ _id: participantId }).toArray().then((participant) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(participant[0]);
    });
};

const createParticipant = async (req, res) => {
    //#swagger.tags=['Participants']
    const { first_name, last_name, email, event_id, joined_at, status } = req.body;
    if (!ObjectId.isValid(event_id)) {
        res.status(400).json('Must use a valid event id to create a participant.');
    }
    const eventId = new ObjectId(event_id);
    const existingEvent = await mongodb.getDatabase().db().collection('events').findOne({ _id: eventId });
    if (!existingEvent) {
        return res.status(404).json('Event not found.');
    }
    const participant = {
        first_name,
        last_name,
        email,
        event_id: eventId,
        event_title: existingEvent.title,
        joined_at,
        status,
        created_at: new Date(),
        updated_at: new Date()
    };
    const response = await mongodb.getDatabase().db().collection('participants').insertOne({participant});
    if (response.acknowledged) {
        res.status(200).send('SUCCESS - Participant Created');
    } else {
        res.status(500).json(response.error || 'An error occured while creating the participant.');
    }
}

const updateParticipant = async (req, res) => {
    //#swagger.tags=['Participants']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid participant id to update a participant.');
    }
    const participantId = new ObjectId(req.params.id);
    const updatedParticipant = { $set: {
        "participant.first_name": req.body.first_name,
        "participant.last_name": req.body.last_name,
        "participant.email": req.body.email,
        "participant.joined_at": req.body.joined_at,
        "participant.status": req.body.status,
        "participant.updated_at": new Date()
    } };
    const response = await mongodb.getDatabase().db().collection('participants').updateOne({ _id: participantId }, updatedParticipant);
    if (response.modifiedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while updating the participant.');
    }
}

const deleteParticipant = async (req, res) => {
    //#swagger.tags=['Participants']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid participant id to delete a participant.');
    }
    const participantId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('participants').deleteOne({ _id: participantId });
    if (response.deletedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while deleting the participant.');
    }
}

module.exports = {
    getAll,
    getSingle,
    createParticipant,
    updateParticipant,
    deleteParticipant
};