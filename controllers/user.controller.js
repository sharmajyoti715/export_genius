const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs')
require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure Multer for file uploads
const prisma = new PrismaClient();
exports.register = async (req, res)=>{
    const { email, password } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the user in the database
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }

}

exports.login = async (req, res) => {
    const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h',
        });
        res.status(200).json({ message: 'Login successful',token });

  //  res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}


// Assuming you have already configured Multer and initialized PrismaClient (prisma)


exports.uploadFile = async (req, res) => {
  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      }

      // Check if file was provided
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Save file information to the database
      const { filename, originalname, size } = req.file;
      const file = req.file;
      const buffer = fs.readFileSync(file.path);
      const userId = req.userId; // Assuming userId is available in the request object

      const image = await prisma.UserImage.create({
        data: {
          filename,
          originalname,
          size,
          image: buffer,
          user: { connect: { id: userId } }, // Connect the image to the user
        },
      });

      res.status(200).json({ message: 'File uploaded successfully', image });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}

