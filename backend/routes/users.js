const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const Instrument = require('../models/Instrument');

// POST /users/register: Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST /users/login: Authenticate user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
    res.status(200).json({ token });
  } else {
    res.status(400).json({ message: 'Incorrect password' });
  }
});


// GET /users/current: Return current user
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

// GET /users/:userId/bookings: Get all instruments booked by a user
router.get('/:userId/bookings', async (req, res) => {
  try {
    const { userId } = req.params;
    const instruments = await Instrument.find({ bookedBy: userId }).populate('bookedBy', 'username');
    res.status(200).json(instruments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
