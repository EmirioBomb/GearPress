// Lucide (ISC), from https://api.iconify.design/lucide.json; bundled for offline controls.
const paths = {
  previous: 'm15 18l-6-6l6-6',
  next: 'm9 18l6-6l-6-6',
  original: 'M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  close: 'M18 6L6 18M6 6l12 12',
  expand: 'm15 15l6 6M15 9l6-6m0 13v5h-5m5-13V3h-5M3 16v5h5m-5 0l6-6M3 8V3h5m1 6L3 3',
}

function pathIcon(path: string) {
  return { width: 24, height: 24, body: `<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${path}"/>` }
}

export const galleryIcons = {
  previous: pathIcon(paths.previous),
  next: pathIcon(paths.next),
  original: pathIcon(paths.original),
  close: pathIcon(paths.close),
  expand: pathIcon(paths.expand),
  images: {
    width: 24, height: 24,
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m22 11l-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="13" cy="7" r="1" fill="currentColor"/><rect width="14" height="14" x="8" y="2" rx="2"/></g>',
  },
  unavailable: {
    width: 24, height: 24,
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m2 2l20 20M10.41 10.41a2 2 0 1 1-2.83-2.83m5.92 5.92L6 21m12-9l3 3"/><path d="M3.59 3.59A2 2 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59M21 15V5a2 2 0 0 0-2-2H9"/></g>',
  },
}
