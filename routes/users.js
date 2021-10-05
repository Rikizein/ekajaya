var express = require('express');
var router = express.Router();

const fs = require('fs');

const getAllUsers = () => {
  const users = fs.readFileSync('seeds/users.json')
  return JSON.parse(users)
}


const saveUserData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync('seeds/users.json', stringifyData)
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  const users = getAllUsers()
  res.send(users)
});

router.post('/', (req, res) => {
  let response = {
    err: false,
    message: '',
    data: null
  }
  const existUsers = getAllUsers()
  const userData = req.body

  if (userData.email == null || userData.password == null) {
    return res.status(401).send({ error: true, msg: 'User data missing' })
  }

  const findExistEmail = existUsers.find(user => user.email === userData.email)
  const findExistPwd = existUsers.find(user => user.password === userData.password)

  if (!findExistEmail || !findExistPwd) {
      response.err = true,
      response.message = 'wrong credentials'
    return res.json(response);
  }
  res.json(response)
})

router.post('/register', (req, res) => {
  const existUsers = getAllUsers()
  const userData = req.body

  if (userData.email == null || userData.password == null) {
    return res.status(401).send({ error: true, msg: 'User data missing' })
  }

  const findExist = existUsers.find(user => user.email === userData.email)
  if (findExist) {
    return res.status(409).send({ error: true, msg: 'email already exist' })
  }

  //append the user data
  existUsers.push(userData)

  //save the new user data
  saveUserData(existUsers);
  res.send({ success: true, msg: 'User data added successfully' })
})

/* Update - Patch method */
router.patch('/:id', (req, res) => {
  //get the id from url
  const id = req.params.id
  //get the update data
  const userData = req.body
  //get the existing user data
  const existUsers = getAllUsers()
  //check if the id exist or not       
  const findExist = existUsers.find(user => user.id === id)
  if (!findExist) {
    return res.status(409).send({ error: true, msg: 'id not exist' })
  }
  //filter the userdata
  const updateUser = existUsers.filter(user => user.id !== id)
  //push the updated data
  updateUser.push(userData)
  //finally save it
  saveUserData(updateUser)
  res.send({ success: true, msg: 'User data updated successfully' })
})

/* Delete - Delete method */
router.delete('/:id', (req, res) => {
  const id = req.params.id
  //get the existing userdata
  const existUsers = getAllUsers()
  //filter the userdata to remove it
  const filterUser = existUsers.filter(user => user.id !== id)
  if (existUsers.length === filterUser.length) {
    return res.status(409).send({ error: true, msg: 'id does not exist' })
  }
  //save the filtered data
  saveUserData(filterUser)
  res.send({ success: true, msg: 'User removed successfully' })

})


module.exports = router;
