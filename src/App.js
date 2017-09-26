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

  handlePreview = () => {
    this.setState({
      showPreview: !this.state.showPreview,
      ast: null,
    })
  }

  render() {
    const {html, showPreview} = this.state

    const ast = html2any(html)

    return (
      <div className='App'>
        <div className='ops'>
          <p>Click <b>preview</b> if you just wanna view origin html</p>
          <div>
            <span style={{display: 'inline-block', width: '50%', textAlign: 'center'}}>origin html/editor</span>
            <span style={{display: 'inline-block', width: '50%', textAlign: 'center'}}>transformed html</span>
          </div>
        </div>
        <div className='main'>
          <div className='editor-wrap'>
            <button onClick={this.handlePreview} className='trigger'>
              {showPreview ? 'show editor' : 'preview'}
            </button>
            {showPreview ?
              <div className='preview' dangerouslySetInnerHTML={{__html: html}} /> :
              <CodeMirror
                className='editor'
                value={html}
                onChange={this.handleChangeHtml}
                options={this.codeMirrorOps}
              />
            }
            <div className='transform'>
              {transform(ast, rule)}
            </div>
          </div>

        </div>
        {ast &&
          <div style={{margin: 'auto', marginTop: 20}}>
            <div>AST:</div>
            <pre className='ast'>
              {JSON.stringify(ast, null, 2)}
            </pre>
          </div>
        }
      </div>
    );
  }
}

export default App;
