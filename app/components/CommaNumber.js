import React from 'react'
import numeral from 'numeraljs'

export default (props) => {
  var s = numeral(props.value, '0,0').format()
  return(
    <span>{ s }</span>
  ) 
}