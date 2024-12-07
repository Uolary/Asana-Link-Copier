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

const copyToClipboard = (url, title, isShiftKey) => {
  const textPlain = isShiftKey ? `=HYPERLINK("${url}";"${title}")` : title;
  const textHtml = `<a href="${url}" target="_blank">${title}</a>`;

  navigator.clipboard.write([
    new ClipboardItem({
      'text/plain': new Blob([textPlain], {type: 'text/plain'}),
      'text/html': new Blob([textHtml], {type: 'text/html'})
    }),
  ]).catch(err => {
    console.error('Failed to copy:', err);
  });
};

const extensionBtn = `
  <div role="button" aria-label="Copy task link" class="alc-extension__btn" tabindex="0">
    <svg viewBox="2 2 20 20" class="alc-extension__icon" focusable="false">
      <path class="alc-extension__icon-path alc-extension__icon-path_gray" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M17.5 14H19C20.1046 14 21 13.1046 21 12V5C21 3.89543 20.1046 3 19 3H12C10.8954 3 10 3.89543 10 5V6.5M5 10H12C13.1046 10 14 10.8954 14 12V19C14 20.1046 13.1046 21 12 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10Z" />
    </svg>
  </div>
`;

const toast = `
  <div class="alc-extension-toast alc-extension-toast__enter">
    <div class="alc-extension-toast__container" role="alert" tabindex="-1">
      <div class="alc-extension-toast__text">Link copied</div>
    </div>
  </div>
`;

waitForElement('.TaskPaneToolbar.TaskPane-header', (el) => {
  if (!el.querySelector('.alc-extension__btn')) {
    const firstOptionElement = el.querySelector('.SubtleHeartButton.TaskPaneToolbar-button');

    firstOptionElement.insertAdjacentHTML("beforebegin", extensionBtn);

    el.querySelector('.alc-extension__btn').addEventListener('click', (event) => {
      const iconPath = el.querySelector('.alc-extension__icon-path');

      const taskUrl = window.location.href;
      let taskTitle = document.querySelector('.SimpleTextarea[aria-label="Task Name"]')?.value;

      if (!taskTitle) {
        taskTitle = document.querySelector('.TaskPaneTitle .ReadOnlyTitleInput-name')?.textContent;
      }

      copyToClipboard(taskUrl, taskTitle, event.shiftKey);

      iconPath.classList.remove('alc-extension__icon-path_gray');
      iconPath.classList.add('alc-extension__icon-path_green');

      document.querySelector('.DefaultToastGroup').insertAdjacentHTML('afterbegin', toast);

      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString([], {timeStyle: 'short'});

      linkHistory.addLink(
        {
          url: taskUrl,
          title: taskTitle,
          date: `${currentDate} ${currentTime}`,
        },
      ).then(() => {
        console.log(`The link ${taskUrl} was copied to the clipboard.`);
      });

      setTimeout(() => {
        const toastElement = document.querySelector('.DefaultToastGroup .alc-extension-toast');

        toastElement.classList.remove('alc-extension-toast__enter');
        toastElement.classList.add('alc-extension-toast__exit');

        iconPath.classList.remove('alc-extension__icon-path_green');
        iconPath.classList.add('alc-extension__icon-path_gray');

        setTimeout(() => {
          toastElement.remove();
        }, 1000);
      }, 5000);
    });
  }
}, {
  once: false,
});
