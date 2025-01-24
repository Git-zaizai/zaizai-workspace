import fs from 'fs'
import path from 'path'

const dirs = fs.readdirSync(
  path.join(import.meta.dirname, '../../../node_modules/monaco-editor/esm/vs/basic-languages')
)
dirs.pop()
dirs.map(v => {
  console.log(`import('monaco-editor/esm/vs/basic-languages/${v}/${v}.contribution')`)
})
console.log('🚀 ~ dirs:', dirs)
/***
 * 
 * [
  'abap',        'apex',              'azcli',
  'bat',         'bicep',             'cameligo',
  'clojure',     'coffee',            'cpp',
  'csharp',      'csp',               'css',
  'cypher',      'dart',              'dockerfile',
  'ecl',         'elixir',            'flow9',
  'freemarker2', 'fsharp',            'go',
  'graphql',     'handlebars',        'hcl',
  'html',        'ini',               'java',
  'javascript',  'julia',             'kotlin',
  'less',        'lexon',             'liquid',
  'lua',         'm3',                'markdown',
  'mdx',         'mips',              'monaco.contribution.js',
  'msdax',       'mysql',             'objective-c',
  'pascal',      'pascaligo',         'perl',
  'pgsql',       'php',               'pla',
  'postiats',    'powerquery',        'powershell',
  'protobuf',    'pug',               'python',
  'qsharp',      'r',                 'razor',
  'redis',       'redshift',          'restructuredtext',
  'ruby',        'rust',              'sb',
  'scala',       'scheme',            'scss',
  'shell',       'solidity',          'sophia',
  'sparql',      'sql',               'st',
  'swift',       'systemverilog',     'tcl',
  'twig',        'typescript',        'typespec',
  'vb',          'wgsl',              'xml',
  'yaml',        '_.contribution.js'
]
 */

// 在web使用
/* import metadata from 'monaco-editor/esm/metadata'
const prefix = 'monaco-editor/esm/'
const autoImport = metadata.features.map((feat) => {
  let entry =
    Object.prototype.toString.call(feat.entry) === '[object String]'
      ? [feat.entry]
      : (feat.entry)
  entry = entry.map((val) => `import '${prefix}${val}'`)
  return `// ${feat.label}
${entry.join('\n')}`
})
console.log(autoImport.join('\n')) */

/* 
monaco-editor 配置文件
// anchorSelect
import 'monaco-editor/esm/vs/editor/contrib/anchorSelect/browser/anchorSelect'
// bracketMatching
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/browser/bracketMatching'
// browser
import 'monaco-editor/esm/vs/editor/browser/coreCommands'
// caretOperations
import 'monaco-editor/esm/vs/editor/contrib/caretOperations/browser/caretOperations'
import 'monaco-editor/esm/vs/editor/contrib/caretOperations/browser/transpose'
// clipboard
import 'monaco-editor/esm/vs/editor/contrib/clipboard/browser/clipboard'
// codeAction
import 'monaco-editor/esm/vs/editor/contrib/codeAction/browser/codeActionContributions'
// codeEditor
import 'monaco-editor/esm/vs/editor/browser/widget/codeEditor/codeEditorWidget'
// codelens
import 'monaco-editor/esm/vs/editor/contrib/codelens/browser/codelensController'
// colorPicker
import 'monaco-editor/esm/vs/editor/contrib/colorPicker/browser/colorContributions'
import 'monaco-editor/esm/vs/editor/contrib/colorPicker/browser/standaloneColorPickerActions'
// comment
import 'monaco-editor/esm/vs/editor/contrib/comment/browser/comment'
// contextmenu
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu'
// cursorUndo
import 'monaco-editor/esm/vs/editor/contrib/cursorUndo/browser/cursorUndo'
// diffEditor
import 'monaco-editor/esm/vs/editor/browser/widget/diffEditor/diffEditor.contribution'
// diffEditorBreadcrumbs
import 'monaco-editor/esm/vs/editor/contrib/diffEditorBreadcrumbs/browser/contribution'
// dnd
import 'monaco-editor/esm/vs/editor/contrib/dnd/browser/dnd'
// documentSymbols
import 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/documentSymbols'
// dropOrPasteInto
import 'monaco-editor/esm/vs/editor/contrib/dropOrPasteInto/browser/copyPasteContribution'
import 'monaco-editor/esm/vs/editor/contrib/dropOrPasteInto/browser/dropIntoEditorContribution'
// find
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController'
// folding
import 'monaco-editor/esm/vs/editor/contrib/folding/browser/folding'
// fontZoom
import 'monaco-editor/esm/vs/editor/contrib/fontZoom/browser/fontZoom'
// format
import 'monaco-editor/esm/vs/editor/contrib/format/browser/formatActions'
// gotoError
import 'monaco-editor/esm/vs/editor/contrib/gotoError/browser/gotoError'
// gotoLine
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess'
// gotoSymbol
import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/browser/goToCommands'
import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition'
// hover
import 'monaco-editor/esm/vs/editor/contrib/hover/browser/hoverContribution'
// iPadShowKeyboard
import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard'
// inPlaceReplace
import 'monaco-editor/esm/vs/editor/contrib/inPlaceReplace/browser/inPlaceReplace'
// indentation
import 'monaco-editor/esm/vs/editor/contrib/indentation/browser/indentation'
// inlayHints
import 'monaco-editor/esm/vs/editor/contrib/inlayHints/browser/inlayHintsContribution'
// inlineCompletions
import 'monaco-editor/esm/vs/editor/contrib/inlineCompletions/browser/inlineCompletions.contribution'
// inlineEdit
import 'monaco-editor/esm/vs/editor/contrib/inlineEdit/browser/inlineEdit.contribution'
// inlineEdits
import 'monaco-editor/esm/vs/editor/contrib/inlineEdits/browser/inlineEdits.contribution'
// inlineProgress
import 'monaco-editor/esm/vs/editor/contrib/inlineProgress/browser/inlineProgress'
// inspectTokens
import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens'
// lineSelection
import 'monaco-editor/esm/vs/editor/contrib/lineSelection/browser/lineSelection'
// linesOperations
import 'monaco-editor/esm/vs/editor/contrib/linesOperations/browser/linesOperations'
// linkedEditing
import 'monaco-editor/esm/vs/editor/contrib/linkedEditing/browser/linkedEditing'
// links
import 'monaco-editor/esm/vs/editor/contrib/links/browser/links'
// longLinesHelper
import 'monaco-editor/esm/vs/editor/contrib/longLinesHelper/browser/longLinesHelper'
// multicursor
import 'monaco-editor/esm/vs/editor/contrib/multicursor/browser/multicursor'
// parameterHints
import 'monaco-editor/esm/vs/editor/contrib/parameterHints/browser/parameterHints'
// placeholderText
import 'monaco-editor/esm/vs/editor/contrib/placeholderText/browser/placeholderText.contribution'
// quickCommand
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess'
// quickHelp
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess'
// quickOutline
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess'
// readOnlyMessage
import 'monaco-editor/esm/vs/editor/contrib/readOnlyMessage/browser/contribution'
// referenceSearch
import 'monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch'
// rename
import 'monaco-editor/esm/vs/editor/contrib/rename/browser/rename'
// sectionHeaders
import 'monaco-editor/esm/vs/editor/contrib/sectionHeaders/browser/sectionHeaders'
// semanticTokens
import 'monaco-editor/esm/vs/editor/contrib/semanticTokens/browser/documentSemanticTokens'
import 'monaco-editor/esm/vs/editor/contrib/semanticTokens/browser/viewportSemanticTokens'
// smartSelect
import 'monaco-editor/esm/vs/editor/contrib/smartSelect/browser/smartSelect'
// snippet
import 'monaco-editor/esm/vs/editor/contrib/snippet/browser/snippetController2'
// stickyScroll
import 'monaco-editor/esm/vs/editor/contrib/stickyScroll/browser/stickyScrollContribution'
// suggest
import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController'
import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestInlineCompletions'
// toggleHighContrast
import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast'
// toggleTabFocusMode
import 'monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/browser/toggleTabFocusMode'
// tokenization
import 'monaco-editor/esm/vs/editor/contrib/tokenization/browser/tokenization'
// unicodeHighlighter
import 'monaco-editor/esm/vs/editor/contrib/unicodeHighlighter/browser/unicodeHighlighter'
// unusualLineTerminators
import 'monaco-editor/esm/vs/editor/contrib/unusualLineTerminators/browser/unusualLineTerminators'
// wordHighlighter
import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/browser/wordHighlighter'
// wordOperations
import 'monaco-editor/esm/vs/editor/contrib/wordOperations/browser/wordOperations'
// wordPartOperations
import 'monaco-editor/esm/vs/editor/contrib/wordPartOperations/browser/wordPartOperations' */

fetch('http://localhost:7379/json/set', {
  method: 'POST',
}).then(res => {
  console.log(res)
})
