import { fileURLToPath, URL } from "node:url";
import { ClipboardType, IClipboard } from "../clipboard_interface";
import { getShell } from "../os";
import * as path from "path";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
/**
 * Detected the type of content in the clipboard
 * Detect order: Image > Html > Text
 * @param types string[]
 * @returns ClipboardType
 */
function detectType(types: string[]): ClipboardType {
  if (!types) {
    return ClipboardType.Unknown;
  }

  const detectedTypes = new Set();
  for (const type of types) {
    switch (type) {
      case "PNG":
      case "Bitmap":
      case "DeviceIndependentBitmap":
        detectedTypes.add(ClipboardType.Image);
        break;
      case "HTML Format":
        detectedTypes.add(ClipboardType.Html);
        break;
      case "Text":
      case "UnicodeText":
        detectedTypes.add(ClipboardType.Text);
        break;
    }
  }
  // Set priority based on which to return type
  const priorityOrdering = [
    ClipboardType.Image,
    ClipboardType.Html,
    ClipboardType.Text,
  ];
  for (const type of priorityOrdering) if (detectedTypes.has(type)) return type;
  // No known types detected
  return ClipboardType.Unknown;
}

class Win10Clipboard implements IClipboard {
  copyImage(imageFile: URL): Promise<Boolean> {
    throw new Error("Method not implemented.");
  }
  async copyTextPlain(textFile: URL): Promise<Boolean> {
    const textFilePath = fileURLToPath(textFile);
    const script = path.join(__dirname, "../../res/scripts/", "win32_set_clipboard_text_plain.ps1");
    const params = [textFilePath]

    try {
      const shell = getShell();
      await shell.runScript(script, params);
      return true;
    } catch (e) {
      return false;
    }      
  }
  copyTextHtml(htmlFile: URL): Promise<Boolean> {
    throw new Error("Method not implemented.");
  }
  async getContentType(): Promise<ClipboardType> {
    const script = path.join(__dirname, "../../res/scripts/", "win32_get_clipboard_content_type.ps1");
    try {
      const shell = getShell();

      let data = await shell.runScript(script);
      console.debug("getClipboardContentType", data);
      let types = data.split(/\r\n|\n|\r/);

      return detectType(types);
    } catch (e) {
      return ClipboardType.Unknown;
    }
  }
  getImage(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getTextPlain(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getTextHtml(): Promise<string> {
    throw new Error("Method not implemented.");
  }

}

export { Win10Clipboard, detectType};
