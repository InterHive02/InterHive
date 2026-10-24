/**
 * Client-side HTML and URL sanitization utilities to prevent XSS attacks.
 */

const ALLOWED_TAGS = new Set([
  'p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr', 'blockquote',
  'code', 'pre', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img'
]);

const ALLOWED_ATTRS = new Set([
  'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'className', 'target', 'rel'
]);

export function isSafeUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  // Reject dangerous schemes
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('data:text/html') ||
    trimmed.startsWith('data:application/')
  ) {
    return false;
  }
  // Allow safe protocols or relative links
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('mailto:')
  );
}

export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';
  if (typeof window === 'undefined' || !window.DOMParser) return dirty;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(dirty, 'text/html');

    const cleanNode = (node: Node) => {
      const childNodes = Array.from(node.childNodes);
      for (const child of childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement;
          const tagName = el.tagName.toLowerCase();

          if (!ALLOWED_TAGS.has(tagName)) {
            el.remove();
            continue;
          }

          // Filter attributes
          const attrs = Array.from(el.attributes);
          for (const attr of attrs) {
            const attrName = attr.name.toLowerCase();
            const attrVal = attr.value;

            // Remove all event handlers (onclick, onload, etc.)
            if (attrName.startsWith('on')) {
              el.removeAttribute(attr.name);
              continue;
            }

            if (!ALLOWED_ATTRS.has(attrName)) {
              el.removeAttribute(attr.name);
              continue;
            }

            // Check URL attributes
            if (attrName === 'href' || attrName === 'src') {
              if (!isSafeUrl(attrVal)) {
                el.removeAttribute(attr.name);
              }
            }
          }

          // If link, enforce secure rel attributes
          if (tagName === 'a') {
            el.setAttribute('rel', 'noopener noreferrer');
          }

          cleanNode(child);
        } else if (child.nodeType === Node.COMMENT_NODE) {
          child.remove();
        }
      }
    };

    cleanNode(doc.body);
    return doc.body.innerHTML;
  } catch (err) {
    console.error('HTML sanitization error:', err);
    return '';
  }
}
