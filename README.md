````
# 번역 프로그램 Chrome Extension

이 프로젝트는 Chrome 확장 프로그램으로, 웹페이지에서 번역과 요약 기능을 제공합니다. Google OAuth2를 사용하여 로그인하고, 페이지 내 텍스트를 번역하거나 요약 버튼을 통해 다양한 길이로 요약할 수 있습니다.

## 기능

- **Google OAuth2 로그인**: Google 계정으로 로그인하여 인증을 수행합니다.
- **번역 버튼**: 클릭 시 현재 페이지의 텍스트를 한국어로 번역합니다.
- **요약 버튼**: 다양한 요약 길이(짧게, 중간, 길게)를 선택하여 페이지 텍스트를 요약합니다.
- **JWT 토큰 관리**: Google 액세스 토큰을 서버로 전송하여 JWT 토큰을 획득하고, Chrome Storage에 저장합니다.

## 설치

1. **의존성 설치**
   프로젝트의 루트 디렉터리에서 다음 명령어를 실행하여 필요한 의존성을 설치합니다.

   ```bash
   npm install
````

2. **Chrome 확장 프로그램 로드**
   - `dist` 폴더에 빌드된 확장 프로그램을 Chrome에 로드합니다.
   - Chrome에서 `chrome://extensions/`로 이동하고, `개발자 모드`를 활성화한 후 `압축 해제된 확장 프로그램을 로드합니다` 버튼을 클릭하여 `dist` 폴더를 선택합니다.

## 사용 방법

1. **로그인**

   - 확장 프로그램에서 "구글로 로그인" 버튼을 클릭하여 Google OAuth2 인증을 통해 로그인합니다.
   - 로그인 후, 사용자 이름과 이메일이 화면에 표시됩니다.

2. **번역 기능**

   - 웹페이지에서 `번역하기` 버튼을 클릭하면 페이지의 모든 텍스트가 한국어로 번역됩니다.

3. **요약 기능**
   - `요약(짧게)`, `요약(중간)`, `요약(길게)` 버튼을 통해 페이지의 텍스트를 요약할 수 있습니다.
   - 선택한 버튼에 따라 텍스트가 요약되어 팝업으로 표시됩니다.

## 주요 코드 설명

### `AuthProvider`

`AuthProvider`는 Google OAuth2 로그인 상태를 관리하며, Chrome Storage에서 로그인 정보를 가져와 전역 상태로 제공합니다.

### `GoogleLogin` 컴포넌트

- Google OAuth2 인증을 통해 로그인, 로그아웃을 처리하며, 인증된 사용자 정보를 `AuthProvider`의 상태로 업데이트합니다.
- `sendAccessTokenToServer` 함수를 통해 서버로 토큰을 전송하고, JWT 토큰을 Chrome Storage에 저장합니다.

### `createButton` 및 `createSummaryButton`

- `createButton`: 주어진 위치와 텍스트로 고정 위치 버튼을 생성합니다.
- `createSummaryButton`: 클릭 시 페이지 텍스트를 요약하는 버튼을 생성합니다.

### `Axios Instance` 설정

`CreateAxiosInstance` 함수를 통해 Axios 인스턴스를 설정하고, 요청 시마다 JWT 토큰을 포함하여 API 요청을 보냅니다.

## 디렉터리 구조

```
- dist
- node_modules
- public
  - background.js
  - manifest.json
- src
  - shared
    - createAxiosInstance.ts
  - App.css
  - App.tsx
  - AuthContext.tsx
  - contentScript.ts
  - GoogleLogin.tsx
```

## 의존성

- `axios`: API 요청을 위한 HTTP 클라이언트
- `React`: 사용자 인터페이스 라이브러리
- `Chrome Identity API`: Chrome 확장 프로그램의 인증을 위한 API

## 기여

이 프로젝트에 기여하고 싶으신 경우, PR을 제출하시거나 이슈를 등록해주세요.

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 `LICENSE` 파일을 참고해주세요.

```

이 `README.md` 파일은 프로젝트의 주요 기능과 파일 구조를 설명하며, 설치 및 사용 방법을 안내합니다.
```
