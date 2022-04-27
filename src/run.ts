import { readFileSync } from 'fs'
import { logTree } from './print-lezer-tree'
import { parser } from './lang/problem/problem.js'

const files = process.argv.slice(2) || ['./src/lang/problem/examples/problem.tex']

let coverage = false
if (files[0] === 'coverage') {
  // count errors
  coverage = true
  files.shift()
}

function reportErrorCounts(output: string) {
  if (coverage) process.stdout.write(output)
}

function parseFile(filename: string) {
  const text = readFileSync(filename).toString()
  const t0 = process.hrtime()
  const tree = parser.parse(text)
  const dt = process.hrtime(t0)
  const timeTaken = dt[0] + dt[1] * 1e-9
  let errorCount = 0
  let nodeCount = 0
  tree.iterate({
    enter: (type, from, to, get) => {
      nodeCount++
      if (type.isError) {
        errorCount++
      }
    },
  })
  if (!coverage) logTree(tree, text)
  return { nodeCount, errorCount, timeTaken, bytes: text.length }
}

let totalErrors = 0,
  totalTime = 0,
  totalBytes = 0
for (let file of files) {
  let { nodeCount, errorCount, timeTaken, bytes } = parseFile(file)
  let errorRate = Math.round((100 * errorCount) / nodeCount)
  totalErrors += errorCount
  totalTime += timeTaken
  totalBytes += bytes
  reportErrorCounts(
    `${errorCount} errors`.padStart(12) +
      `${nodeCount} nodes`.padStart(12) +
      `(${errorRate}%)`.padStart(6) +
      `${(1000 * timeTaken).toFixed(1)} ms`.padStart(8) +
      `${(bytes / 1024).toFixed(1)} KB`.padStart(8) +
      ` ${file}\n`
  )
}
const timeInMilliseconds = 1000 * totalTime
const hundredKBs = totalBytes / (100 * 1024)

reportErrorCounts(
  `\ntotal errors ${totalErrors}, performance ${(
    timeInMilliseconds / hundredKBs
  ).toFixed(1)} ms/100KB \n`
)

export {}
