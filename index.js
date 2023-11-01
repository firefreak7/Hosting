var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

//-trying atlas connection
const dbUrl = "mongodb://dina:Dina_0987@ac-9ruu58i-shard-00-00.u74yfnc.mongodb.net:27017,ac-9ruu58i-shard-00-01.u74yfnc.mongodb.net:27017,ac-9ruu58i-shard-00-02.u74yfnc.mongodb.net:27017/?ssl=true&replicaSet=atlas-k42jhx-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectionp = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Define the User schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

mongoose.connect(dbUrl, connectionp);
var db = mongoose.connection;

db.on('error', () => console.log("error in connecting"));
db.once('open', () => console.log("connected successfully"));

app.post("/signup", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "name": name,
        "email": email,
        "password": password
    };
    console.log(name);

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("record Inserted");
    });
    return res.redirect('homepage.html');
});

app.post("/login_pass", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                console.log('User not found');
                return res.redirect('index.html'); 
            }
            if (user.password === password) {
                return res.redirect(`/homepage.html?name=${user.name}`);
            } else {
                console.log('Incorrect password');
                return res.redirect('index.html'); 
            }
        })
    // User.findOne({ email: email, password: password })
    // .then((user) => {
    //     if (!user) {
    //         alert('You must register!');
    //     }
    //     return res.redirect('/homepage.html?name=${email}');

    // })
    .catch((err) => {
        console.log(err);
        return res.status(500).send();
    });
    
});



app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    const path = require('path');
    const indexPath = path.join(__dirname, 'public', 'index.html');

    res.sendFile(indexPath);
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
