const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.set('trust proxy', 1);
const rateLimit = require('express-rate-limit');



const PORT = process.env.PORT || 8000;
//import routes
const postDelivery = require('./routes/postD');
const postProduct = require('./routes/postProduct');
const postRepair = require('./routes/postRepair');
const User = require('./routes/User');
const Admin = require('./routes/Admin');
const postWarrenty = require('./routes/postWarrenty');
const postOrder = require('./routes/Order');
const postEmp = require('./routes/emp');
const postRent = require('./routes/postRent');
const postRebtReq = require('./routes/postRentReq');
const postReturn = require('./routes/postReturn');
const postStock = require('./routes/stock')
const pay = require('./routes/payment')

//prevent DoS attack
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});


//app middelware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('upload'));
app.use(express.static('rentUpload'));
app.use(cors());
app.use(limiter);



//routes middelware
app.use(postDelivery);
app.use(postProduct);
app.use(postRepair);
app.use(User);
app.use(Admin);
app.use(postWarrenty);
app.use(postOrder);
app.use(postEmp);
app.use(postRent);
app.use(postRebtReq);
app.use(postReturn);
app.use(postStock)
app.use(pay)


app.get("/", (req, res) => {
    res.send("upload file")
})


const DB_URL = 'mongodb+srv://shabry:shabry@mydb.t4wv3xl.mongodb.net/onetel'
mongoose.set('strictQuery', false);
mongoose.set('strictQuery', true);

mongoose.connect(DB_URL)
    .then(() => {
        console.log('DB Connected');
    })
    .catch((err) => console.log('DB connection error', err));


app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
})
