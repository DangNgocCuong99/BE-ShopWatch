import { RequestHandler } from "express"

export const uploadImg :RequestHandler= async (req, res) => {
    try {
        const file = req.files[0]
        const linkFile  = `http://localhost:3000/${file.filename}`
        res.send(linkFile)
    } catch (error) {
        res.send({ message: error.message })
    }
}