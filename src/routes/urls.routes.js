import { Router } from "express";
import { postUrls } from "../controllers/urls.controllers.js";
import { validateSchemas } from "../middlewares/validateSchema.middleware.js";
import { urlSchemas } from "../schemas/urls.schemas.js";

const urlRouter = Router()

urlRouter.post("/urls/shorten",validateSchemas(urlSchemas),postUrls)
urlRouter.get("/urls/:id")
urlRouter.get("/urls/open/:shortUrl")
urlRouter.delete("/urls/:id")
urlRouter.get("/users/me")
urlRouter.get("/ranking")

export default urlRouter
