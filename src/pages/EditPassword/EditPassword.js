import React, { useState, useEffect } from "react";
import "./EditPassword.css";
import { useNavigate } from "react-router-dom";
import { TextInput, Button } from "joseph-ui-kit";
import {
  useGetUserInfoMutation,
  useEditUserMutation,
} from "../../services/user";

const EditPassword = ({ isLogIn }) => {
  const [prevPassword, setPrevPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [configNewPassword, setConfigNewPassword] = useState("");
  const [warnNewPassword, setWarnNewPassword] = useState("");
  const [warnconfigPassword, setWarnConfigPassword] = useState("");

  const navigate = useNavigate();

  const goToMain = () => {
    navigate("/");
  };

  const goToMyProfile = () => {
    navigate("/myprofile");
  };

  const [getUserInfo, { data: userId }] = useGetUserInfoMutation();
  const [editPassword] = useEditUserMutation();

  const handleClickButton = async () => {
    if (newPassword.length < 6) {
      setWarnNewPassword("비밀번호는 6자 이상이어야 합니다.");
    } else if (newPassword !== configNewPassword) {
      setWarnNewPassword("");
      setWarnConfigPassword("비밀번호가 일치하지 않습니다.");
    } else {
      editPassword({ userId, prevPassword, newPassword })
        .unwrap()
        .then(() => {
          alert("정상적으로 비밀번호 변경이 되었습니다.");
          goToMyProfile();
        })
        .catch((err) => {
          if (err.data.error === "비밀번호불일치") {
            alert("기존 비밀번호가 일치하지 않습니다.");
          } else {
            alert("비밀번호 변경에 실패하였습니다.");
          }
        });
    }
  };

  useEffect(() => {
    if (!isLogIn) {
      goToMain();
    }
    getUserInfo();
  }, [isLogIn]);

  return (
    <div className="editpassword_container">
      <h3>비밀번호 변경</h3>
      <form className="editpassword_input_container">
        <TextInput
          id="기존 비밀번호"
          label="기존 비밀번호"
          hideWarn
          type="password"
          onChange={(data) => setPrevPassword(data.value)}
          placeholder="비밀번호를 입력하세요."
        />
        <TextInput
          id="변경할 비밀번호"
          label="변경할 비밀번호"
          warn={warnNewPassword}
          type="password"
          onChange={(data) => setNewPassword(data.value)}
          placeholder="비밀번호를 입력하세요."
        />
        <TextInput
          id="변경할 비밀번호 확인"
          label="변경할 비밀번호 확인"
          warn={warnconfigPassword}
          type="password"
          onChange={(data) => setConfigNewPassword(data.value)}
          placeholder="다시 한번 비밀번호를 입력하세요."
        />
      </form>
      <div className="editpassword_button_container">
        <Button
          kind="secondary"
          name="비밀번호 변경"
          width="200px"
          onClick={handleClickButton}
        />
        <Button
          kind="tertiary"
          name="나의 프로필로 돌아가기"
          width="200px"
          onClick={goToMyProfile}
        />
      </div>
    </div>
  );
};

export default EditPassword;
