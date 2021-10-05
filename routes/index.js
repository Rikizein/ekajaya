var express = require('express');
var router = express.Router();

const axios = require('axios')

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/', (req, res) => {
  res.render('login', {
    title: 'login',
    loginMessage: req.flash("loginMessage"),
    userData: req.session.user
  })
})


router.post('/', (req, res) => {
  if (!req.body.email || !req.body.password) {
      req.flash('loginMessage', "please fill all form input");
      return res.redirect('/');
  }
  axios.post(`http://localhost:3000/users`, {
      email: req.body.email,
      password: req.body.password
  })
      .then(function (response) {
        console.log("cek respon", response.data);
          if (response.data.err) {
              req.flash('loginMessage', response.data.message);
              res.redirect('/');
          }
          res.redirect('/home')
      })
      .catch(function (err) {
          req.flash('loginMessage', "Terjadi kesalahan");
          res.redirect('/');
        })
})

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'register',
    failedMessageRegister: req.flash("failedMessageRegister"),
    successMessageRegister: req.flash("successMessageRegister")
  })
})

router.post('/register', (req, res) => {
  axios.post(`http://localhost:3000/users/register`, {
    id:req.body.id,
    email: req.body.email,
    password: req.body.password
  })
    .then((response) => {
      if (response.success = false) {
        req.flash('failedMessageRegister', "Register Gagal");
        res.redirect('/register')
      } else {
        req.flash('successMessageRegister', "Register Berhasil Silahkan Login")
        // req.session.user = response.data.data;
        res.redirect('/register')
      }
    })
    .catch(function (err) {
      console.error(err);
      req.flash('failedMessageRegister', "something went wrong");
      res.redirect('/register');
    })
})

module.exports = router;
