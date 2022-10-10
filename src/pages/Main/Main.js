import React, { useEffect, useState } from "react";
import "./Main.css";
import { useNavigate } from "react-router-dom";
import { TextInput, Button } from "joseph-ui-kit";
import { useTokenLoginUserMutation } from "../../services/user";

const Main = ({ isLogIn, setIsLogIn }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [warnuserId, setWarnUserId] = useState("");
  const [warnpassword, setWarnPassword] = useState("");

  const navigate = useNavigate();

  const goToSignUp = () => {
    navigate("/signup");
  };

  const goToUserlist = () => {
    navigate("/userlist");
  };

  const goToMyProfile = () => {
    navigate("/myprofile");
  };

  const [tokenLoginUser] = useTokenLoginUserMutation();

  const handleClickButton = async () => {
    if (userId.length === 0) {
      setWarnUserId("아이디를 입력해 주세요.");
    } else if (password.length === 0) {
      setWarnUserId("");
      setWarnPassword("비밀번호를 입력해 주세요.");
    } else {
      tokenLoginUser({ userId, password })
        .unwrap()
        .then((res) => {
          alert("정상적으로 로그인이 되었습니다.");
          localStorage.setItem("accessToken", res.accessToken);
          goToMyProfile();
          setIsLogIn(true);
        })
        .catch((err) => {
          alert("로그인에 실패하였습니다.");
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (isLogIn) {
      goToMyProfile();
    }
  }, [isLogIn]);

  return (
    <div className="main_container">
      <h3>로그인</h3>
      <form className="main_input_container">
        <TextInput
          id="아이디"
          label="아이디"
          warn={warnuserId}
          onChange={(data) => setUserId(data.value)}
          placeholder="아이디를 입력하세요."
        />
        <TextInput
          id="비밀번호"
          label="비밀번호"
          warn={warnpassword}
          type="password"
          onChange={(data) => setPassword(data.value)}
          placeholder="비밀번호를 입력하세요."
        />
      </form>
      <div className="main_button_container">
        <Button name="로그인" width="200px" onClick={handleClickButton} />

        <Button
          kind="secondary"
          name="회원가입"
          width="200px"
          onClick={goToSignUp}
        />
        <Button
          kind="tertiary"
          name="유저리스트 페이지로 가기"
          width="200px"
          onClick={goToUserlist}
        />
      </div>
    </div>
  );
};

export default Main;
