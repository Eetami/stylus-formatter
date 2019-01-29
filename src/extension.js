// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import vscode from 'vscode'
import format from './format'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
export const activate = context => {
  const disposable = vscode.languages.registerDocumentFormattingEditProvider(
    { language: 'stylus', scheme: 'file' },
    {
      provideDocumentFormattingEdits: (document, options) => {
        return format(document, options)
      }
    }
  )

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export const deactivate = () => {}

export default { activate, deactivate }
