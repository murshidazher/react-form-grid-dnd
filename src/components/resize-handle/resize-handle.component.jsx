import React from 'react'

const ResizeHandle = ({ axis, ...rest }) => {
  console.log(axis)
  return (
    <div className="p-4 w-6 h6 max-w-sm bg-green-900 focus:shadow-outline"></div>
  )
}

export default ResizeHandle
