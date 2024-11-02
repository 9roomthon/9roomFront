import React from "react";
import { useAuth } from "./AuthContext.tsx";
import axios from "axios";

/**
 * GoogleLogin 컴포넌트
 *
 * Google OAuth2를 이용해 사용자 인증을 처리하며, 로그인 및 로그아웃 기능을 제공합니다.
 * 인증된 사용자는 Chrome 스토리지에 토큰이 저장되며, 로그인 상태에 따라 환영 메시지와 이메일이 표시됩니다.
 *
 * @component
 * @returns {JSX.Element} Google 로그인 버튼 또는 로그인된 사용자 정보와 로그아웃 버튼
 */
const GoogleLogin: React.FC = () => {
  const { user, setUser } = useAuth();

  /**
   * 로그인 핸들러
   *
   * Chrome의 OAuth2 API를 통해 인증 토큰을 획득하고, 서버에 토큰을 전송하여 JWT 토큰을 획득합니다.
   * 인증 후 사용자 정보를 가져와 상태에 저장합니다.
   */
  const handleLogin = () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      console.log(token);
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      if (token !== undefined) {
        sendAccessTokenToServer(token);
      }

      fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser({ name: data.name, email: data.email });
          chrome.runtime.sendMessage({ action: "userLoggedIn" });
        })
        .catch((error) => console.error("Error fetching user info:", error));
    });
  };

  /**
   * 로그아웃 핸들러
   *
   * 현재 로그인된 사용자의 인증 토큰을 해지하고 Chrome 및 Google에서 로그아웃 처리합니다.
   * 모든 캐시된 토큰을 삭제하고 로그인 상태를 초기화합니다.
   */
  const handleLogout = () => {
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

  /**
   * 액세스 토큰을 서버에 전송
   *
   * Google에서 받은 OAuth2 토큰을 서버에 전송하여 JWT 토큰을 획득하고,
   * Chrome 스토리지에 JWT 토큰을 저장합니다.
   *
   * @param {string} token - Google OAuth2에서 발급된 액세스 토큰
   */
  const sendAccessTokenToServer = async (token: string) => {
    try {
      const response = await axios.post("/auth/convert-token", {
        accessToken: token,
      });

      if (response.status !== 200) {
        throw new Error("Failed to send access token to server");
      }

      const jwtToken = response.data.token; // 서버에서 반환된 JWT 토큰

      // Chrome 스토리지에 JWT 토큰 저장
      chrome.storage.local.set({ jwtToken }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error saving JWT token to Chrome storage:",
            chrome.runtime.lastError
          );
        } else {
          console.log("JWT 토큰이 Chrome storage에 저장되었습니다.");
        }
      });
    } catch (error) {
      console.error("Error sending access token to server:", error);
    }
  };

  // 사용자 로그인 상태에 따른 렌더링
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
