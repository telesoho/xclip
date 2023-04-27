import { URL } from "node:url";
enum ClipboardType {
  Unknown = -1,
  Html = 0,
  Text,
  Image,
}

interface IClipboard {
  getContentType(): Promise<ClipboardType>;
  getImage(imagePath:string): Promise<string>;
  getTextPlain(): Promise<string>;
  getTextHtml(): Promise<string>;
  copyImage(imageFile: URL): Promise<boolean>;
  copyTextPlain(textFile: URL): Promise<boolean>;
  copyTextHtml(htmlFile: URL): Promise<boolean>;
}

export { ClipboardType, IClipboard };
