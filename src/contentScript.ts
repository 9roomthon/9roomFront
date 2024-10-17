chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addClickButton") {
    const button = document.createElement("button");
    button.textContent = "Click";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "9999";

    button.addEventListener("click", () => {
      alert("버튼이 클릭되었습니다!");
    });

    document.body.appendChild(button);
  }
});
