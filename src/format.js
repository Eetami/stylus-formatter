import vscode from 'vscode'
import { ceil, repeat } from 'lodash'

export const insertTrailingNewline = (document, options) => {
  const lastLine = document.lineAt(document.lineCount - 1)
  if (lastLine.text !== '') {
    return [vscode.TextEdit.insert(lastLine.range.end, '\n')]
  }
  return []
}

const trimRight = line => {
  const pos = line.text.search(/\s+$/)
  if (pos !== -1) {
    const range = new vscode.Range(
      line.range.start.translate(0, pos),
      line.range.end
    )
    return vscode.TextEdit.delete(range)
  }
}

const countChars = (text, char) => {
  let count = 0
  let i = 0
  while (text.charAt(i++) === char) {
    count++
  }
  return count
}

const replaceIndent = (line, { insertSpaces, tabSize }) => {
  const count = insertSpaces
    ? countChars(line.text, '\t')
    : countChars(line.text, ' ')
  if (count) {
    const range = new vscode.Range(
      line.range.start,
      line.range.start.translate(0, count)
    )
    const indentChar = insertSpaces ? ' ' : '\t'
    const indentAmount = insertSpaces ? count * tabSize : ceil(count / tabSize)
    return vscode.TextEdit.replace(range, repeat(indentChar, indentAmount))
  }
}

export const trimLines = (document, options) => {
  const returnables = []
  let i = 0

  while (i < document.lineCount) {
    const line = document.lineAt(i)
    const functions = [trimRight, replaceIndent]
    functions.forEach(fn => {
      const edit = fn(line, options)
      if (edit) {
        returnables.push(edit)
      }
    })
    i++
  }

  return returnables
}

export default (document, options) => {
  const enabled = vscode.workspace
    .getConfiguration('whitespace.format', document.uri)
    .get('enable')

  return (
    enabled && [
      ...insertTrailingNewline(document, options),
      ...trimLines(document, options)
    ]
  )
}
