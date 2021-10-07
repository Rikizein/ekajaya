var express = require('express');
var router = express.Router();

const axios = require('axios')
const fs = require('fs');


/* GET home page. */

const getAllUsers = () => {
  const users = fs.readFileSync('seeds/users.json')
  return JSON.parse(users)
}

const getAllProducts = () => {
  const products = fs.readFileSync('seeds/products.json')
  return JSON.parse(products)
}

const saveUserData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync('seeds/users.json', stringifyData)
}

router.get('/home', (req, res) => {
  const users = getAllUsers()
  const products = getAllProducts()
  res.render('index', { title: 'Express', users:users, products:products});
})
// router.get('/home', function(req, res, next) {
//   axios.get('http://localhost:3000/users')
//   .then((response) => {
//     console.log(response.data);
//     res.render('index', { title: 'Express', users:response.data });
//   })
  
// });


router.get('/', (req, res) => {
  res.render('login', {
    title: 'login',
    loginMessage: req.flash("loginMessage"),
    userData: req.session.user
  })
})


// router.post('/', (req, res) => {
//   if (req.body.email === 'admin@gmail.com' && req.body.password === 'admin') {
//     res.redirect('/home')
//   }
// })

router.post('/', (req, res) => {
  const existUsers = getAllUsers()
  const userData = req.body

  if (userData.email == null || userData.password == null) {
    return res.status(401).send({ error: true, msg: 'User data missing' })
  }

  const findExistEmail = existUsers.find(user => user.email === userData.email)
  const findExistPwd = existUsers.find(user => user.password === userData.password)

  if (!findExistEmail || !findExistPwd) {
    req.flash('loginMessage', "Wrong Credentials");
    return res.redirect('/');
  }
  res.redirect('/home');
})

// router.post('/', (req, res) => {
//   if (!req.body.email || !req.body.password) {
//       req.flash('loginMessage', "please fill all form input");
//       return res.redirect('/');
//   }
//   axios.post(`http://localhost:3000/users`, {
//       email: req.body.email,
//       password: req.body.password
//   })
//       .then(function (response) {
//         console.log("cek respon", response.data);
//           if (response.data.err) {
//               req.flash('loginMessage', response.data.message);
//               res.redirect('/');
//           }
//           res.redirect('/home')
//       })
//       .catch(function (err) {
//           req.flash('loginMessage', "Terjadi kesalahan");
//           res.redirect('/');
//         })
// })

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'register',
    failedMessageRegister: req.flash("failedMessageRegister"),
    successMessageRegister: req.flash("successMessageRegister")
  })
})

router.post('/register', (req, res) => {
  const existUsers = getAllUsers()
  const userData = req.body

  if (userData.email == null || userData.password == null) {
    req.flash('failedMessageRegister', "Fields cannot empty");
    return res.redirect('/register')
  }

  const findExist = existUsers.find(user => user.email === userData.email)
  if (findExist) {
    req.flash('failedMessageRegister', "Email already exist");
    return res.redirect('/register')
  }

  //append the user data
  existUsers.push(userData)

  //save the new user data
  saveUserData(existUsers);
  req.flash('successMessageRegister', "User data added successfully...please login");
  res.redirect('/register')
})
// router.post('/register', (req, res) => {
//   axios.post(`http://localhost:3000/users/register`, {
//     id:req.body.id,
//     email: req.body.email,
//     password: req.body.password
//   })
//     .then((response) => {
//       if (response.success = false) {
//         req.flash('failedMessageRegister', "Register Gagal");
//         res.redirect('/register')
//       } else {
//         req.flash('successMessageRegister', "Register Berhasil Silahkan Login")
//         // req.session.user = response.data.data;
//         res.redirect('/register')
//       }
//     })
//     .catch(function (err) {
//       console.error(err);
//       req.flash('failedMessageRegister', "something went wrong");
//       res.redirect('/register');
//     })
// })

module.exports = router;
