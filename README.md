# xclip for crossplatform(mac, win, linux)

A crossplatform xclip tools for copy & paste text, html and image.


## Requirements

- `xclip` command be required (Linux)
- `powershell` command be required (Win32)
- `pbpaste` command be required (Mac)

## Install dependencies

Install dependencies with npm:

```bash
npm i
```

## Test

Test your code with Jest framework:

```bash
npm run test
```

## Build

Build production (distribution) files in your **dist** folder:

```bash
npm run build
```

It generates CommonJS (in **dist/cjs** folder), ES Modules (in **dist/esm** folder), as well as TypeScript declaration files (in **dist/types** folder).


## Samples

please see the unit test:

```ts
import xclip from 'xclip'

const shell = xclip.getShell();
const cb = shell.getClipboard();
const cbtype = await cb.getContentType();

switch(cbtype) {
  case xclip.ClipboardType.Html:
    const html = await cb.getTextHtml();
    break;
  case xclip.ClipboardType.Text:
    const text = await cb.getTextPlain();
    break;
  case xclip.ClipboardType.Image:
    const currentPath = process.cwd();
    const pngfile = `${currentPath}/pasted.png`;
    await cb.getImage(pngfile);
    break;
  case xclip.ClipboardType.Unknown:
    console.log("Unknown type");
    break;
}
```
