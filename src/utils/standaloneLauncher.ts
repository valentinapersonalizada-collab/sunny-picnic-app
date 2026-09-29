// Utility to launch the Storybook in a standalone browser tab (via same-origin Blob document)
// or toggle native Fullscreen mode, bypassing AI Studio's iframe-only proxy restriction on top-level URLs.

let currentBlobUrl: string | null = null;

export function buildStandaloneBlobUrl(): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return '#';
  }

  const origin = window.location.origin;

  // Collect all active <style> and <link rel="stylesheet"> from the live document head
  const styleNodes = Array.from(
    document.head.querySelectorAll('style, link[rel="stylesheet"], link[rel="preconnect"]')
  );
  const serializedStyles = styleNodes
    .map((node) => {
      if (node.tagName.toLowerCase() === 'link') {
        const link = node.cloneNode(true) as HTMLLinkElement;
        const rawHref = link.getAttribute('href');
        if (rawHref && rawHref.startsWith('/')) {
          link.setAttribute('href', `${origin}${rawHref}`);
        }
        return link.outerHTML;
      }
      return node.outerHTML;
    })
    .join('\n');

  // Find module scripts in the live document (works in both Vite dev and production builds)
  const moduleScripts = Array.from(
    document.querySelectorAll<HTMLScriptElement>('script[type="module"][src]')
  );

  const scriptTags = moduleScripts
    .filter((s) => {
      const src = s.getAttribute('src') || '';
      return !src.includes('@vite/client');
    })
    .map((s) => {
      const rawSrc = s.getAttribute('src') || '/src/main.tsx';
      const fullSrc = rawSrc.startsWith('http')
        ? rawSrc
        : `${origin}${rawSrc.startsWith('/') ? '' : '/'}${rawSrc}`;
      return `<script type="module" src="${fullSrc}"></script>`;
    })
    .join('\n');

  const fallbackEntryScript =
    scriptTags || `<script type="module" src="${origin}/src/main.tsx"></script>`;

  const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <base href="${origin}/" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
    <title>${document.title || 'Sunny Picnic Storybook'}</title>
    <link rel="icon" type="image/svg+xml" href="${origin}/icon.svg" />
    ${serializedStyles}
    <script>
      window.$RefreshReg$ = function() {};
      window.$RefreshSig$ = function() { return function(type) { return type; }; };
      window.__vite_plugin_react_preamble_installed__ = true;
    </script>
  </head>
  <body class="bg-[#FDFBF7] text-[#1E293B] antialiased selection:bg-amber-200 selection:text-slate-900">
    <div id="root"></div>
    ${fallbackEntryScript}
  </body>
</html>`;

  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
  }
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  currentBlobUrl = URL.createObjectURL(blob);
  return currentBlobUrl;
}

export async function toggleBrowserFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return true;
    } else {
      await document.exitFullscreen();
      return false;
    }
  } catch {
    return false;
  }
}
