import vscode from 'vscode'
import format from './format'

/**
 * @param {vscode.ExtensionContext} context
 */
export const activate = context => {
  const documentFilters = [{ scheme: 'file' }, { scheme: 'untitled' }]
  const documentFormattingEditProvider = {
    provideDocumentFormattingEdits: (document, options) => {
      return format(document, options)
    }
  }

  const disposable = vscode.languages.registerDocumentFormattingEditProvider(
    documentFilters,
    documentFormattingEditProvider
  )

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export const deactivate = () => {}

export default { activate, deactivate }
