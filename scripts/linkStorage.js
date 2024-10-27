const linkStorage = {
  storageKey: 'alc-extension-link-history',
  maxSizeBytes: 5 * 1024 * 1024, // 5 MB limit

  getLinks: function() {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.storageKey], (result) => {
        resolve(result[this.storageKey] ? JSON.parse(result[this.storageKey]) : []);
      });
    });
  },

  addLink: async function(newLink) {
    const links = await this.getLinks();

    const updatedLinks = [
      newLink,
      ...links,
    ];

    this._saveLinks(updatedLinks);
  },

  _saveLinks: async function(links) {
    const dataSize = await this.getStorageSizeBytes();

    while (dataSize > this.maxSizeBytes && links.length) {
      links.slice(10)
    }

    try {
      await chrome.storage.local.set({[this.storageKey]: JSON.stringify(links)});
    } catch (error) {
      console.error('Error saving links to storage', error);
    }
  },

  getStorageSizeBytes: async function() {
    const data = await new Promise((resolve) => {
      chrome.storage.local.get([this.storageKey], (result) => {
        resolve(result[this.storageKey] || '');
      });
    });

    return data ? new TextEncoder().encode(data).length : 0;
  },
};
