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
        
        const idUser = userSession.rows[0].id
        const idLogin = sessions.rows[0].id
        const shortUrl = nanoid()
        const createdAt = dayjs()

        await db.query(`INSERT INTO urls ("idUser", "idLogin", url, "shortUrl", "createdAt") VALUES 
        ($1, $2, $3, $4, $5);`,[idUser, idLogin, url, shortUrl, createdAt])

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}