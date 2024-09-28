const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const  cors = require('cors');
const Admin = require('../models/postAdmin');
router.use(cors());

process.env.SECRET_KEY = 'secret';



const verifyToken = (req, res, next) => {
  // Retrieve the token from the 'Authorization' header
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Access denied, no token provided' });
  }

  try {
    // Remove "Bearer " if it is part of the token string
    const formattedToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;

    // Verify the token
    const decoded = jwt.verify(formattedToken, process.env.SECRET_KEY);

    // Attach decoded token (admin details) to the request object
    req.user = decoded;
    next(); // Continue to the route
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};


router.post('/admin/register',(req,res)=>{
    const today = new Date()

    const adminData = {
        // name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        created:today
    }
    Admin.findOne({
        email:req.body.email
    })
    .then(admin=>{
        if(!admin){
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                adminData.password = hash
                Admin.create(adminData)
                    .then(admin =>{
                        res.json({status:admin.email+"registered"})
                    })
                    .catch(err=>{
                        res.send("error"+err);
                    })
            })
        }else{
            res.json({error:"User already registered"})
        }
    })
    .catch(err=>{
        res.send("error" +err); 
    })
})

// router.post('/admin/login',(req,res)=>{
//     Admin.findOne({
//          email:req.body.email
//     })
//        .then(user=>{
//           if(user){
//             if(bcrypt.compareSync(req.body.password,user.password)){
//               const payload ={
//                 _id:admin._id,
//                 name:admin.name,
//                 email:admin.email
//               }
//               let token =jwt.sign(payload,process.env.SECRET_KEY,{
//                 expiresIn:1440
//               })
//               res.send(token)
//             }else{
//                 res.json({error:"User not exist"})
//             }

//           }else{
//             res.json({error:"User not exist"})
//           }
//        })
//        .catch(err=>{
//         res.send("error" +err);
//        })
// })

// Example of a protected admin route
router.get('/admin', verifyToken, (req, res) => {
    // Route logic for authenticated admin users 

    if (req.user.role === 'admin') {
      res.send('Welcome, Admin');
    } else {
      res.status(403).send('Access denied');
    }
  });

router.post('/admin/login', (req, res) => {
    Admin.findOne({ email: req.body.email })
      .then(admin => {
        if (admin) { 
          console.log('Stored Hashed Password:', admin.password);
          console.log('Plain Password:', req.body.password);
          
          // Compare the hashed password with the plain password
          if (bcrypt.compareSync(req.body.password, admin.password)) {
            const payload = {
              _id: admin._id,
              email: admin.email,
              role:"admin"
            };
  
            // Generate JWT token
            let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 1440 });
            res.json({ token: token });  // Send token to client
          } else {
            res.status(401).json({ error: 'Invalid password' });
          }
        } else {
          res.status(404).json({ error: 'Admin not found' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: 'Server error' });
      });
  });



router.get('/admin/profile',(req,res)=>{
    var decoded = jwt.verify(req.headers['authorization'],process.env.SECRET_KEY)

    Admin.findOne({
        _id:decoded._id
    })
      .then(admin =>{
        if(admin){
            res.json(admin)
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