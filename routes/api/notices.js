const express = require("express")
const router = express.Router()

const ctrl = require("../../controllers/notices")
const { validateBody, isValidId, authenticate } = require("../../middlewares")
const { schemas } = require("../../models/notice")

// router.get("/", authenticate, ctrl.getAll)
// router.get("/:noticeId", authenticate, isValidId, ctrl.getById)

router.post("/", authenticate, validateBody(schemas.addNoticeSchema), ctrl.add)

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
