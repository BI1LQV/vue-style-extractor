import * as vscode from "vscode"
export async function getTabSize(): Promise<number> {
  let allSettings = await vscode.workspace.getConfiguration()
  return allSettings?.editor?.tabSize
}
