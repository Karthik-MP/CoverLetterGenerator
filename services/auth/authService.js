const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user');
require('dotenv').config();

// Function for signup
const signup = async (userData) => {
  const { username, email, password, firstName, lastName, gender, pronouns, preferredName, phoneNumber, address, country, city, state, pinCode } = userData;
  console.log(userData)
  try {
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      gender,
      pronouns,
      preferredName,
      phoneNumber,
      address,
      country,
      city,
      state,
      pinCode,
    });

    return user;
  } catch (error) {
    throw new Error('Error while creating user: ' + error.message);
  }
};

// Function for login
const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

module.exports = { signup, login };
