import { fileURLToPath, URL } from "node:url";
import { ClipboardType, IClipboard } from "../clipboard_interface";
import { getShell } from "../os";
import * as path from "path";
import { stripFinalNewline } from "../utils";
import { BaseClipboard } from "./base_clipboard";

class Win10Clipboard extends BaseClipboard {
  SCRIPT_PATH = "../../res/scripts/";

  async copyImage(imageFile: URL): Promise<boolean> {
    const imageFilePath = fileURLToPath(imageFile);
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "win32_set_clipboard_png.ps1"
    );
    const params = [imageFilePath];

    try {
      const shell = getShell();
      await shell.runScript(script, params);
      return true;
    } catch (e) {
      return false;
    }
  }
  async copyTextPlain(textFile: URL): Promise<boolean> {
    const textFilePath = fileURLToPath(textFile);
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "win32_set_clipboard_text_plain.ps1"
    );
    const params = [textFilePath];

    try {
      const shell = getShell();
      await shell.runScript(script, params);
      return true;
    } catch (e) {
      return false;
    }
  }
  async copyTextHtml(htmlFile: URL): Promise<boolean> {
    const htmlFilePath = fileURLToPath(htmlFile);
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "win32_set_clipboard_text_html.ps1"
    );
    const params = [htmlFilePath];

    try {
      const shell = getShell();
      await shell.runScript(script, params);
      return true;
    } catch (e) {
      return false;
    }
  }
  onDetectType(types: string[]): Set<ClipboardType> {
    const detectedTypes = new Set<ClipboardType>();
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
    return detectedTypes;
  }
  async getContentType(): Promise<Set<ClipboardType> | ClipboardType> {
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "win32_get_clipboard_content_type.ps1"
    );
    try {
      const shell = getShell();

      const data = await shell.runScript(script);
      console.debug("getClipboardContentType", data);
      const types = data.split(/\r\n|\n|\r/);

      return this.detectType(types);
    } catch (e) {
      return ClipboardType.Unknown;
    }
  }
  async getImage(imagePath: string): Promise<string> {
    if (!imagePath) return "";
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "win10_save_clipboard_png.ps1"
    );
    const shell = getShell();
    const data: string = await shell.runScript(script, [imagePath]);
    return stripFinalNewline(data);
  }

  async getTextPlain(): Promise<string> {
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "win32_get_clipboard_text_plain.ps1"
    );
    const shell = getShell();
    const data: string = await shell.runScript(script);
    return stripFinalNewline(data);
  }

  async getTextHtml(): Promise<string> {
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "win32_get_clipboard_text_html.ps1"
    );
    const shell = getShell();
    const data: string = await shell.runScript(script);
    return stripFinalNewline(data);
  }
}

export { Win10Clipboard };
