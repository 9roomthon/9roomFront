import React from "react";
import { useAuth } from "./AuthContext.tsx";

const GoogleLogin: React.FC = () => {
  const { user, setUser } = useAuth();

  const handleLogin = () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      console.log(token);
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }

      fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser({ name: data.name, email: data.email });
          // 로그인 성공 메시지를 백그라운드 스크립트로 전송
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id !== undefined) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "addClickButton" });
            }
          });
        })
        .catch((error) => console.error("Error fetching user info:", error));
    });
  };

  const handleLogout = () => {
    chrome.identity.clearAllCachedAuthTokens(() => {
      setUser(null);
    });
  };

  if (user) {
    return (
      <div>
        <p>안녕하세요, {user.name}님!</p>
        <p>현재 이메일 : {user.email}</p>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    );
  }

  return <button onClick={handleLogin}>구글로 로그인</button>;
};

export default GoogleLogin;
