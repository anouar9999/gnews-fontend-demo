export function fmtEdited(iso) {
  if (!iso) {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function uuid() { return crypto.randomUUID(); }

export function htmlEmpty(html) {
  if (!html) return true;
  return html.replace(/<[^>]+>/g, '').trim() === '';
}

export function serializeBlocks(blocks) {
  return blocks.map(b => {
    if (b.type === 'text') {
      if (htmlEmpty(b.content)) return '';
      return b.content;
    }
    if (b.type === 'image') {
      if (!b.url) return '';
      const cap = b.caption ? `<figcaption>${b.caption}</figcaption>` : '';
      const txt = !htmlEmpty(b.content) ? b.content : '';
      return `<figure><img src="${b.url}" alt="${b.alt || ''}">${cap}</figure>${txt}`;
    }
    if (b.type === 'video') {
      if (!b.url) return '';
      const cap = b.caption ? `<figcaption>${b.caption}</figcaption>` : '';
      const txt = !htmlEmpty(b.content) ? b.content : '';
      const isEmbed = /youtube\.com|youtu\.be|vimeo\.com/.test(b.url);
      const media = isEmbed
        ? `<iframe src="${b.url}" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0"></iframe>`
        : `<video src="${b.url}" controls style="width:100%"></video>`;
      return `<figure>${media}${cap}</figure>${txt}`;
    }
    return '';
  }).filter(Boolean).join('\n');
}

export function initBlocksFromContent(content) {
  if (!content) return [{ id: uuid(), type: 'text', content: '' }];
  return [{ id: uuid(), type: 'text', content }];
}
