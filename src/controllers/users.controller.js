import { db } from "../database/database.connection.js"
import {v4 as uuid} from "uuid"
import bcrypt from "bcrypt"

export async function signup(req, res){
    const {name,  email, password, confirmPassword} = req.body

    if(password !== confirmPassword) return res.status(422).send("Passwords don't match")

    const emailExist = await db.query(`SELECT * FROM users WHERE email=$1;`, [email])
    if(emailExist.rows.length > 0) return res.status(409).send("Email already registered")

    try{
        const hash = bcrypt.hashSync(password, 10)

        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [name, email, hash])
        res.status(201).send("Sucessfully registered user")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function signin(req, res){
    const {email, password} = req.body

    const emailExist = await db.query(`SELECT * FROM users WHERE email=$1;`, [email])
    if(emailExist.rows.length === 0) return res.status(401).send("Email not registered")

    const checkPassword = bcrypt.compareSync(password, emailExist.rows[0].password)
    if(!checkPassword) return res.status(401).send("Password doesn't match with email")

    try{
        const token = uuid()
        // await db.query(``)
        res.status(200).send(token)
    } catch (err) {
        res.status(500).send(err.message)
    }


}