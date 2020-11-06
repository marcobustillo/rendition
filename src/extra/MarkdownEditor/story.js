import * as React from 'react'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import source from '../../stories/assets/markdownSample'
import { Box } from '../../'
import { MarkdownEditor } from './'
import Readme from './README.md'

storiesOf('Extra/MarkdownEditor', module)
  .addDecorator(withReadme(Readme))
  .add('Standard', () => {
    return (
      <Box m={3}>
        <MarkdownEditor value={source} />
      </Box>
    )
  })
