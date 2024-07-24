const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Comments']
    const result = await mongodb.getDatabase().db().collection('comments').find();
    result.toArray().then((comments) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(comments);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Comments']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid comment id to find a comment.');
    }
    const commentId = new ObjectId(req.params.id);
    mongodb.getDatabase().db().collection('comments').find({ _id: commentId }).toArray().then((comment) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(comment[0]);
    });
};

const createComment = async (req, res) => {
    //#swagger.tags=['Comments']
    const { comment_text, comment_type, event_id } = req.body;
    if (!ObjectId.isValid(event_id)) {
        res.status(400).json('Must use a valid event id to create a comment.');
    }
    const eventId = new ObjectId(event_id);
    const existingEvent = await mongodb.getDatabase().db().collection('events').findOne({ _id: eventId });
    if (!existingEvent) {
        return res.status(404).json('Event not found.');
    }
    const eventTitle = existingEvent.event?.title;
    const comment = {
        comment_text,
        comment_type,
        event_id: eventId,
        event_title: eventTitle,
        created_at: new Date(),
        updated_at: new Date()
    };
    const response = await mongodb.getDatabase().db().collection('comments').insertOne({comment});
    if (response.acknowledged) {
        res.status(200).send('SUCCESS - Comment Created');
    } else {
        res.status(500).json(response.error || 'An error occured while creating the comment.');
    }
}

const updateComment = async (req, res) => {
    //#swagger.tags=['Comments']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid comment id to update a comment.');
    }
    const commentId = new ObjectId(req.params.id);
    const updatedComment = { $set: {
        "comment.comment_text": req.body.comment_text,
        "comment.comment_type": req.body.comment_type,
        "comment.updated_at": new Date()
    } };
    const response = await mongodb.getDatabase().db().collection('comments').updateOne({ _id: commentId }, updatedComment);
    if (response.modifiedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while updating the comment.');
    }
}

const deleteComment = async (req, res) => {
    //#swagger.tags=['Comments']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid comment id to delete a comment.');
    }
    const commentId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('comments').deleteOne({ _id: commentId });
    if (response.deletedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while deleting the comment.');
    }
}

module.exports = {
    getAll,
    getSingle,
    createComment,
    updateComment,
    deleteComment
};