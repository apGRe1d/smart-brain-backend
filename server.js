const express = require('express');
const bodyParser = require('body-parser'); 
const bcrypt = require('bcryptjs');
const cors = require('cors'); 
const knex = require('knex');  

const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();
const url = require('url');

app.use(bodyParser.json()); 
app.use(cors());


app.use(express.static(url.parse('https://github.com/apGRe1d/face-recognition-production/tree/master/build', true)));
    
app.get('*', function(req, res) {
	res.sendFile(url.parse('https://github.com/apGRe1d/face-recognition-production/tree/master/build/index.html', true));
});


app.get('/', (req, res) => {
	res.send('it is working!');
})

//SIGN IN
app.post('/signin', (req, res) => { signIn.handleSignIn(req, res, db, bcrypt) })

//REGISTER
app.post('/register', (req,res) => { register.handleRegister(req, res, db, bcrypt) })

//USER 
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

//IMAGE PART - updating the score of user
app.put('/image', (req, res) => { image.handleImage(req, res, db) }) 

/*ENDPOINT FOR BACKEND CLARIFAI*/
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res, db) })

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT} 3001`);
})








