const express = require("express")
const ctrl = require("../../controllers/notices")
const { schemas } = require("../../models/notice")
const {
  validateBody,
  isValidId,
  authenticate,
  uploadFile,
  validateParams,
} = require("../../middlewares")

const router = express.Router()

router.get("/", validateParams(schemas.paramsNoticeSchema), ctrl.getAll)

router.get("/favorite", authenticate, ctrl.getFavorites)

router.get("/mypets", authenticate, ctrl.getMyPets)

router.get("/:noticeId", isValidId, ctrl.getById)

router.post(
  "/",
  authenticate,
  uploadFile.single("avatar"),
  validateBody(schemas.addNoticeSchema),
  ctrl.add
)

router.delete("/:noticeId", authenticate, isValidId, ctrl.deleteById)

router.post(
  "/:noticeId/favorite",
  authenticate,
  isValidId,
  ctrl.toggleNoticeFavorite
)

module.exports = router
