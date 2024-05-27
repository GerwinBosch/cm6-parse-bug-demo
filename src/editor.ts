import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import {
  foldGutter,
  syntaxTree
} from '@codemirror/language'

import { langProblem, problemExample } from './lang/problem/lang-problem'
import { defaultKeymap } from '@codemirror/commands'

const [language, exampleFile] = [langProblem, problemExample]

async function createEditor() {
  const response = await fetch(exampleFile)
  const docData = await response.text()
  let editor = new EditorView({
    state: EditorState.create({
      doc: docData,
      extensions: [
        lineNumbers(),
        foldGutter(),
        language(),
        keymap.of(defaultKeymap)
      ],
    }),
    parent: document.querySelector('#editor'),
  })
  window['__printTree'] = () => {
    console.log(syntaxTree(editor.state).toString())
  }
}

createEditor()
