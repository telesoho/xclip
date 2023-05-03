import { fileURLToPath, URL } from "node:url";
import { ClipboardType, IClipboard } from "../clipboard_interface";
import { getShell, runCommand } from "../os";
import * as path from "path";
import { stripFinalNewline } from "../utils";

async function pathToWin(path: string): Promise<string> {
  const newPath = await runCommand("wslpath", ["-m", path]);
  return stripFinalNewline(newPath);
}

async function pathToUnix(path: string): Promise<string> {
  const newPath = await runCommand("wslpath", ["-u", path]);
  return stripFinalNewline(newPath);
}

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

class WslClipboard implements IClipboard {
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
  async getContentType(): Promise<ClipboardType> {
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

      return detectType(types);
    } catch (e) {
      return ClipboardType.Unknown;
    }
  }
  async getImage(imagePath: string): Promise<string> {
    if (!imagePath) return "";
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "win32_save_clipboard_png.ps1"
    );
    const shell = getShell();
    const imagePathWin = await pathToWin(imagePath);
    const data: string = await shell.runScript(script, [imagePathWin]);
    if (stripFinalNewline(data) === imagePathWin) {
      return imagePath;
    }
    return data;
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

export { WslClipboard, detectType };
