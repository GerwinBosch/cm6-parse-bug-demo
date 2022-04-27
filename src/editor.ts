import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup'
import { langProblem, problemExample } from './lang/problem/lang-problem'

const [language, exampleFile] = [langProblem, problemExample]

async function createEditor() {
  const response = await fetch(exampleFile)
  const docData = await response.text()

  let editor = new EditorView({
    state: EditorState.create({
      doc: docData,
      extensions: [basicSetup, language()],
    }),
    parent: document.querySelector('#editor'),
  })
}

createEditor()
