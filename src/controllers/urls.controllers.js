import { nanoid } from "nanoid";
import { db } from "../database/database.connection.js"

export async function postUrls(req, res){
    const {url} = req.body
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "")

    try {
        const sessions = await db.query(`SELECT * FROM logins WHERE token=$1`, [token])
        if (sessions.rows.length === 0) return res.sendStatus(401)

        const userSession = await db.query(`SELECT * FROM users WHERE "id"=$1`,[sessions.rows[0].idUser])
        const alphanumeric = require('nanoid-generator/alphanumeric');

        console.log(alphanumeric)
        // await db.query(`INSERT INTO urls ("idUser", "idLogin", url, "shortUrl", views, "createdAt") VALUES ($1, $2, $3, $4, $5, $6)`,[])

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}