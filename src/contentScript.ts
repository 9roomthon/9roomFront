import { CreateAxiosInstance } from "./shared/createAxiosInstance";

/**
 * 버튼을 생성하는 함수
 *
 * 주어진 텍스트, 위치 및 클릭 이벤트 핸들러를 사용하여 고정 위치에 버튼을 생성합니다.
 * 생성된 버튼은 문서의 body에 추가됩니다.
 *
 * @param {Object} config - 버튼 설정 객체
 * @param {string} config.text - 버튼에 표시될 텍스트
 * @param {Object} config.position - 버튼의 위치 정보
 * @param {string} config.position.bottom - 버튼의 하단 위치 (px 단위)
 * @param {string} config.position.right - 버튼의 우측 위치 (px 단위)
 * @param {Function} config.onClick - 버튼 클릭 시 실행될 콜백 함수
 * @returns {HTMLButtonElement} 생성된 버튼 요소
 */
function createButton({ text, position, onClick }) {
  const button = document.createElement("button");
  button.textContent = text;
  button.style.position = "fixed";
  button.style.bottom = position.bottom;
  button.style.right = position.right;
  button.style.zIndex = "9999";
  button.addEventListener("click", onClick);
  document.body.appendChild(button);
  return button;
}

/**
 * 요약 버튼을 생성하는 함수
 *
 * 주어진 텍스트와 위치에 따라 요약 버튼을 생성하며, 버튼 클릭 시 페이지의 텍스트를 요약합니다.
 * 요약 요청은 Axios 인스턴스를 통해 서버에 POST 요청으로 전달됩니다.
 *
 * @param {string} text - 버튼에 표시될 텍스트
 * @param {number} bottomPosition - 버튼의 하단 위치 (px 단위)
 * @param {string} summaryLength - 요약 길이 (short, medium, long 중 하나)
 */
function createSummaryButton(text, bottomPosition, summaryLength) {
  createButton({
    text: text,
    position: { bottom: `${bottomPosition}px`, right: "20px" },
    onClick: async () => {
      const textContent = document.body.innerText; // 페이지의 전체 텍스트 가져오기
      try {
        const axiosInstance = await CreateAxiosInstance();
        const response = await axiosInstance.post("/summarize", {
          text: textContent,
          summary_length: summaryLength,
        }); // 요약 기능 호출
        const summary = response.data.summarized_text;
        alert(summary); // 요약된 텍스트 표시
      } catch (error) {
        console.error("Error during summarization:", error);
      }
    },
  });
}

/**
 * Chrome 메시지 수신 이벤트 리스너
 *
 * 확장 프로그램이 메시지를 받을 때 "addClickButton" 작업이 요청되면, 번역 버튼 및 요약 버튼들을 생성합니다.
 *
 * @param {Object} request - 메시지의 요청 객체
 * @param {Object} sender - 메시지를 보낸 객체 정보
 * @param {Function} sendResponse - 응답 콜백 함수
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addClickButton") {
    // 번역 버튼 생성
    createButton({
      text: "번역하기",
      position: { bottom: "20px", right: "20px" },
      onClick: async () => {
        const textToTranslate = document.body.innerText;

        try {
          const axiosInstance = await CreateAxiosInstance();
          const response = await axiosInstance.post("/translate", {
            text: textToTranslate,
            targetLang: "ko",
          });

          // 번역된 텍스트를 문장 단위로 분할
          const translatedSentences = response.data.translated_text.split(". ");

          // 모든 텍스트 노드를 순서대로 업데이트하는 함수
          let sentenceIndex = 0;
          function replaceText(element) {
            if (
              element.childNodes.length === 0 &&
              element.nodeType === Node.TEXT_NODE
            ) {
              if (sentenceIndex < translatedSentences.length) {
                // 텍스트 노드일 경우 번역된 문장으로 교체
                element.textContent = translatedSentences[sentenceIndex] + ".";
                sentenceIndex++;
              }
            } else {
              // 자식 요소들에 대해 재귀적으로 함수 호출
              element.childNodes.forEach(replaceText);
            }
          }

          replaceText(document.body); // body 전체에 텍스트 교체 적용
        } catch (error) {
          console.error("Error during translation:", error);
        }
      },
    });

    // 요약 버튼들 생성
    const summaryButtons = [
      { text: "요약(짧게)", bottom: 50, length: "short" },
      { text: "요약(중간)", bottom: 80, length: "medium" },
      { text: "요약(길게)", bottom: 110, length: "long" },
    ];

    summaryButtons.forEach(({ text, bottom, length }) =>
      createSummaryButton(text, bottom, length)
    );
  }
});
