const express = require("express")
const ctrl = require("../../controllers/notices")
const { schemas } = require("../../models/notice")
const {
  validateBody,
  isValidId,
  authenticate,
  uploadFile,
} = require("../../middlewares")

const router = express.Router()

// router.get("/", authenticate, ctrl.getAll)

// router.get("/:noticeId", authenticate, isValidId, ctrl.getById)

router.post(
  "/",
  authenticate,
  uploadFile.single("avatar"),
  validateBody(schemas.addNoticeSchema),
  ctrl.add
)

// router.put(
//   "/:noticeId",
//   authenticate,
//   isValidId,
// validateBody(schemas.addNoticeSchema),
//   ctrl.updateById
// )

// router.patch(
//   "/:noticeId/favorite",
//   authenticate,
//   isValidId,
//   validateBody(schemas.updateFavoriteSchema),
//   ctrl.updateFavorite
// )

router.delete("/:noticeId", authenticate, isValidId, ctrl.deleteById)

module.exports = router
