import { Router } from "express";
import { deleteUrl, getOpenUrl, getRanking, getUrlId, getUsersMe, postUrls } from "../controllers/urls.controllers.js";
import { validateSchemas } from "../middlewares/validateSchema.middleware.js";
import { urlSchemas } from "../schemas/urls.schemas.js";

const urlRouter = Router()

urlRouter.post("/urls/shorten",validateSchemas(urlSchemas),postUrls)
urlRouter.get("/urls/:id", getUrlId)
urlRouter.get("/urls/open/:shortUrl", getOpenUrl)
urlRouter.delete("/urls/:id", deleteUrl)
urlRouter.get("/users/me", getUsersMe)
urlRouter.get("/ranking", getRanking)

export default urlRouter
