export async function asynchronousImportOfLanguagePacks(lang) {
  const basicLanguages = [
    'abap',
    'apex',
    'azcli',
    'bat',
    'bicep',
    'cameligo',
    'clojure',
    'coffee',
    'cpp',
    'csharp',
    'csp',
    'css',
    'cypher',
    'dart',
    'dockerfile',
    'ecl',
    'elixir',
    'flow9',
    'freemarker2',
    'fsharp',
    'go',
    'graphql',
    'handlebars',
    'hcl',
    'html',
    'ini',
    'java',
    'javascript',
    'julia',
    'kotlin',
    'less',
    'lexon',
    'liquid',
    'lua',
    'm3',
    'markdown',
    'mdx',
    'mips',
    'monaco.contribution.js',
    'msdax',
    'mysql',
    'objective-c',
    'pascal',
    'pascaligo',
    'perl',
    'pgsql',
    'php',
    'pla',
    'postiats',
    'powerquery',
    'powershell',
    'protobuf',
    'pug',
    'python',
    'qsharp',
    'r',
    'razor',
    'redis',
    'redshift',
    'restructuredtext',
    'ruby',
    'rust',
    'sb',
    'scala',
    'scheme',
    'scss',
    'shell',
    'solidity',
    'sophia',
    'sparql',
    'sql',
    'st',
    'swift',
    'systemverilog',
    'tcl',
    'twig',
    'typescript',
    'typespec',
    'vb',
    'wgsl',
    'xml',
    'yaml',
  ]

  const laguage = ['json', 'html', 'css', 'ts', 'typescript']

  const importList = [
    import('monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu'),
    import('monaco-editor/esm/vs/editor/editor.main.js'),
  ]

  //   import(`monaco-editor/esm/vs/basic-languages/${lang}/${lang}.contribution.js`),

  if (lang === 'html') {
    importList.push(
      ...[
        import(`monaco-editor/esm/vs/language/html/monaco.contribution.js`),
        import(`monaco-editor/esm/vs/language/html/htmlMode.js`),
      ]
    )
  }

  if (lang === 'json') {
    importList.push(
      ...[
        import(`monaco-editor/esm/vs/language/json/monaco.contribution.js`),
        import(`monaco-editor/esm/vs/language/json/jsonMode.js`),
      ]
    )
  }

  if (lang === 'ts' || lang === 'typescript') {
    importList.push(
      ...[
        import(`monaco-editor/esm/vs/language/typescript/monaco.contribution.js`),
        import(`monaco-editor/esm/vs/language/typescript/tsMode.js`),
      ]
    )
  }

  if (lang === 'css') {
    importList.push(
      ...[
        import(`monaco-editor/esm/vs/language/css/monaco.contribution.js`),
        import(`monaco-editor/esm/vs/language/css/cssMode.js`),
      ]
    )
  }

  console.log(importList);
  

  await Promise.all(importList)
}
