import MagicString from "magic-string"
import * as vscode from "vscode"
import { getTabSize } from "./utils"
export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("vue-style-extractor.extractStyle", async () => {
    const { activeTextEditor: editor, showWarningMessage: warn } = vscode.window
    if (!editor) {
      warn("no editing code")
      return
    }
    const { document, selection, edit } = editor
    const selectedText = document.getText(selection)
    const maybeMatches = /style="(?<styles>([\w\W]+?))"/[Symbol.match](selectedText)!

    if (!(
      maybeMatches
      && maybeMatches.groups
      && maybeMatches.groups.styles
    )) {
      warn("style attribute not detected or no style to extract")
      return
    }
    const { groups: { styles } } = maybeMatches

    const searchQuery = await vscode.window.showInputBox({
      placeHolder: "#id or .className or some more complex ones",
      prompt: "Input the target CSS query",
      value: "",
    }) ?? ""
    let target: { type: "id" | "class"; value: string }
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
    // replace the style attribute
    await edit((editBuilder) => {
      editBuilder.replace(
        selection,
        new MagicString(selectedText)
          .overwrite(maybeMatches.index!,
            maybeMatches.index! + maybeMatches[0].length,
            `${target.type}=\"${target.value}\"`// TODO: auto merge className
          ).toString()
      )
    })
    const tabSize = await getTabSize()
    // insert new class into <style>
    let newStyleString = styles.split(";")
      .map(s => " ".repeat(tabSize) + s.trim()).join(";\n")
    const maybeAppendPos = document.getText().match(/<style.*>[\w\W]*<\/style>/)
    if (!maybeAppendPos) {
      return
    }
    await edit((editBuilder) => {
      editBuilder.insert(
        document.positionAt(maybeAppendPos.index! + maybeAppendPos[0].length - 8),
        `\n${searchQuery}{\n${newStyleString}\n}\n`
      )
    })
  })

  context.subscriptions.push(disposable)
}

export function deactivate() { }
