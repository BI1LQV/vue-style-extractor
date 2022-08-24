import * as vscode from "vscode"
export async function getTabSize(): Promise<number> {
  let allSettings = await vscode.workspace.getConfiguration()
  return allSettings?.editor?.tabSize ?? 4
}
export function appendStyle(
  editBuilder: vscode.TextEditorEdit,
  document: vscode.TextDocument,
  styles: string,
  searchQuery: string,
  tabSize: number
) {
  // insert new class into <style>
  let newStyleString = styles.split(";")
    .map(s => " ".repeat(tabSize) + s.trim()).join(";\n")
  const maybeAppendPos = document.getText().match(/<style.*>[\w\W]*<\/style>/)
  if (!maybeAppendPos) {
    editBuilder.insert(
      document.lineAt(document.lineCount - 1).range.end,
      `\n<style>\n${searchQuery}{\n${newStyleString}\n}\n</style>\n`
    )
  } else {
    editBuilder.insert(
      document.positionAt(maybeAppendPos.index! + maybeAppendPos[0].length - 8),
    `\n${searchQuery}{\n${newStyleString}\n}\n`
    )
  }
}

export function parseQuery(searchQuery: string) {
  let target: { type: "id" | "class"; value: string } | null = null
  let className = searchQuery.match(/\.(?<name>[a-zA-Z-_]+)$/)?.groups?.name
  let idName = searchQuery.match(/#(?<name>[a-zA-Z-_]+)$/)?.groups?.name

  if (className) {
    target = {
      type: "class",
      value: className,
    }
  }
  if (idName) {
    target = {
      type: "id",
      value: idName,
    }
  }
  return target
}
