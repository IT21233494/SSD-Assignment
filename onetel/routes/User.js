const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('../models/postUsers');

//fix XSS issue
const sanitizeHtml = require('sanitize-html');

router.use(cors());
process.env.SECRET_KEY = 'secret';


// Register route
router.post('/register', (req, res) => {
    const today = new Date();
  
    const userData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      created: today
    };

    // Check if any required field is empty
    if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }
    
    // NoSQL injection prevention
    if ( 
      typeof userData.email !== 'string') {
      return res.status(400).json({ error: 'Invalid input type' });
  }

    User.findOne({ email: userData.email })
      .then(user => {
        if (!user) {
          bcrypt.hash(userData.password, 10, (err, hash) => {
            userData.password = hash;
            User.create(userData)
              .then(user => {
                res.status(200).json({ status: user.email + ' registered' });
              })
              .catch(err => {
                res.status(500).json({ error: 'Failed to register user' });
              });
          });
        } else {
          res.status(400).json({ error: 'User already registered' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: 'Internal server error' });
      });
});

// Login route
// router.post('/login', (req, res) => {
//     // Input validation
//     if (typeof req.body.email !== 'string'){
//         return res.status(400).json({ error: 'Invalid input type' });
//     }

//     User.findOne({ email: req.body.email })
//       .then(user => {
//         if (user) {
//           if (bcrypt.compareSync(req.body.password, user.password)) {
//             const payload = {
//               _id: user._id,
//               first_name: user.first_name,
//               last_name: user.last_name,
//               email: user.email
//             };
//             let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 1440 });
//             res.send(token);
//           } else {
//             res.status(401).json({ error: 'Invalid password' });
//           }
//         } else {
//           res.status(404).json({ error: 'User not found' });
//         }
//       })
//       .catch(err => {
//         res.status(500).json({ error: 'Server error' });
//       });
// });

//Fix XSS 
// Login route
router.post('/login', (req, res) => {
  // Input validation
  if (typeof req.body.email !== 'string') {
      return res.status(400).json({ error: 'Invalid input type' });
  }

  // Sanitize email input to prevent XSS
  const sanitizedEmail = sanitizeHtml(req.body.email);

  User.findOne({ email: sanitizedEmail })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          };
          let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 1440 });
          res.send(token);
        } else {
          res.status(401).json({ error: 'Invalid password' });
        }
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Server error' });
    });
});


// Profile route
router.get('/profile', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    var decoded;
    try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    User.findOne({ _id: decoded._id })
      .then(user => {
        if (user) {
            res.json(user);
        } else {
            res.send("User does not exist");
        }
      })
      .catch(err => {
        res.send("Error: " + err);
      });
});

// Get posts
router.get('/getData', (req, res) => {
    User.find().exec((err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        return res.status(200).json({
            success: true,
            existingPosts: users
        });
    });
});

// Delete post
router.delete('/user/delete/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                message: "Delete unsuccessful", err
            });
        }
        return res.json({
            message: "Delete successfully", user
        });
    });
});

module.exports = router;
