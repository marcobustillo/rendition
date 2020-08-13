const fs = require('fs')

exports.tsifyFileContent = (sourceFilePath, targetFilePath, postProcessor) => {
  let fileContent = fs.readFileSync(sourceFilePath, { encoding: 'utf-8' })

  if (postProcessor) {
    fileContent = postProcessor(fileContent, 'css')
  }

  fileContent = `/**
  * Autogenerated, do not modify directly
  */
import { css } from 'styled-components';

export default css\`${fileContent}\`;
`
  fileContent = postProcessor(fileContent, 'typescript')
  fs.writeFileSync(targetFilePath, fileContent, { encoding: 'utf-8' })
}