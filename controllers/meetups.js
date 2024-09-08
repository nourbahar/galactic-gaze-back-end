const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verify-token.js');
const isClub = require('../middleware/is-club')
const Meetup = require('../models/meetup.js')
const Event = require('../models/event.js')
const User = require('../models/user');

// DELETE LATER
// async function insertMockEvent() {
//     try {
//         const event = new Event({
//             name: 'New Event',
//             description: 'This is a description of the sample event.',
//             datetime: new Date('2024-11-01T10:00:00Z'),
//             location: '123 Sample Street',
//             coordinates: '40.7128,-74.0060',
//             image: 'http://example.com/sample-image.jpg',

//         });
//         await event.save();
//         console.log('Mock event inserted successfully.');
//     } catch (error) {
//         console.error('Error inserting mock event:', error);
//     }
// }
// insertMockEvent();

router.get('/', async (req, res) => {
    try {
        const meetups = await Meetup.find().populate('eventid').populate('userid');
        res.status(200).json(meetups);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get('/:meetupID', async (req, res) => {
    try {
        const meetup = await Meetup.findById(req.params.meetupID).populate('eventid').populate('userid');
        res.status(200).json(meetup);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.use(verifyToken, isClub);

router.post('/', async (req, res) => {
    try {
        const { eventid, location } = req.body
        const event = await Event.findById(eventid);
        const Usser = await User.findById(req.user.id);
        const meetup = await Meetup.create({
            userid: req.user.id,
            eventid,
            location,
            image: event.image
        })
        event.meetups.push(meetup._id);
        await event.save();
        Usser.meetups.push(meetup._id);
        await Usser.save();
        res.status(201).json(meetup);
    } catch (error) {
        res.status(500).json(error);
    }
})


router.put('/:meetupID', async (req, res) => {
    try {
        const meetup = await Meetup.findById(req.params.meetupID);
        if (!meetup.userid.equals(req.user.id))
            return res.status(403).json(`You're not allowed to do that!`)

        const UpdateMeetup = await Meetup.findByIdAndUpdate(
            req.params.meetupID,
            req.body,
            { new: true }
        )
        res.status(200).json(UpdateMeetup);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.delete('/:meetupID', async (req, res) => {
    try {
        const meetup = await Meetup.findById(req.params.meetupID);
        if (!meetup.userid.equals(req.user.id))
            return res.status(403).json(`You're not allowed to do that!`)

        const DeleteMeetup = await Meetup.findByIdAndDelete(req.params.meetupID)
        res.status(200).json(DeleteMeetup);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;