import { db } from "../database/database.connection.js"
import {v4 as uuid} from "uuid"
import bcrypt from "bcrypt"

export async function singup(req, res){
    const {name,  email, password, confirmPassword} = req.body

    if(password !== confirmPassword) return res.status(422).send("Passwords don't match")

    const emailExist = await db.query(`SELECT * FROM users WHERE email=$1;`, [email])
    if(emailExist.rows.length > 0) return res.status(409).send("Email already registered")

    try{
        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [name, email, password])
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}