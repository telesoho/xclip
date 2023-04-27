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
  it("get clipboard type test html", async () => {
    const shell = getShell();
    const cb = shell.getClipboard();
    await cb.copyTextHtml(test_html_url);
    await cb.getContentType().then((val) => {
      expect(val).toBe(ClipboardType.Html);
    });    
  });
  it("get clipboard type test png", async () => {
    const shell = getShell();
    const cb = shell.getClipboard();
    await cb.copyImage(test_png_url);
    await cb.getContentType().then((val) => {
      expect(val).toBe(ClipboardType.Image);
    });
  });

  it("get clipboard content test plain text", async () => {
    const shell = getShell();
    const cb = shell.getClipboard();
    await cb.copyTextPlain(test_text_url);
    await cb.getTextPlain().then((text) => {
      const text_content = fs.readFileSync(test_text, "utf8");
      expect(text).toBe(text_content);
    });
  });

  it("get clipboard content test html", async () => {
    const shell = getShell();
    const cb = shell.getClipboard();
    await cb.copyTextHtml(test_html_url);
    await cb.getTextHtml().then((html) => {
      const html_content = fs.readFileSync(test_html, "utf8");
      expect(html).toBe(html_content);
    });
  });
  it("get clipboard content test png", async () => {
    const shell = getShell();
    const cb = shell.getClipboard();
    await cb.copyImage(test_png_url);

    const tmpfile = `${tmpdir()}/shell-test/data/test.png`;
    utils.prepareDirForFile(tmpfile);

    await cb.getImage(tmpfile).then((file) => {
      expect(file).toBe(tmpfile);
      expect(fs.existsSync(tmpfile)).toBe(true);
    });
  });
});
