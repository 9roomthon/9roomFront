import React from "react";
import GoogleLogin from "./GoogleLogin";
import { AuthProvider } from "./AuthContext";

/**
 * App 컴포넌트
 *
 * 이 컴포넌트는 번역 프로그램의 최상위 컴포넌트로, 인증 제공자를 통해
 * 하위 컴포넌트에 인증 상태를 전달하고, Google 로그인 컴포넌트를 렌더링합니다.
 *
 * @component
 * @returns {JSX.Element} 번역 프로그램의 최상위 JSX 요소를 반환
 */
const App: React.FC = () => {
  return (
    /**
     * AuthProvider
     *
     * 인증 상태와 관련된 컨텍스트를 하위 컴포넌트에 전달하는 역할을 합니다.
     */
    <AuthProvider>
      <div>
        <h1>번역 프로그램</h1>

        {/* GoogleLogin 컴포넌트를 렌더링하여 구글 로그인 기능을 제공합니다. */}
        <GoogleLogin />
      </div>
    </AuthProvider>
  );
};

export default App;
