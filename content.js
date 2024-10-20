const waitForElement = (selector, callback, options = { once: true }) => {
  const observer = new MutationObserver((mutations, obs) => {
    const element = document.querySelector(selector);

    if (element) {
      callback(element);

      if (options.once) {
        obs.disconnect();
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

const copyToClipboard = (url, title) => {
  const html = `<a href="${url}" target="_blank">${title}</a>`;

  navigator.clipboard.write([
    new ClipboardItem({
      'text/plain': new Blob([title], {type: 'text/plain'}),
      'text/html': new Blob([html], {type: 'text/html'})
    })
  ]).catch(err => {
    console.error('Failed to copy: ', err);
  });
};

const extensionBtn = `
  <div role="button" aria-label="Copy task link" class="alc-extension-btn IconButtonThemeablePresentation--isEnabled IconButtonThemeablePresentation IconButtonThemeablePresentation--medium SubtleIconButton--standardTheme SubtleIconButton TaskPaneToolbar-button TaskPaneToolbar-copyLinkButton" tabindex="0">
    <svg viewBox="0 0 24 24" fill="none" class="Icon LinkIcon" focusable="false">
      <path stroke="#6d6e6f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M17.5 14H19C20.1046 14 21 13.1046 21 12V5C21 3.89543 20.1046 3 19 3H12C10.8954 3 10 3.89543 10 5V6.5M5 10H12C13.1046 10 14 10.8954 14 12V19C14 20.1046 13.1046 21 12 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10Z" />
    </svg>
  </div>
`;

waitForElement('.TaskPaneToolbar.TaskPane-header', (el) => {
  if (!el.querySelector('.alc-extension-btn')) {
    const firstOptionElement = el.querySelector('.SubtleHeartButton.TaskPaneToolbar-button');

    firstOptionElement.insertAdjacentHTML("beforebegin", extensionBtn);

    el.querySelector('.alc-extension-btn').addEventListener('click', () => {
      const svgPath = el.querySelector('.alc-extension-btn path');

      const taskUrl = window.location.href;
      const taskTitle = document.querySelector('.simpleTextarea[aria-label="Task Name"]').value;

      copyToClipboard(taskUrl, taskTitle);

      svgPath.style.stroke = '#58a182';

      setTimeout(() => {
        svgPath.style.stroke = '#6d6e6f';
      }, 5000);
    });
  }
}, {
  once: false,
});
