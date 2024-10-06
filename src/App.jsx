import axios from "axios";
import { useState } from "react";
import icon from "/icons/icon_origin.png";

const App = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [faillogin, setFailLogin] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault(); // 오타 수정

    try {
      // 아이디와 비번 서버에 보내기
      const response = await axios.post("/login", null, {
        params: {
          username: id,
          password: password,
        },
      });
      // 위 post에 대한 응답으로 토큰 수령
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.headers.access);
        localStorage.setItem("idName", id);
      }
    } catch (error) {
      console.log(error);
      setFailLogin(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <img src={icon} alt="main icon" className="w-1/12"></img>
      <div className="text-xl font-semibold">웹페이지 번역</div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="">
          <input
            type="text"
            id="id"
            placeholder="  아이디"
            className="border-2 border-black rounded-sm bg-slate-50"
            onChange={setId}
          ></input>
        </div>
        <div>
          <input
            type="password"
            id="password"
            placeholder="  비밀번호"
            className="border-2 border-black rounded-sm bg-slate-50"
            onChange={setPassword}
          ></input>
        </div>
      </form>
      <button type="submit" className="w-1/4">
        로그인
      </button>
      {faillogin && <div>아이디나 비번이 잘못되었습니다</div>}
    </div>
  );
};

export default App;
