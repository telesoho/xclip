import { URL } from "url";
import { ClipboardType, IClipboard } from "../clipboard_interface";

export abstract class BaseClipboard implements IClipboard {
  abstract getImage(imagePath: string): Promise<string>;
  abstract getTextPlain(): Promise<string>;
  abstract getTextHtml(): Promise<string>;
  abstract copyImage(imageFile: URL): Promise<boolean>;
  abstract copyTextPlain(textFile: URL): Promise<boolean>;
  abstract copyTextHtml(htmlFile: URL): Promise<boolean>;
  abstract getContentType(): Promise<Set<ClipboardType> | ClipboardType>;

  abstract onDetectType(types: string[]): Set<ClipboardType>;

  detectType(types: string[]): Set<ClipboardType> | ClipboardType {
    if (!types) {
      return ClipboardType.Unknown;
    }

    const detectedTypes = this.onDetectType(types);
    if (detectedTypes.size == 1) {
      return detectedTypes.values().next().value;
    } else if (detectedTypes.size > 1) {
      return detectedTypes;
    }
    return ClipboardType.Unknown;
  }
}
