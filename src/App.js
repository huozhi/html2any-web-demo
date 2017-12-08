import React, {Component} from 'react'
import CodeMirror from 'react-codemirror'
import html2any, {tokenize, parse} from 'html2any'
import rule from './lib/rule'
import {defaultHTML} from './consts'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/htmlembedded/htmlembedded'
import './App.css'

class App extends Component {
  state = {
    html: defaultHTML,
    showPreview: true,
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
    })
  }

  render() {
    const {html, showPreview} = this.state

    const ast = parse(tokenize(html))[0]

    return (
      <div className='App'>
        <div className='ops'>
          <h3>Rule:</h3>
          <ul>
            <li>string ===>  decode(string)</li>
            <li>h1/h2 ====>  p > children</li>
            <li>button ===>  blue button</li>
            <li>gif ======>  gif player</li>
            <li>video ====>  video stream player</li>
          </ul>
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

            {html &&
              <div className='preview html2any-preview'>
                {html2any(html, rule)}
              </div>
            }
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
