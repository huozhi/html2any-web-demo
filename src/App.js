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
      ast: html2any(html),
      showPreview: false,
    })
  }

  handlePreview = () => {
    this.setState({
      showPreview: !this.state.showPreview,
      ast: null,
    })
  }

  get astText() {
    return JSON.stringify(this.state.ast, null, 2)
  }

  render() {
    const {html, ast, showPreview} = this.state

    return (
      <div className='App'>
        <div className='ops'>
          <button className='trigger' onClick={this.handleUpdateComponent}>
            render
          </button>
          <button onClick={this.handlePreview} className='trigger'>
            {showPreview ? 'show editor' : 'preview'}
          </button>
          <p>Click <b>render</b> if you wanna test transform result, click <b>preview</b> if you just wanna view origin html</p>
          <h3>transform rules we defined:</h3>
          <ul>
            <li>transform br to hr;</li>
            <li>transform gif to GifPlayer;</li>
            <li>transform video to VideoPlayer;</li>
          </ul>
        </div>
        <div className='main'>
          <div className='editor-wrap'>
            {!showPreview && !ast &&
              <CodeMirror
                className='editor'
                value={html}
                onChange={this.handleChangeHtml}
                options={this.codeMirrorOps}
              />
            }
            {showPreview &&
              <div className='preview' dangerouslySetInnerHTML={{__html: html}} />
            }
            {ast &&
              <div className='preview'>
                {transform(ast, rule)}
              </div>
            }
          </div>

        </div>
        {ast &&
          <pre className='ast'>
            {this.astText}
          </pre>
        }
      </div>
    );
  }
}

export default App;
