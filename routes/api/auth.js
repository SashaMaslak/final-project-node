const express = require("express")
const ctrl = require("../../controllers/auth")
const { validateBody, authenticate, uploadFile } = require("../../middlewares")
const { schemas } = require("../../models/user")

const router = express.Router()

router.post("/register", validateBody(schemas.registerSchema), ctrl.register)

router.get("/verify/:verificationToken", ctrl.verifyEmail)

router.get("/verify", validateBody(schemas.emailSchema), ctrl.resendVerifyEmail)

router.post("/login", validateBody(schemas.loginSchema), ctrl.login)

router.post("/logout", authenticate, ctrl.logout)

router.get("/current", authenticate, ctrl.getCurrent)

router.put(
  "/",
  authenticate,
  validateBody(schemas.updateSchema),
  ctrl.updateUser
)

router.patch(
  "/avatars",
  authenticate,
  uploadFile.single("avatar"),
  ctrl.updateAvatar
)

router.post("/:noticeId/favorite", authenticate, ctrl.toggleNoticeFavorite)

module.exports = router
