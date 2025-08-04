
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Simple secret for now. In a real app, use environment variables.
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      username,
      password,
      role // 'admin' or 'user'
    });

    await user.save();
        
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user and explicitly exclude the password from the result
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Since we excluded the password, we need to fetch it separately for comparison
    const userWithPassword = await User.findOne({ username });
    const isMatch = await userWithPassword.comparePassword(password);
        
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: "5h" }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
                
        // Return both the token and the user object
        res.json({
          token,
          user: {
            _id: user._id,
            username: user.username,
            role: user.role
          }
        });
      }
    );

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
