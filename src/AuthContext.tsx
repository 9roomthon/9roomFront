import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

/**
 * 인증 컨텍스트 타입 정의
 *
 * @typedef {Object} AuthContextType
 * @property {{ name: string; email: string } | null} user - 사용자 정보 (이름과 이메일), 로그인되지 않은 경우 null
 * @property {(user: { name: string; email: string } | null) => void} setUser - 사용자 정보를 업데이트하는 함수
 */
interface AuthContextType {
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
}

/**
 * AuthContext 생성
 *
 * 사용자 인증 정보와 업데이트 함수가 포함된 컨텍스트를 생성합니다.
 * 초기 값은 undefined로 설정하여, AuthProvider 외부에서 사용 시 오류를 발생시킵니다.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider 컴포넌트
 *
 * 이 컴포넌트는 자식 컴포넌트에 인증 정보를 제공하는 컨텍스트 프로바이더 역할을 합니다.
 * Chrome Storage에서 사용자 정보를 로드하여 초기 인증 상태를 설정합니다.
 *
 * @param {Object} props - 컴포넌트의 속성
 * @param {ReactNode} props.children - 하위 컴포넌트
 * @returns {JSX.Element} 인증 컨텍스트를 제공하는 프로바이더 컴포넌트
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    // Chrome Storage에서 사용자 정보 가져오기
    chrome.storage.local.get("userInfo", (result) => {
      if (result.userInfo) {
        setUser(result.userInfo); // 사용자 정보가 존재하면 상태 업데이트
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth 훅
 *
 * 이 훅은 AuthContext에서 인증 정보를 가져와 반환합니다.
 * AuthProvider 내에서만 호출해야 하며, 그렇지 않으면 오류를 발생시킵니다.
 *
 * @returns {AuthContextType} 인증 상태 및 사용자 정보 설정 함수가 포함된 객체
 * @throws {Error} AuthProvider 외부에서 사용된 경우 오류 발생
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
