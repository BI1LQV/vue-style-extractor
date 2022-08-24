import MagicString from "magic-string"
import * as vscode from "vscode"
import { appendStyle, getTabSize, parseQuery } from "./utils"
export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "vue-style-extractor.extractStyle",
    async () => {
      const {
        activeTextEditor: editor, showWarningMessage: warn,
      } = vscode.window
      if (!editor) {
        warn("no editing code")
        return
      }
      const { document, selection, edit } = editor
      const selectedText = document.getText(selection)
      const maybeMatches = selectedText.match(/style="(?<styles>([\w\W]+?))"/)!

      if (!maybeMatches?.groups?.styles) {
        warn("style attribute not detected or no style to extract")
        return
      }
      const { groups: { styles } } = maybeMatches

      const searchQuery = await vscode.window.showInputBox({
        placeHolder: "#id or .className or some more complex ones",
        prompt: "Input the target CSS query",
        value: "",
      }) ?? ""

      let target = parseQuery(searchQuery)
      let selectionReplacement = new MagicString(selectedText)
      const maybeClasses = selectedText.match(/class="(?<classes>([\w\W]+?))"/)

      if (target?.type === "class" && maybeClasses?.groups?.classes) {
        const classes = maybeClasses.groups.classes
        selectionReplacement.overwrite(maybeClasses.index!,
          maybeClasses.index! + maybeClasses[0].length,
          `class="${classes} ${target.value}"`
        )
        target = null
      }

      selectionReplacement.overwrite(maybeMatches.index!,
        maybeMatches.index! + maybeMatches[0].length,
        target ? `${target.type}=\"${target.value}\"` : ""
      )

      const tabSize = await getTabSize()
      await edit(async (editBuilder) => {
        // replace the style attribute
        editBuilder.replace(
          selection,
          selectionReplacement.toString()
        )

        appendStyle(
          editBuilder, document,
          styles, searchQuery, tabSize
        )
      })
    })

  context.subscriptions.push(disposable)
}

export function deactivate() { }

