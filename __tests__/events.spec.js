const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const mongodb = require('../data/database');

const eventsController = require('../controllers/events');

// Setup in-memory MongoDB
let mongoServer;
let client;
let db;

// Setup Express server
const app = express();
app.use(bodyParser.json());
app.get('/events', eventsController.getAll);
app.get('/events/:id', eventsController.getSingle);
app.post('/events', eventsController.createEvent);
app.put('/events/:id', eventsController.updateEvent);
app.delete('/events/:id', eventsController.deleteEvent);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    client = new MongoClient(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db();
    jest.spyOn(mongodb, 'getDatabase').mockReturnValue({ db: () => db });
});

afterAll(async () => {
    await client.close();
    await mongoServer.stop();
});

describe('Events API', () => {
    let eventId;

    beforeEach(async () => {
        const event = {
            title: 'Sample Event',
            description: 'This is a sample event.',
            date: '2024-01-01',
            location: 'Sample Location',
            created_by: 'Sample Creator',
            created_at: new Date(),
            updated_at: new Date()
        };
        const response = await db.collection('events').insertOne({event});
        eventId = response.insertedId;
    });

    afterEach(async () => {
        await db.collection('events').deleteMany({});
    });

    test('GET /events should return all events', async () => {
        const response = await request(app).get('/events');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].event.title).toBe('Sample Event');
    });

    test('GET /events/:id should return a single event', async () => {
        const response = await request(app).get(`/events/${eventId}`);
        expect(response.status).toBe(200);
        expect(response.body.event.title).toBe('Sample Event');
    });

    test('POST /events should create a new event', async () => {
        // await db.collection('events').deleteMany({});
        const newEvent = {
            title: 'New Event',
            description: 'This is a new event.',
            date: '2024-02-01',
            location: 'New Location',
            created_by: 'New Creator'
        };
        const response = await request(app).post('/events').send(newEvent);
        expect(response.status).toBe(200);
        const events = await db.collection('events').find().toArray();
        // console.log(events);
        expect(events.length).toBe(2);
        expect(events[1].event.title).toBe('New Event');
    });

    test('PUT /events/:id should update an event', async () => {
        console.log(eventId);
        const updatedEvent = {
            title: 'Updated Event',
            description: 'This is an updated event.',
            date: '2024-03-01',
            location: 'Updated Location',
            created_by: 'Updated Creator'
        };
        const response = await request(app).put(`/events/${eventId}`).send(updatedEvent);
        expect(response.status).toBe(200);
        const event = await db.collection('events').findOne({ _id: eventId });
        console.log(event);
        expect(event.event.title).toBe('Updated Event');
    });

    test('DELETE /events/:id should delete an event', async () => {
        const response = await request(app).delete(`/events/${eventId}`);
        expect(response.status).toBe(200);
        const event = await db.collection('events').findOne({ _id: eventId });
        expect(event).toBeNull();
    });
});
