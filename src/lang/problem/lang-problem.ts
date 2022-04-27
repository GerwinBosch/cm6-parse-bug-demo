import { parser } from './problem.js';
import { LRLanguage, LanguageSupport,  foldNodeProp, foldInside, } from '@codemirror/language';
import { linter } from '@codemirror/lint';
import { syntaxTree } from '@codemirror/language';

function lintExample(view) {
    const diagnostics = [];
    syntaxTree(view.state).iterate({
        enter: (node) => {
            if (node.type.isError) {
                diagnostics.push({
                    from: node.from,
                    to: node.to,
                    severity: 'error',
                    message: 'syntax error',
                });
            }
        },
    });
    return diagnostics;
}

export const LaTeXLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            foldNodeProp.add({
                'Block': foldInside,
            })
        ],
    }),
    languageData: {
        commentTokens: { line: '%' },
    },
});
export function langProblem() {
    return new LanguageSupport(LaTeXLanguage, [
        linter(lintExample)
    ]);
}
export const problemExample = 'lang/problem/examples/problem.txt';
