import { Router } from "express";
import { signin, signup } from "../controllers/users.controller.js";
import { validateSchemas } from "../middlewares/validateSchema.middleware.js";
import { loginSchema, userSchema } from "../schemas/users.schemas.js";

const userRouter = Router()

userRouter.post("/signup", validateSchemas(userSchema),signup)
userRouter.post("/signin", validateSchemas(loginSchema), signin)

export default userRouter