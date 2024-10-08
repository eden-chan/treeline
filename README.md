# Treeline

Set of React components for Collaborative PDF annotation extending on [react-pdf-highlighter](https://github.com/agentcooper/react-pdf-highlighter) and using [InstantDB](https://github.com/instantdb) for collaborative highlights.


Features:

- Built on top of PDF.js
- Text and image highlights
- Popover text for highlights
- Scroll to highlights
- Real-time collaborative highlights using InstantDB

## Importing CSS

The bundled CSS include the CSS for pdfjs.

```tsx
import "treeline/dist/style.css";
```

## Stack
Vite + Bun + Biome (formatter) + InstantDB

## Example

See demo https://treeline.vercel.app/.

To run the example app locally:

```bash
npm install bun # install bun
bun i # install deps
bun run dev # start server
```

## Install

```bash
npm install treeline
```