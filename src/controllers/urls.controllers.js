import { nanoid } from "nanoid";
import { db } from "../database/database.connection.js"
import dayjs from "dayjs";

export async function postUrls(req, res){
    const {url} = req.body
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "")

    try {
        const sessions = await db.query(`SELECT * FROM logins WHERE token=$1`, [token])
        if (sessions.rows.length === 0) return res.sendStatus(401)

        const userSession = await db.query(`SELECT * FROM users WHERE "id"=$1`,[sessions.rows[0].iduser])
        
        const idUser = userSession.rows[0].id
        const idLogin = sessions.rows[0].id
        console.log(idUser)
        console.log(idLogin)

        const shortUrl = nanoid()
        const createdAt = dayjs()

        await db.query(`INSERT INTO urls ("idUser", "idLogin", url, "shortUrl", "createdAt") VALUES 
        ($1, $2, $3, $4, $5);`,[idUser, idLogin, url, shortUrl, createdAt])

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getUrlId(req, res){
    const {id} = req.params

    const urlFind = await db.query(`SELECT * FROM urls WHERE id=$1;`, [id])
    if (urlFind.rows.length === 0) return res.sendStatus(404)

    try {
    
    const idUrl = urlFind.rows[0].id
    const shortUrl = urlFind.rows[0].shortUrl
    const url = urlFind.rows[0].url
    
    res.status(200).send({id: idUrl, shortUrl: shortUrl, url: url})

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getOpenUrl(req, res){
    const {shortUrl} = req.params

    const urlFind = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1;`, [shortUrl])
    if (urlFind.rows.length === 0) return res.sendStatus(404)

    try {
        await db.query(`UPDATE urls SET views = views + 1 WHERE "shortUrl"=$1;`, [shortUrl])
        console.log(urlFind.rows[0])
        res.redirect(302, urlFind.rows[0].url)
    } catch (err) {
        res.status(500).send(err.message)
    }
}