import axios, { AxiosRequestConfig } from "axios";

/**
 * API 기본 URL 설정
 * @constant {string}
 */
const API_BASE_URL = "http://localhost:8080/";

/**
 * Axios 인스턴스를 생성하는 함수
 *
 * 주어진 옵션과 Chrome 스토리지에 저장된 JWT 토큰을 포함한 설정으로 Axios 인스턴스를 생성합니다.
 *
 * @param {AxiosRequestConfig} [options] - Axios 요청에 대한 추가 옵션 (선택 사항)
 * @returns {Promise<import("axios").AxiosInstance>} Axios 인스턴스를 반환하는 Promise
 */
export const CreateAxiosInstance = async (options?: AxiosRequestConfig) => {
  let accessToken = "";

  /**
   * Chrome 스토리지에서 JWT 토큰을 비동기적으로 가져옵니다.
   * Chrome 환경에서만 실행되며, 토큰을 가져온 후 Promise가 resolve됩니다.
   */
  if (chrome && chrome.storage) {
    await new Promise<void>((resolve) => {
      chrome.storage.local.get(["jwtToken"], (result) => {
        accessToken = result.jwtToken;
        resolve();
      });
    });
  }

  /**
   * Axios 인스턴스를 생성합니다.
   * - 기본 URL: API_BASE_URL
   * - 사용자 정의 옵션 포함
   * - Authorization 헤더에 'Bearer' 타입의 액세스 토큰 포함
   */
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return axiosInstance;
};
