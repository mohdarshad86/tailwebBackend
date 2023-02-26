const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const userModel = require('../models/userModel')

const authentication = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']

        if (!token) return res.status(400).send({ status: false, message: "missing mandatory header" })

        jwt.verify(token, "secretKey", function (err, decodedToken) {

            if (decodedToken) {
                req.userId = decodedToken.userId
                next()
            } else {
                return res.status(401).send({ status: false, message: err.message })

            }
        })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const authorisation = async function (req, res, next) {
    try {
        const token = req.headers['x-api-key']
        const userIdInToken = jwt.decode(token).userId

        const studentId = req.params.studentId

        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).send({
                status: false,
                message: "Please enter Valid Object Id"
            })
        }
        // const userId = await userModel.findById(studentId).select({ userId: 1 })
        // if (!userId) {
        //     return res.status(404).send({
        //         status: false,
        //         message: "User Id Doesn't exist"
        //     })
        // }

        // if (userId.userId != userIdInToken)
        //     return res.status(403).send({
        //         status: false,
        //         message: "You are not Authorized"
        //     })

        next()
    }
    catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }

}



module.exports = { authentication, authorisation}