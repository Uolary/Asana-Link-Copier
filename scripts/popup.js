linkStorage.getLinks().then((links) => {
  const linksList = document.querySelector('.alc-extension-popup_list');

  console.log('linksBlock', links);

  if (!links.length) {
    return linksList.insertAdjacentHTML('afterbegin', '<div>This will display the history of your copied task links.</div>');
  }

  const linksListStr = links.map((link) => (`
    <li class="alc-extension-popup_item">
      <a class="alc-extension-popup_link" href="${link.url}" target="_blank">
        ${link.title}
      </a>
      <span class="alc-extension-popup_date">${link.date}</span>
    </li>
  `)).join('');

  linksList.insertAdjacentHTML('afterbegin', linksListStr);
}).catch((error) => {
  console.error('Error fetching links', error);
});
