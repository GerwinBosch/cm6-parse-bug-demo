# CM6 parser code-parsing problem demo

## The Problem

At @TriplyDB, while working on a lezer parser for SPARQL, we stumbled on an apparent bug in the interaction of lezer with code-mirror. This bug manifests when editing a large document (The original parse is correct) where at the lower part of the document a line is commented then uncommented will break the parse tree.

Our problem seems to be related to <https://github.com/lezer-parser/lezer/issues/24> still resulting in a "broken" parse tree. Luckily our problem is also reproducible with the reproduction repo mentioned in that issue. I've updated the dependencies to the latest version and confirmed that it's still reproducible.

Parsing the same document, with the same lezer parser, from a node process (feeding it the entire document as a string), does not yield any parse errors. Thus, there seems to be a difference in behaviour between those two environments, depending on whether the parser is fed by a single string, or by (presumably) the incremental parsing machinery in CodeMirror.

### Hypothesis

It seems that the parser is getting tripped up on having so many "skip" nodes, and giving up with an incomplete parse tree.

### Minimal Reproduction

In this repository, @JuneKelly has created a minimal reproduction of the issue, using a simple grammar for a `problem` language. I have updated the dependencies and modified the repo to fit the issue we've been experiencing.

See the later instructions on how to run the parser on the command line, and how to run a CodeMirror editor with the parser loaded up.

### Debugging

We tried removing the "skip" rule on Comment, and adding Comment to the grammar in places where it could be valid. With this change, the issue with folding disappears, and the parser does not produce any errors. However, this change is not really viable, as it would require adding 'Comment' to every location in the grammar where it could occur.

See `src/lang/problem/no-problem.grammar` for what that looks like.

This work-arould leads me to believe the issue must lie in how either CodeMirror or lezer behaves when working in incremental mode, with a lot of "skip" nodes.

### Other observations

We also observed the following:

- The issue is not triggered when the content of the block is shorter. There seems to be some critical threshold of "skip" nodes at which the issue happens.

## Important files

- `src/lang/problem/problem.grammar`: A minimal grammar which demonstrates the problem
- `src/lang/problem/examples/problem.txt`: An example program in the "problem" language, which triggers the problematic behaviour in a CodeMirror 6 editor
- `src/lang/problem/lang-problem.ts`: A language module which uses the grammar
- `src/editor.ts`: A CodeMirror 6 editor, loading the "problem" language
- `src/run.ts`: A helper script to run the "problem" parser against a provided file, and print the resulting tree to the terminal

## Running the Code

To run the parser on the example file, and print the resulting tree in the terminal:

```sh
npm run demo src/lang/problem/examples/problem.txt
```

To start a web page with with the example text in an CodeMirror editor:

```sh
npm run generate:problem && npm run build && npm run start
```

To reproduce the issue

- Go to line 81
- Comment the line
- Uncomment the line
- Notice the syntax-error
