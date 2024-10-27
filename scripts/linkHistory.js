const linkHistory = {
  storageKey: 'alc-extension-link-history',
  maxSizeBytes: 5 * 1024 * 1024, // 5 MB limit

  getLinks: async function() {
    try {
      const result = await chrome.storage.local.get([this.storageKey]);

      return result[this.storageKey] ? JSON.parse(result[this.storageKey]) : [];
    } catch (error) {
      console.error('Error retrieving links from storage:', error);

      return [];
    }
  },

  addLink: async function(newLink) {
    const links = await this.getLinks();
    const updatedLinks = [newLink, ...links];

    await this._saveLinks(updatedLinks);
  },

  _saveLinks: async function(links) {
    let storageSize = this._getStorageSizeBytes(JSON.stringify(links));

    while (storageSize > this.maxSizeBytes && links.length) {
      links.splice(-10);

      storageSize = this._getStorageSizeBytes(JSON.stringify(links));
    }

    try {
      await chrome.storage.local.set({[this.storageKey]: JSON.stringify(links)});
    } catch (error) {
      console.error('Error saving links to storage:', error);
    }
  },

  _getStorageSizeBytes: function(data) {
    return new TextEncoder().encode(data).length ?? 0;
  },
};
