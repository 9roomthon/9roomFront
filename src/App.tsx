import React from "react";
import GoogleLogin from "./GoogleLogin";
import { AuthProvider } from "./AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div>
        <h1>번역 프로그램</h1>
        <GoogleLogin />
      </div>
    </AuthProvider>
  );
};

export default App;
