const router = require("express").Router();
const controller = require("../controllers/User");

router.get("/user", controller.userlistControl);

router.post("/userInfo", controller.userInfoControl);

router.post("/userInfoToken", controller.userInfoTokenControl);

router.post("/userRegister", controller.userRegisterControl);

router.post("/userLogIn", controller.userLogInControl);

router.post("/userLogOut", controller.userLogOutControl);

router.post("/userTokenLogIn", controller.userTokenLogInControl);

router.post("/userTokenLogOut", controller.userTokenLogOutControl);

router.patch("/userEdit", controller.userEditControl);

router.delete("/userDelete", controller.userDeleteControl);

module.exports = router;
