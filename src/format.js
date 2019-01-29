import vscode from 'vscode'
import { repeat } from 'lodash'

export const insertLastLine = (document, options) => {
  const lastLine = document.lineAt(document.lineCount - 1)
  if (lastLine.text !== '') {
    return [vscode.TextEdit.insert(lastLine.range.end, '\n')]
  }
  return []
}

const trimLine = line => {
  const pos = line.text.search(/\s+$/)
  if (pos !== -1) {
    const range = new vscode.Range(
      line.range.start.translate(0, pos),
      line.range.end
    )
    return vscode.TextEdit.delete(range)
  }
}

const numberOfTabs = text => {
  let count = 0
  let i = 0
  while (text.charAt(i++) === '\t') {
    count++
  }
  return count
}

const getIndent = amount => {
  return repeat(' ', amount)
}

const convertTabs = (line, options) => {
  if (options.insertSpaces) {
    const tabs = numberOfTabs(line.text)
    if (tabs) {
      const range = new vscode.Range(
        line.range.start,
        line.range.start.translate(0, tabs)
      )
      return vscode.TextEdit.replace(range, getIndent(tabs * options.tabSize))
    }
  }
}

export const trimLines = (document, options) => {
  const returnables = []
  let i = 0

  while (i < document.lineCount) {
    const line = document.lineAt(i)
    const functions = [trimLine, convertTabs]
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
  return [...insertLastLine(document, options), ...trimLines(document, options)]
}
