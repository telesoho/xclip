import { fileURLToPath, URL } from "node:url";
import { ClipboardType, IClipboard } from "../clipboard_interface";
import { getShell } from "../os";
import * as path from "path";
import { stripFinalNewline } from "../utils";
import { BaseClipboard } from "./base_clipboard";

function darwin_HextoHtml(str: string) {
  const regex = /«data HTML(.*?)»/;

  // Alternative syntax using RegExp constructor
  // const regex = new RegExp('«data HTML(.*?)»', '')

  const subst = `$1`;

  // The substituted value will be contained in the result variable
  const data = str.replace(regex, subst);

  const buff = Buffer.from(data, "hex");
  return buff.toString("utf8");
}

class DarwinClipboard extends BaseClipboard {
  SCRIPT_PATH = "../../res/scripts/";

  async copyImage(imageFile: URL): Promise<boolean> {
    const imageFilePath = fileURLToPath(imageFile);
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "darwin_set_clipboard_png.applescript"
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
      "darwin_set_clipboard_text_plain.applescript"
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
      "darwin_set_clipboard_text_html.applescript"
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
        case "Text":
          detectedTypes.add(ClipboardType.Text);
          break;
        case "HTML":
          detectedTypes.add(ClipboardType.Html);
          break;
        case "Image":
          detectedTypes.add(ClipboardType.Image);
          break;
      }
    }
    return detectedTypes;
  }

  async getContentType(): Promise<Set<ClipboardType> | ClipboardType> {
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "darwin_get_clipboard_content_type.applescript"
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
      "darwin_save_clipboard_png.applescript"
    );
    const shell = getShell();
    const data: string = await shell.runScript(script, [imagePath]);
    return stripFinalNewline(data);
  }

  async getTextPlain(): Promise<string> {
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "darwin_get_clipboard_text_plain.applescript"
    );
    const shell = getShell();
    const data: string = await shell.runScript(script);
    return stripFinalNewline(data);
  }

  async getTextHtml(): Promise<string> {
    const script = path.join(
      __dirname,
      this.SCRIPT_PATH,
      "darwin_get_clipboard_text_html.applescript"
    );
    const shell = getShell();
    const data: string = await shell.runScript(script);
    return darwin_HextoHtml(stripFinalNewline(data));
  }
}

export { DarwinClipboard };
