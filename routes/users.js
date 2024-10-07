const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
console.log(updateProfile);

const auth = require("../middlewares/auth");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
