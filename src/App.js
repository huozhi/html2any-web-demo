import React, {Component} from 'react'
import CodeMirror from 'react-codemirror'
import html2any, {parse} from 'html2any'
import rule from './lib/rule'
import {defaultHTML} from './consts'
import 'codemirror/mode/htmlembedded/htmlembedded'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/tomorrow-night-eighties.css'
import './App.css'

const codeMirrorOps = {
  lineNumbers: true,
  lineWrapping: true,
  theme: 'tomorrow-night-eighties',
}

const styles = {
  subtitle: {
    display: 'inline-block',
    width: '50%',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
}

class App extends Component {
  state = {
    html: defaultHTML,
    showPreview: true,
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

    const ast = parse(html)[0]

    return (
      <div className='App'>
        <div className='ops'>
          <h3>Rule:</h3>
          <ul>
            <li>h1/h2 ====>  p > children, string ===>  decode(string)</li>
            <li>button ===>  blue button</li>
            <li>gif ======>  gif player</li>
            <li>video ====>  video stream player</li>
          </ul>
          <p>Click <b>preview</b> if you just wanna view origin html</p>
          <div>
            <span style={styles.subtitle}>origin html/editor</span>
            <span style={styles.subtitle}>transformed html</span>
          </div>

          <button onClick={this.handlePreview} className='trigger'>
            {showPreview ? 'show editor' : 'preview'}
          </button>
        </div>
        <div className='main'>
          <div className='editor-wrap'>
            {showPreview ?
              <div className='preview sample' dangerouslySetInnerHTML={{__html: html}} /> :
              <CodeMirror
                className='editor'
                value={html}
                options={codeMirrorOps}
                onChange={this.handleChangeHtml}
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
