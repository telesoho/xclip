import {URL } from "node:url";
enum ClipboardType {
  Unknown = -1,
  Html = 0,
  Text,
  Image,
}


interface IClipboard {
  getContentType(): Promise<ClipboardType>;
  getImage(): Promise<string>;
  getTextPlain(): Promise<string>;
  getTextHtml(): Promise<string>;
  copyImage(imageFile: URL): Promise<Boolean>;
  copyTextPlain(textFile: URL): Promise<Boolean>;
  copyTextHtml(htmlFile: URL): Promise<Boolean>;
}



export { 
  ClipboardType,IClipboard
};
