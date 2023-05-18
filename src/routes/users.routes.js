import { Router } from "express";
import { singup } from "../controllers/users.controller.js";
import { validateSchemas } from "../middlewares/validateSchema.middleware.js";
import { userSchema } from "../schemas/users.schemas.js";

const userRouter = Router()

userRouter.post("/signup", validateSchemas(userSchema),singup)

export default userRouter