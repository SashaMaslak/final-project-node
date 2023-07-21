const express = require("express")
const router = express.Router()

const ctrl = require("../../controllers/contacts")
const { validateBody, isValidId, authenticate } = require("../../middlewares")
const { schemas } = require("../../models/notice")

// router.get("/", authenticate, ctrl.getAll)
// router.get("/:contactId", authenticate, isValidId, ctrl.getById)

router.post("/", authenticate, validateBody(schemas.addNoticeSchema), ctrl.add)

// router.put(
//   "/:contactId",
//   authenticate,
//   isValidId,
//   validateBody(schemas.addSchemaContacts),
//   ctrl.updateById
// )

// router.patch(
//   "/:contactId/favorite",
//   authenticate,
//   isValidId,
//   validateBody(schemas.updateFavoriteSchema),
//   ctrl.updateFavorite
// )

router.delete("/:noticeId", authenticate, isValidId, ctrl.deleteById)

module.exports = router
