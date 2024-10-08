const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const  cors = require('cors');
const User = require('../models/postUsers');
const Admin = require('../models/postAdmin');
router.use(cors());


process.env.SECRET_KEY = 'secret';

// Token verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Store user info from token in request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

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
  
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
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
  




router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email })
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


  // router.post('/admin/login', (req, res) => {
  //   Admin.findOne({ email: req.body.email })
  //   .then(admin => {
  //     if (admin) {
  //       // Compare passwords
  //       if (bcrypt.compareSync(req.body.password, admin.password)) {
  //         const payload = {
  //           _id: admin._id,
  //           email: admin.email,
  //           //role: 'admin',  // You can add other fields if needed
  //         };

  //         // Generate JWT token
  //         let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 1440 });
  //         res.json({ token: token });  // Send token to client
  //       } else {
  //         res.status(401).json({ error: 'Invalid password' });
  //       }
  //     } else {
  //       res.status(404).json({ error: 'Admin not found' });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).json({ error: 'Server error' });
  //   });
  // });
  

router.get('/profile',verifyToken,(req,res)=>{
    var decoded = jwt.verify(req.headers['authorization'],process.env.SECRET_KEY)

    User.findOne({
        _id:decoded._id
    })
      .then(user =>{
        if(user){
            res.json(user)
        }else{
            res.send("User Doesnot exist");
        }
      })
      .catch(err=>{
        res.send("ERRor"+err);
      })


})

//get posts

router.get('/getData',verifyToken,(req,res)=>{
  User.find().exec((err,user)=>{
      if(err){
          return res.status(400).json({
              error:err
          });
      }
          return res.status(200).json({
              success:true,
              existingPosts:user
          });
      
  });
});


//delete post
router.delete('/user/delete/:id',verifyToken,(req,res)=>{
    User.findByIdAndRemove(req.params.id).exec((err,user)=>{
        if(err)
            return res.status(400).json({
                massage:"Delete unsuccesful",err
            });
            return res.json({
                massege:"Delete Succesfully",user
                
            });
        

    });
});





module.exports = router;