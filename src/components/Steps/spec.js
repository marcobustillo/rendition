/* globals expect, describe, it */
import React from 'react'
import renderer from 'react-test-renderer'
import { Provider, Steps, Step } from '../../../dist'

describe('Steps component', () => {
  it('Error thrown if ordered is true and activeStepIndex is not set', () => {
    expect(() => {
      renderer.create(
        <Provider>
          <Steps m={3} ordered bordered={false}>
            <Step status='completed' onClick={() => null}>
              Do this
            </Step>
            <Step status='completed' onClick={() => null}>
              And then this
            </Step>
            <Step status='pending' onClick={() => null}>
              And finally this
            </Step>
          </Steps>
        </Provider>
      )
    }).toThrowError('You must specify the activeStepIndex for ordered Steps')
  })

  it('Error thrown if activeStepIndex is too high', () => {
    expect(() => {
      renderer.create(
        <Provider>
          <Steps m={3} ordered bordered={false} activeStepIndex={3}>
            <Step status='completed' onClick={() => null}>
              Do this
            </Step>
            <Step status='completed' onClick={() => null}>
              And then this
            </Step>
            <Step status='pending' onClick={() => null}>
              And finally this
            </Step>
          </Steps>
        </Provider>
      )
    }).toThrowError('activeStepIndex is out of range')
  })
})
