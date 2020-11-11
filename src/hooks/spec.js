/* globals expect, test, describe */
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider, useTheme } from '../../dist'
import { useBreakpoint } from '../../dist/hooks/useBreakpoint'
import { breakpoints } from '../../dist/theme'

const Sample = () => {
  const theme = useTheme()

  return <span>{theme.foo}</span>
}

test('useTheme should return correct theme object', () => {
  const theme = {
    foo: 'bar'
  }

  const component = mount(
    <Provider theme={theme}>
      <Sample />
    </Provider>
  )
  let text = component.find(Sample).text()
  expect(text).toEqual('bar')
})

const resizeWindow = (width = 600) => {
  global.window.innerWidth = width
  global.window.dispatchEvent(new Event('resize'))
}

const HookContainer = ({ children, values }) => children(useBreakpoint(values))

const testHook = (values) => {
  let retrunValues
  mount(
    <Provider>
      <HookContainer values={values}>
        {(hookVal) => {
          retrunValues = hookVal
          return null
        }}
      </HookContainer>
    </Provider>
  )
  return retrunValues
}

describe('should test useBreakpoint hook in multiple resolutions', () => {
  const values = breakpoints.map((b) => `less than ${b}`)
  const table = breakpoints.map((b, index) => [`name: ${b}`, b, values[index]])
  test.each(table)(
    'useBreakpoint should return %s value with %d resolution',
    (_name, resolution, expectedResult) => {
      act(() => {
        resizeWindow(resolution - 1)
      })
      const hookValue = testHook(values)
      expect(hookValue).toEqual(expectedResult)
    }
  )
})
