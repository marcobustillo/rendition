import * as React from 'react'
import { configure, addDecorator } from '@storybook/react'
import { withScreenshot } from 'storycap'
import { createGlobalStyle } from 'styled-components'
import theme from '../src/theme'
import {Provider} from '../src/index'
import 'circular-std'

const GlobalStyle = createGlobalStyle([], {
  '*': {
    boxSizing: 'border-box'
  },
  body: {
    lineHeight: 1.5,
    margin: 0,
    fontFamily: theme.font,
    background: 'white',
    webkitFontSmoothing: 'antialiased'
  }
})

function withGlobalStyles (storyFn) {
  return (
    <React.Fragment>
      <GlobalStyle />
      <Provider>
        {storyFn()}
      </Provider>
    </React.Fragment>
  )
}

addDecorator(withGlobalStyles)

// The 'fontLoading' global is defined in '.storybook/preview-head.html' and
// returns a promise that resolves once fonts have loaded. Waiting until the
// fonts have loaded means we should get consistent screenshots across all
// systems, otherwise a screenshot could be rendered using the incorrect font
// and cause a conflict
addDecorator(
  withScreenshot({
    waitFor: 'fontLoading',
    // Add a slight delay before taking a screenshot to avoid infrequent glitches.
    delay: 150,
    viewport: {
      width: 1200,
      // This is the minimum, it expands otherwise as needed
      height: 300
    }
  })
)

const req = require.context('../src', true, /.*story\.js$/)

const load = () => {
  req.keys().forEach(req)
}

configure(load, module)
