import React, {Component} from 'react'
import CodeMirror from 'react-codemirror'
import {tokenizer, parser, transform} from 'html2any'
import rule from './lib/rule'
import {defaultHTML} from './consts'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/htmlembedded/htmlembedded'
import './App.css'

const html2any = (html) => {
  return parser(tokenizer(html))[0]
}

class App extends Component {
  state = {
    html: defaultHTML,
  }

  codeMirrorOps = {
    lineNumbers: true,
    lineWrapping: true,
  }

  handleChangeHtml = (html) => {
    this.setState({html})
  }

  handleUpdateComponent = () => {
    const {html} = this.state
    this.setState({
      ast: html2any(html)
    })
  }

  handlePreview = () => {
    this.setState({showPreview: !this.state.showPreview})
  }

  render() {
    const {html, ast, showPreview} = this.state

    return (
      <div className='App'>
        <button className='render-trigger' onClick={this.handleUpdateComponent}>
          render
        </button>
        <div className='main'>
          <div className='editor-wrap'>
            {showPreview
              ? <div className='preview' dangerouslySetInnerHTML={{__html: html}} />
              : (
                <CodeMirror
                  className='editor'
                  value={html}
                  onChange={this.handleChangeHtml}
                  options={this.codeMirrorOps}
                />
              )
            }
            <button onClick={this.handlePreview} className='preview-trigger'>preview</button>
          </div>
          <div className='demo'>
            {transform(ast, rule)}
          </div>
        </div>
        <pre className='ast'>
          {JSON.stringify(ast, null, 2)}
        </pre>
      </div>
    );
  }
}

export default App;
