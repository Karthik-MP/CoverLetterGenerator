const { signup, login } = require('../../services/auth/authService');

// Signup route handler
const signupController = async (req, res) => {
  try {
    const user = await signup(req.body);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login route handler
const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await login(email, password);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { signupController, loginController };
