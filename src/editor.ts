import { EditorState } from '@codemirror/state'
import { EditorView, lineNumbers } from '@codemirror/view'
import {
  foldGutter,
} from '@codemirror/language'

import { langProblem, problemExample } from './lang/problem/lang-problem'

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
        language()
      ],
    }),
    parent: document.querySelector('#editor'),
  })
}

createEditor()
