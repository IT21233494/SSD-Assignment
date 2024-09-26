const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const Admin = require('../models/postAdmin');

router.use(cors());
process.env.SECRET_KEY = 'admin';


router.post('/admin/register', (req, res) => {
    const today = new Date();

    const adminData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        created: today
    };

    // Prevent NoSQL injection
    if (typeof adminData.name !== 'string' || 
        typeof adminData.email !== 'string' || 
        typeof adminData.password !== 'string') {
        return res.status(400).json({ error: 'Invalid input type' });
    }
    //
    Admin.findOne({ email: req.body.email })
        .then(admin => {
            if (!admin) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    adminData.password = hash;
                    Admin.create(adminData)
                        .then(admin => {
                            res.status(200).json({ status: admin.email + ' registered' });
                        })
                        .catch(err => {
                            res.status(500).json({ error: 'Error creating admin: ' + err });
                        });
                });
            } else {
                res.status(400).json({ error: 'User already registered' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'Error checking admin: ' + err });
        });
});


router.post('/admin/login', (req, res) => {
  
    // NoSQL injection prevention
    if (typeof req.body.email !== 'string' || 
        typeof req.body.password !== 'string') {
        return res.status(400).json({ error: 'Invalid input type' });
    }

    Admin.findOne({ email: req.body.email })
        .then(admin => {
            if (admin) {
                if (bcrypt.compareSync(req.body.password, admin.password)) {
                    const payload = {
                        _id: admin._id,
                        name: admin.name,
                        email: admin.email
                    };
                    let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 1440 });
                    res.send(token);
                } else {
                    res.status(401).json({ error: 'Invalid password' });
                }
            } else {
                res.status(404).json({ error: 'Admin not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'Server error: ' + err });
        });
});

// Admin profile route
router.get('/admin/profile', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    Admin.findOne({ _id: decoded._id })
        .then(admin => {
            if (admin) {
                res.json(admin);
            } else {
                res.status(404).json({ error: 'Admin does not exist' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'Error fetching admin: ' + err });
        });
});

// Get posts
router.get('/getData', (req, res) => {
    Admin.find().exec((err, admins) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        return res.status(200).json({
            success: true,
            existingPosts: admins
        });
    });
});

// Delete post
router.delete('/user/delete/:id', (req, res) => {
    Admin.findByIdAndRemove(req.params.id).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                message: "Delete unsuccessful",
                err
            });
        }
        return res.json({
            message: "successfully deleted",
            user
        });
    });
});

module.exports = router;
