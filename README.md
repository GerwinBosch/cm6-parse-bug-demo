# CM6 parser code-folding problem demo

## The Problem 


### Work-arounds


## Important files

- `src/lang/problem/problem.grammar`: A minimal grammar which demonstrates the problem
- `src/lang/problem/examples/problem.txt`: An example program in the "problem" language, which triggers the problematic behaviour in a CodeMirror 6 editor
- `src/lang/problem/lang-problem.ts`: A language module which uses the grammar
- `src/editor.ts`: A CodeMirror 6 editor, loading the "problem" language
- `src/run.ts`: A helper script to run the "problem" parser against a provided file, and print the resulting tree to the terminal


## Running the Code 

To run the parser on the example file, and print the resulting tree in the terminal:

``` sh
npm run demo src/lang/problem/examples/problem.txt | less
```

To start a web page with with the example text in an CodeMirror editor:

``` sh
npm run build && npm run generate:problem && npm run start
```


