import React, { useEffect } from "react";
import "./Myprofile.css";
import { useNavigate } from "react-router-dom";
import { Button } from "joseph-ui-kit";
import {
  useWithdrawUserMutation,
  useGetUserInfoMutation,
  useTokenLogoutUserMutation,
} from "../../services/user";

const Myprofile = ({ isLogIn, setIsLogIn }) => {
  const navigate = useNavigate();

  const goToMain = () => {
    navigate("/");
  };

  const logOut = () => {
    setIsLogIn(false);
  };

  const goToEditPassword = () => {
    navigate("/editpassword");
  };

  const [getUserInfo, { data: userId }] = useGetUserInfoMutation();

  const [tokenLogOutUser] = useTokenLogoutUserMutation();

  const tokenLogOut = () => {
    tokenLogOutUser()
      .unwrap()
      .then(() => {
        logOut();
        localStorage.removeItem("accessToken");
        alert("로그아웃 되었습니다.");
        goToMain();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [withdrawUser] = useWithdrawUserMutation();

  const withdrawMembership = async () => {
    withdrawUser(userId)
      .unwrap()
      .then(() => {
        alert("정상적으로 탈퇴되었습니다.");
        setIsLogIn(false);
        goToMain();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserInfo();
    if (!isLogIn) {
      alert("잘못된 접근입니다.");
      goToMain();
    }
  }, [isLogIn]);

  return (
    <div className="myprofile_container">
      <span className="myprofile_username">{userId}님 환영합니다.</span>
      <div className="myprofile_button_wrapper">
        <Button
          kind="secondary"
          name="로그아웃"
          width="200px"
          onClick={tokenLogOut}
        />
        <Button
          kind="tertiary"
          name="비밀번호 변경"
          width="200px"
          onClick={goToEditPassword}
        />
        <Button
          kind="danger"
          name="회원탈퇴"
          width="200px"
          onClick={withdrawMembership}
        />
      </div>
    </div>
  );
};

export default Myprofile;
