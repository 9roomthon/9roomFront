// 1. 버튼 요소 생성
const button = document.createElement("button");

// 2. 버튼에 텍스트 추가
button.innerText = "Click Me";

// 3. 버튼 스타일 설정
button.style.position = "fixed"; // 고정 위치 설정
button.style.bottom = "20px"; // 하단에서 20px 위로
button.style.right = "20px"; // 오른쪽에서 20px 왼쪽으로
button.style.padding = "10px 20px"; // 버튼 크기 설정
button.style.backgroundColor = "skyblue";
button.style.zIndex = "999999";
// 4. 버튼 이벤트 리스너 추가
button.addEventListener("click", function () {
  alert("버튼이 클릭되었습니다!");
});

// 5. 버튼을 body에 추가
document.body.appendChild(button);
