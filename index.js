const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const env  = require('dotenv')
env.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const port =  5000;

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/send-email', (req, res) => {
  const {subject, name, email, message } = req.body;

  if(!subject || !name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).send('Invalid email address.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD 
    }
  })

  const mailOptions = {
    from: 'Tosh abdulmaleeqomotosho@gmail.com',
    to: process.env.EMAIL,
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.redirect('/error'); // Redirect to an error page or handle the error as needed
    } else {
      console.log('Email sent:', info.response);
      res.redirect('/success'); // Redirect to a success page or handle the success as needed
    }
  }
)


})

app.get('/success', (req, res) => {
  res.render('success'); // Render a success page
})
app.get('/error', (req, res) => {
  res.render('error'); // Render an error page
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})