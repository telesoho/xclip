import * as os from "os";
import { spawn } from "child_process";
import isWsl from "is-wsl";
import { IClipboard } from "./clipboard_interface";
import { Win10Clipboard } from "./clipboard/win10";

export type Platform = "darwin" | "win32" | "win10" | "linux" | "wsl";

export function getCurrentPlatform(): Platform {
  const platform = process.platform;
  if (isWsl) {
    return "wsl";
  }
  if (platform === "win32") {
    const currentOS = os.release().split(".")[0];
    if (currentOS === "10") {
      return "win10";
    } else {
      return "win32";
    }
  } else if (platform === "darwin") {
    return "darwin";
  } else {
    return "linux";
  }
}

export function getShell(): IShell {
  const platform = getCurrentPlatform();
  switch (platform) {
    case "win10":
      return new Win10Shell();
    default:
      throw new Error("Unsupported platform");
  }
}

/**
 * Run command and get stdout
 * @param shell
 * @param options
 */
function runCommand(
  shell: string,
  options: string[],
  timeout = 10000
): Promise<string> {
  return new Promise((resolve, reject) => {
    let errorTriggered: boolean = false;
    let output: string = "";
    let errorMessage: string = "";
    let process = spawn(shell, options, { timeout });

    process.stdout.on("data", (chunk) => {
      output += `${chunk}`;
    });

    process.stderr.on("data", (chunk) => {
      errorMessage += `${chunk}`;
    });

    process.on("exit", (code, signal) => {
      if (process.killed) {
        console.log("Process took too long and was killed");
      }

      if (!errorTriggered) {
        if (code === 0) {
          resolve(output);
        } else {
          reject(errorMessage);
        }
      }
    });

    process.on("error", (error) => {
      errorTriggered = true;
      reject(error);
    });
  });
}

export interface IShell {
  runScript(script: string, parameters?: string[]): Promise<string>;
  getClipboard(): IClipboard;
}

class Win10Shell implements IShell {
  getClipboard(): IClipboard {
    return new Win10Clipboard();
  }
  async runScript(script: string, parameters: string[]): Promise<string> {
    const shell = "powershell";
    const command = [
      "-noprofile",
      "-noninteractive",
      "-nologo",
      "-sta",
      "-executionpolicy",
      "bypass",
      "-windowstyle",
      "hidden",
      "-file",
      script,
    ].concat(parameters);

    const stdout = await runCommand(shell, command);
    return stdout;
  }
}
