import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      picturePath,
      friends,
      location,
      major,
      age,
      gender
    } = req.body;

    const newUser = new User({
      firstName,
      lastName,
      email,
      picturePath,
      friends,
      location,
      major,
      age,
      gender,
      viewedProfile: Math.floor(Math.random() * 10000),
      matches: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    console.log(req.body)
    const {OAuth2Client} = require('google-auth-library');
    const client = new OAuth2Client("525015530055-6m6jebnr7ikr2kj68bi4nfuprfgue67f.apps.googleusercontent.com");
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: "525015530055-6m6jebnr7ikr2kj68bi4nfuprfgue67f.apps.googleusercontent.com"
    }).catch((error) => {
      return res.status(401).json({ error: error});
    });
    
    const payload = ticket.getPayload();

    const user = await User.findOne({ email: payload.email });
    if (!user) return res.status(404).json({ msg: "User does not exist. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};