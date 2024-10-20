const waitForElement = (selector, callback) => {
  const observer = new MutationObserver((mutations, obs) => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

const extensionBtn = `
  <div aria-describedby="lui_1009" role="button" aria-label="Copy task link" class="alc-extension-btn IconButtonThemeablePresentation--isEnabled IconButtonThemeablePresentation IconButtonThemeablePresentation--medium SubtleIconButton--standardTheme SubtleIconButton TaskPaneToolbar-button TaskPaneToolbar-copyLinkButton" tabindex="0">
    <svg viewBox="0 0 24 24" fill="none" class="Icon LinkIcon" focusable="false">
      <path stroke="#6d6e6f" d="M17.5 14H19C20.1046 14 21 13.1046 21 12V5C21 3.89543 20.1046 3 19 3H12C10.8954 3 10 3.89543 10 5V6.5M5 10H12C13.1046 10 14 10.8954 14 12V19C14 20.1046 13.1046 21 12 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
`;

waitForElement('.TaskPaneToolbar.TaskPane-header ', (el) => {
  const firstOptionElement = document.querySelector('.SubtleHeartButton.TaskPaneToolbar-button');

  firstOptionElement.insertAdjacentHTML("beforebegin", extensionBtn);

  document.querySelector('.alc-extension-btn').addEventListener('click', () => {
    console.log('yes');
  });
});
