# xclip for crossplatform(mac, win, linux)

A crossplatform clipboard tools for copy & paste text, html and image.

## Requirements

- `xclip` command be required (Linux)
- `powershell` command be required (Win32)
- `pbpaste` command be required (Mac)

## Install dependencies

Install dependencies with npm:

```bash
npm i xclip --save
```

## Usage

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
