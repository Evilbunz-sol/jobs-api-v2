const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: {
    email: user.email,
    name: user.name,
    location: user. location,
    lastName: user.lastName,
    token
  }})
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: {
    email: user.email,
    name: user.name,
    location: user. location,
    lastName: user.lastName,
    token
  }})
}

const updateUser = async (req, res) => {
  const {email, name, location, lastName} = req.body

  if (!email || !name || !location || !lastName) {
    throw new BadRequestError("Please provide all values")
  }

  const user = await User.findOne({_id: req.user.userId})

  user.email = email
  user.name = name
  user.location = location
  user.lastName = lastName

  await user.save()
  const token = user.createJWT()

  res.status(StatusCodes.OK).json({ user: {
    email: user.email,
    name: user.name,
    location: user. location,
    lastName: user.lastName,
    token
  }})
}

module.exports = {
  register,
  login,
  updateUser
}
