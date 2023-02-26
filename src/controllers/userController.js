const userModel = require('../models/userModel.js');
const validation = require("../validations/validation")
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const createUser = async function (req, res) {
    try {
        let userData = req.body
        // userData = JSON.parse(userData)
        console.log(userData);

        const checkUnique = await userModel.findOne({ $or: [{ email: userData.email }, { phone: userData.phone }] })
        if (checkUnique) {
            if (checkUnique.email == userData.email) return res.status(400).send({ status: false, message: "email already in use" })
            if (checkUnique.phone == userData.phone) return res.status(400).send({ status: false, message: "phone already in use" })
        }

        const createdUser = await userModel.create(userData);

        res.status(201).send({ status: true, message: "Register Successful, Login Now", data: createdUser })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const login = async function (req, res) {
    try {
        let { email, password } = req.body

        let isUserExist = await userModel.findOne({ email: email, password: password })
        if (!isUserExist)
            return res.status(401).send({ status: false, message: "Email Id and password are incorrect" })

        const userToken = jwt.sign({ userId: isUserExist._id }, 'secretKey', { expiresIn: 1800000 })

        const userTokenData = jwt.decode(userToken)
        userTokenData.iat = new Date(userTokenData.iat * 1000).toGMTString()
        userTokenData.exp = new Date(userTokenData.exp * 1000).toGMTString()

        res.setHeader['x-api-key'] = userTokenData

        return res.status(200).send({
            status: true,
            message: 'Success',
            data: {
                token: userToken,
                ...userTokenData
            }
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};

const logout = async (req, res) => {
    // res.setHeader['x-api-key'] = ""
    res.removeHeader('x-api-key')

    return res.status(500).send({ status: true, message: "Logout Successful" })

}

module.exports = { createUser, login, logout }