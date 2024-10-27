linkHistory.getLinks().then((links) => {
  document.querySelector('.alc-extension-popup').insertAdjacentHTML(
    'beforeend',
    `
      <section class="alc-extension-popup__links-block">
        <ul class="alc-extension-popup__list">
        </ul>
      </section>
    `,
  );
  const linksList = document.querySelector('.alc-extension-popup__list');

  if (!links.length) {
    return linksList.insertAdjacentHTML('afterbegin', '<div>This will display the history of your copied task links.</div>');
  }

  const linksListStr = links.map((link) => (`
    <li class="alc-extension-popup__item">
      <a class="alc-extension-popup__link" href="${link.url}" target="_blank">
        ${link.title}
      </a>
      <span class="alc-extension-popup__date">${link.date}</span>
    </li>
  `)).join('');

  linksList.insertAdjacentHTML('afterbegin', linksListStr);
}).catch((error) => {
  console.error('Error fetching links:', error);
});
