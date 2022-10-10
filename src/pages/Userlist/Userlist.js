import React, { useEffect } from "react";
import "./Userlist.css";
import { useNavigate } from "react-router-dom";
import { DataTable, Button } from "joseph-ui-kit";
import convertUserlist from "../../utils/convertUserlist";
import { useGetUserlistQuery } from "../../services/user";

const columns = [
  { field: "id", headerName: "NO", width: "100px" },
  { field: "enrolled", headerName: "생성일", width: "200px" },
  { field: "userId", headerName: "아이디", width: "100px" },
];

const Userlist = () => {
  const navigate = useNavigate();

  const goToMain = () => {
    navigate("/");
  };

  const { data: userlist, refetch } = useGetUserlistQuery(null);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="userlist_container">
      <DataTable
        headerText="생성된 유저명단"
        columns={columns}
        rows={convertUserlist(userlist)}
      />
      <div className="button_wrapper">
        <Button name="로그인 페이지로 가기" width="200px" onClick={goToMain} />
      </div>
    </div>
  );
};

export default Userlist;
