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

        const userSession = await db.query(`SELECT * FROM users WHERE id=$1`,[sessions.rows[0].idUser])
        
        const idUser = userSession.rows[0].id
        const idLogin = sessions.rows[0].id

        const shortUrl = nanoid()
        const createdAt = dayjs()

        await db.query(`INSERT INTO urls ("idUser", "idLogin", url, "shortUrl", "createdAt") VALUES 
        ($1, $2, $3, $4, $5);`,[idUser, idLogin, url, shortUrl, createdAt])

        const infoUrl = await db.query(`SELECT id, "shortUrl" from urls WHERE "shortUrl"=$1`, [shortUrl])

        res.send(infoUrl).status(201)
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
        await db.query(`UPDATE urls SET visitCount = visitCount + 1 WHERE "shortUrl"=$1;`, [shortUrl])
        console.log(urlFind.rows[0])
        res.redirect(302, urlFind.rows[0].url)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteUrl(req, res){
    const {id} = req.params
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "")

    try{
        const sessions = await db.query(`SELECT * FROM logins WHERE token=$1`, [token])
        if (sessions.rows.length === 0) return res.sendStatus(401)

        const url = await db.query(`SELECT * FROM urls WHERE id=$1`,[id])
        if (url.rows.length === 0) res.sendStatus(404)
        if (url.rows[0].idUser !== sessions.rows[0].idUser) return res.sendStatus(401)

        await db.query(`DELETE FROM urls WHERE id=$1`,[id])

        res.sendStatus(204)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getUsersMe(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "")

    try {
        const sessions = await db.query(`SELECT * FROM logins WHERE token=$1`, [token])
        if (sessions.rows.length === 0) return res.sendStatus(401)

        const url = await db.query(`SELECT id, url, "shortUrl", "visitCount" FROM urls WHERE "idUser"=$1`,[sessions.rows[0].idUser])

        const totalVisitCount = await db.query(`SELECT SUM("visitCount") AS "visitCount" FROM urls WHERE "idUser"=$1`,[sessions.rows[0].idUser])
        
        const obj = totalVisitCount.rows[0]
        const visitCount = parseInt(obj.visitCount)

        const user = await db.query(`SELECT * FROM users WHERE id=$1`, [sessions.rows[0].idUser])

        const urlObject = {id: user.rows[0].id, name: user.rows[0].name, visitCount: visitCount, shortenedUrls: url.rows}

        res.send(urlObject).status(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getRanking(req, res){
    try{
    const urlRanking = await db.query(`SELECT users.id, 
    users.name, 
    COUNT(urls.url) AS "linksCount", 
    SUM(urls."visitCount") AS "visitCount"
    FROM urls
    LEFT JOIN users ON urls."idUser" = users.id
    GROUP BY users.id
    ORDER BY "visitCount" DESC
    LIMIT 10`)
    res.send(urlRanking.rows).status(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}