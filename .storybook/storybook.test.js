import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

initStoryshots({
  storyKindRegex: /^Next\/Form$/,
  test: multiSnapshotWithOptions({
    createNodeMock: element => {
      if (element.type === 'input' && element.props.type === 'file') {
        return document.createElement('input')
      }
    }
  })
})
