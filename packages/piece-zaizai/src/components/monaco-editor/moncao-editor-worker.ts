import monacoEditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu'

import 'monaco-editor/esm/vs/language/json/monaco.contribution'
import 'monaco-editor/ems/vs/language/json/json.worker.js?worker'

import 'monaco-editor/esm/vs/language/typescript/monaco.contribution'
import TSWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'typescript') {
      return new TSWorker()
    }
    return new monacoEditorWorker()
  },
}
