import React from 'react'
import he from 'he'
import VideoPlayer from 'react-player'
import GifPlayer from 'react-gif-player'
import coverPNG from '../images/flip_the_frog.jpg'

const styles = {
  convertButton: {
    padding: '10px 20px',
    margin: '0 10px',
    border: 0,
    backgroundColor: '#6f8292',
    color: '#fff',
  },
  videoPlayer: {
    maxWidth: '100%',
    margin: 'auto',
  },

  videoPlayerWrap: {
    position: 'relative',
  },

  videoPlayerBg: {
    position: 'absolute',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    filter: 'blur(5px)',
    opacity: .5,
    zIndex: 0,
  }
}

const textTag = [
  'a', 'p', 'b', 'span', 'strong', 'em',
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
    return he.decode(node)
  }
  const {name, attributes, index} = node
  if (attributes && attributes.class) {
    attributes.className = attributes.class
    delete attributes.class
  }
  // convert string style
  if (typeof attributes.style === 'string') {
    const styles = attributes.style.split(';')
      .filter(Boolean)
      .map(s => s.trim())
      .map(s => s.split(':'))
      .reduce((r, c) => {
        const [k, v] = c
        r[camelCase(k.trim())] = v ? v.trim() : v
        return r
      }, {})
    attributes.style = styles
  }
  if (textTag.indexOf(name) >= 0) {
    const Tag = name
    const c = typeof children === 'string' ? he.decode(children) : children
    return <Tag {...attributes}>{c}</Tag>
  } else if (name === 'div') {
    return <div {...attributes}>{children}</div>
  } else if (name === 'h1' || name === 'h2') {
    return <p {...attributes} style={{color: "#444"}}>{children}</p>
  } else if (name === 'button') {
    return (
      <button style={styles.convertButton}>
        {children}
      </button>
    )
  } else if (name === 'img') {
    const {src} = attributes
    if (src.endsWith('gif')) {
      return <GifPlayer gif={src} still={coverPNG} />
    } else {
      return (
        <img
          {...attributes}
          key={index}
          alt='img'
        />
      )
    }
  } else if (name === 'br') {
    // replace br with hr
    return <hr className='customized-hr' />
  } else if (name === 'video') {
    return (
      <div style={styles.videoPlayerWrap}>
        <div style={Object.assign({}, styles.videoPlayerBg, {backgroundImage: `url(${attributes.poster})`})} />
        <VideoPlayer style={styles.videoPlayer} url={attributes.src} playing={false} loop controls />
      </div>
    )
  } else {
    const Tag = name
    return <Tag {...attributes}>{children}</Tag>
  }
}

export default rule
