// Первичная обнова начнется с внедрения этого компонента. Вместо прямого вброса
import React from 'react';
import {connect} from 'react-redux'

import Editor from './Editor'

const QuestionWrapper = () => {
  return (
    <Editor fakeBranch fakeCH />
  )
}

export default connect(({}) => ({}), {})(QuestionWrapper) 