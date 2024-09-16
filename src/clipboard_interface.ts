import { URL } from "node:url";
enum ClipboardType {
  Unknown = "unknown",
  Html = "html",
  Text = "text",
  Image = "image",
}

interface IClipboard {
  getContentType(): Promise<Set<ClipboardType> | ClipboardType>;
  getImage(imagePath: string): Promise<string>;
  getTextPlain(): Promise<string>;
  getTextHtml(): Promise<string>;
  copyImage(imageFile: URL): Promise<boolean>;
  copyTextPlain(textFile: URL): Promise<boolean>;
  copyTextHtml(htmlFile: URL): Promise<boolean>;
}

export { ClipboardType, IClipboard };
