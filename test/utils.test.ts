jest.unmock("../src/utils");
import * as fs from "fs";
import { tmpdir } from "os";
import * as utils from "../src/utils";

describe("Utils test", () => {

  it("download test", async () => {
    let target_file = `${tmpdir()}/out_test/data/abc/test.png`;
    expect(utils.prepareDirForFile(target_file)).toBe(true);
  });
});
