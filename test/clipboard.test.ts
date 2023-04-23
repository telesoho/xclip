jest.useRealTimers();
jest.unmock("../src/clipboard/win10");
import { getShell } from "../src/os";
import { ClipboardType, IClipboard } from "../src/clipboard_interface";
import { fileURLToPath,pathToFileURL, URL } from "node:url";
import * as fs from "fs";
import * as utils from "../src/utils";
import path from "path";
import { tmpdir } from "os";

const test_png = path.join(__dirname, `./test-data/test.png`);
const test_html = path.join(__dirname, `./test-data/test.html`);
const test_text = path.join(__dirname, `./test-data/test.txt`);
const test_png_url = pathToFileURL(test_png);
const test_html_url = pathToFileURL(test_html);
const test_text_url = pathToFileURL(test_text);


describe("clipboard tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("get clipboard type test text", async () => {
    const shell = getShell();
    const cb = shell.getClipboard();
    await cb.copyTextPlain(test_text_url);
    await cb.getContentType().then((val) => {
      expect(val).toBe(ClipboardType.Text);
    });
  });
  // it("get clipboard type test html", async () => {
  //   await clipboard.setHtmlToClipboard(test_html);
  //   await clipboard.getClipboardContentType().then((val) => {
  //     expect(val).toBe(clipboard.ClipboardType.Html);
  //   });
  // });
  // it("get clipboard type test png", async () => {
  //   const png = await clipboard.setImageToClipboard(test_png);
  //   expect(png).toBe(test_png);
  //   await clipboard.getClipboardContentType().then((val) => {
  //     expect(val).toBe(clipboard.ClipboardType.Image);
  //   });
  // });

  // it("get clipboard content test plain text", async () => {
  //   await clipboard.setTextToClipboard(test_text);
  //   await clipboard.getClipboardTextPlain().then((text) => {
  //     const text_content = fs.readFileSync(test_text, "utf8");
  //     expect(text).toBe(text_content);
  //   });
  // });

  // it("get clipboard content test html", async () => {
  //   await clipboard.setHtmlToClipboard(test_html);
  //   await clipboard.getClipboardTextHtml().then((html) => {
  //     const html_content = fs.readFileSync(test_html, "utf-8");
  //     expect(html.trim()).toBe(html_content.trim());
  //   });
  // });
  // it("get clipboard content test png", async () => {
  //   await clipboard.setImageToClipboard(test_png);
  //   const tmpfile = `${tmpdir()}/shell-test/data/test.png`;
  //   utils.prepareDirForFile(tmpfile);

  //   await clipboard.saveClipboardImageToFileAndGetPath(tmpfile).then((png_file) => {
  //     expect(png_file).toBe(tmpfile);
  //     expect(fs.existsSync(tmpfile)).toBe(true);
  //   });
  // });
});
