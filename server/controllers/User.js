require("dotenv").config({ path: ".env" });
const { generateAccessToken, isAuthorized } = require("../middlewares/token");

const User = require("../models/User");
const crypto = require("crypto");

module.exports = {
  userlistControl: async (req, res) => {
    const contents = await User.find({});

    res.status(200).send({ data: contents });
  },
  userInfoControl: async (req, res) => {
    const userInfo = await User.findOne({ id: req.session.userId });
    if (userInfo) {
      res.status(200).send({ data: userInfo.id });
    } else {
      res.status(200).send({ data: null });
    }
  },
  userInfoTokenControl: async (req, res) => {
    const accessTokenData = await isAuthorized(req, res);

    const userInfo = await User.findOne({ id: accessTokenData.id });
    if (userInfo) {
      res.status(200).send({ data: userInfo.id });
    } else {
      res.status(200).send({ data: null });
    }
  },
  userRegisterControl: async (req, res) => {
    const { id, password } = req.body;

    const userToBeRegistered = await User.findOne({ id: id });

    if (userToBeRegistered) {
      return res
        .status(500)
        .send({ error: "아이디중복", message: "이미 존재하는 아이디입니다." });
    }

    crypto.randomBytes(64, (err, buf) => {
      if (err) {
        res.status(500).send({ err, message: "crypto 오류" });
        return;
      }
      // salt 생성
      const salt = buf.toString("base64");

      crypto.pbkdf2(password, salt, 1, 32, "sha512", (err, key) => {
        if (err) {
          res.status(500).send({ err, message: "crypto 오류" });
          return;
        }
        // key는 salt를 이용해 나온 암호화된 패스워드
        const userContents = {
          id: id,
          password: key.toString("base64"),
          enrolled: new Date(),
          salt: salt,
        };

        const insertDb = new User(userContents).save();

        if (insertDb) {
          res
            .status(201)
            .send({ message: "정상적으로 유저가 등록되었습니다." });
        } else {
          res.status(500).send({
            message: "서버 오류가 발생했습니다. 등록되지 못했습니다.",
          });
        }
      });
    });
  },
  userEditControl: async (req, res) => {
    const { id, prevPassword, newPassword } = req.body;

    const { salt } = await User.findOne({ id: id }).select();

    crypto.pbkdf2(prevPassword, salt, 1, 32, "sha512", async (err, key) => {
      if (err) {
        res.status(500).send({ err, message: "crypto 오류" });
        return;
      }
      const userToBeEdited = await User.findOne({
        id: id,
        password: key.toString("base64"),
      });

      if (userToBeEdited) {
        crypto.randomBytes(64, (err, buf) => {
          if (err) {
            res.status(500).send({ err, message: "crypto 오류" });
            return;
          }
          // salt 생성
          const newSalt = buf.toString("base64");
          crypto.pbkdf2(
            newPassword,
            newSalt,
            1,
            32,
            "sha512",
            async (err, key) => {
              if (err) {
                console.log(err);
                return;
              }
              const editedPassword = {
                password: key.toString("base64"),
              };
              // await User.find({ id: id }).updateOne(editedPassword).exec();
              await User.findOneAndUpdate({ id: id }, editedPassword);

              res
                .status(200)
                .send({ message: "유저 비밀번호가 수정되었습니다." });
            }
          );
        });
      } else {
        res.status(400).send({
          error: "비밀번호불일치",
          message: "기존 비밀번호가 일치하지 않습니다.",
        });
      }
    });

    if (userToBeEdited === null) {
      res.status(400).send({
        error: "비밀번호불일치",
        message: "기존 비밀번호가 일치하지 않습니다.",
      });
    } else {
    }
  },
  userDeleteControl: async (req, res) => {
    const { id } = req.body;

    const ToDeleteUser = await User.findOne({ id: id });

    if (ToDeleteUser === null) {
      res.status(400).send({ message: "유저가 존재하지 않습니다." });
    } else {
      await User.deleteOne({ id: id });

      res.status(200).send({ message: "유저가 삭제되었습니다." });
    }
  },

  userLogInControl: async (req, res) => {
    const { id, password } = req.body;

    const { salt } = await User.findOne({ id: id }).select();

    crypto.pbkdf2(password, salt, 1, 32, "sha512", async (err, key) => {
      if (err) {
        res.status(500).send({ err, message: "crypto 오류" });
        return;
      }

      const userToBeLogIn = await User.findOne({
        id: id,
        password: key.toString("base64"),
      });

      if (userToBeLogIn) {
        req.session.userId = id;
        req.session.save();

        res.status(200).send({ message: "로그인이 완료되었습니다." });
      } else {
        res.status(400).send({
          message: "유저가 존재하지 않거나 비밀번호가 일치하지 않습니다.",
        });
      }
    });
  },
  userLogOutControl: async (req, res) => {
    req.session.destroy(function (err) {
      if (err) {
        res
          .status(400)
          .send({ err, message: "로그아웃이 정상적으로 되지 않았습니다." });
      } else {
        res.clearCookie("connect.sid");
        res.status(205).send("로그아웃이 완료되었습니다.");
      }
    });
  },
  userTokenLogInControl: async (req, res) => {
    const { id, password } = req.body;

    const { salt } = await User.findOne({ id: id }).select();

    crypto.pbkdf2(password, salt, 1, 32, "sha512", async (err, key) => {
      if (err) {
        res.status(500).send({ err, message: "crypto 오류" });
        return;
      }
      const userToBeLogIn = await User.findOne({
        id: id,
        password: key.toString("base64"),
      });

      if (userToBeLogIn) {
        const accessToken = await generateAccessToken({ id });
        res.status(200).send({ accessToken: accessToken });
      } else {
        res.status(400).send({
          message: "유저가 존재하지 않거나 비밀번호가 일치하지 않습니다.",
        });
      }
    });
  },
  userTokenLogOutControl: async (req, res) => {
    const accessTokenData = await isAuthorized(req, res);
    if (accessTokenData) {
      res.status(205).send("로그아웃이 완료되었습니다.");
    } else {
      res
        .status(400)
        .send({ message: "로그아웃이 정상적으로 되지 않았습니다." });
    }
  },
};
