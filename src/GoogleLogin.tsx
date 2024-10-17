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
          chrome.runtime.sendMessage({ action: "userLoggedIn" });
        })
        .catch((error) => console.error("Error fetching user info:", error));
    });
  };

  const handleLogout = () => {
    // 현재 활성 계정의 토큰을 가져온 후 해지
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        setUser(null);
        return;
      }

      // 토큰 해지
      if (token) {
        chrome.identity.removeCachedAuthToken({ token }, () => {
          // Google의 토큰 해지 엔드포인트 호출
          fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
            .then(() => {
              console.log("Token revoked successfully");
            })
            .catch((error) => {
              console.error("Error revoking token:", error);
            })
            .finally(() => {
              // 모든 캐시된 토큰 제거
              chrome.identity.clearAllCachedAuthTokens(() => {
                // 로그인 정보 제거
                setUser(null);
                console.log("Logged out of Chrome");
              });
            });
        });
      }
    });
  };

  // 구글 로그인 성공 후 access_token 서버로 전송
  const sendAccessTokenToServer = async (accessToken) => {
    try {
      const response = await fetch(
        "https://your-server.com/api/save-google-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token: accessToken }),
        }
      );

      const data = await response.json();
      console.log("User saved to database:", data);
    } catch (error) {
      console.error("Error sending access token to server:", error);
    }
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
