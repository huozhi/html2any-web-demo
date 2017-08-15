import React from 'react'
import he from 'he'
import GifPlayer from 'react-gif-player'

const textTag = [
  'a', 'h1', 'p', 'b', 'span', 'strong', 'em',
]

const capitalize = str => str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)

const camelCase = str => {
  let string = str.toLowerCase().replace(/[^A-Za-z0-9]/g, ' ').split(' ')
                  .reduce((result, word) => result + capitalize(word.toLowerCase()))
  return string.charAt(0).toLowerCase() + string.slice(1)
}


function rule(node, children) {
  if (typeof node === 'string') {
    // NOTICE: this way to handle string node is incorrect
    // RN does not have any method to inherit styles
    // so nested Text tags should be rendered as sibling Text nodes in a View better
    return node
  }
  const {name, attributes} = node
  // convert string style
  if (typeof attributes.style === 'string') {
    const styles = attributes.style.split(';')
      .filter(Boolean)
      .map(s => s.trim())
      .map(s => s.split(':'))
      .reduce((r, c) => {
        const [k, v] = c
        // if (!v) {
        //   console.log(c, k, v)
        // }
        r[camelCase(k.trim())] = v ? v.trim() : v
        return r
      }, {})
    // console.log('styles', styles)
    attributes.style = styles
  }
  if (textTag.indexOf(name) >= 0) {
    const Tag = name
    const c = typeof children === 'string' ? he.decode(children) : children
    return <Tag {...attributes}>{c}</Tag>

  } else if (name === 'div') {
    return <div {...attributes}>{children}</div>
  } else if (name === 'img') {
    const {src} = attributes
    if (src.endsWith('gif')) {
      return <GifPlayer gif={src} still={src.replace(/gif$/, 'jpg')} />
    } else {
      return <img {...attributes} />
    }
  } else if (name === 'br') {
    // replace br with hr
    return <hr className='customized-hr' />
  } else {
    const Tag = name
    return <Tag {...attributes}>{children}</Tag>
  }

  return null
}

export default rule
