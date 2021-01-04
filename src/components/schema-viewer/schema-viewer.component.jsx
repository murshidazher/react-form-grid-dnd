import React, { useState, useEffect } from 'react'
import './schema-viewer.styles.scss'
import Icon from 'react-hero-icon'
import _ from 'lodash'
import clsx from 'clsx'
import Input from '../common/input.component'
import { insertSpaces } from '../../utils/capitalize'

// what form to generate
// key should be unique because its mapped to the properties name
const initialForm = [
  'name',
  'email',
  'environment',
  {
    key: 'comment',
    type: 'textarea',
    placeholder: 'Make a comment',
  },
]

// what is the properties the whole form it has
const initialSchema = {
  type: 'object',
  title: 'Comment',
  properties: {
    name: {
      title: 'Name',
      type: 'string',
      default: 'Steve',
    },
    email: {
      title: 'Email',
      type: 'string',
      pattern: '^\\S+@\\S+$',
      validationMessage: 'Email must be of proper format: example@example',
      description: 'Email will be used for evil.',
    },
    environment: {
      type: 'string',
      title: 'Environment',
      enum: ['LOCAL', 'SIT1', 'SIT2', 'SIT3', 'UAT1', 'UAT2'],
    },
    comment: {
      title: 'Comment',
      type: 'string',
      maxLength: 20,
      validationMessage: "Don't be greedy! 20 Characters max please :)",
      description: 'Please write your comment here.',
    },
  },
  required: ['name', 'email', 'comment'],
}

const SchemaViewer = ({ fieldKey }) => {
  const [schema, setSchema] = useState(initialSchema)
  const [schemaElements, setSchemaElements] = useState([])

  useEffect(() => {
    if (fieldKey.length > 0) {
      generateSchemaForm()
    }
  }, [schema, fieldKey])

  const generateSchemaForm = () => {
    // get the schema based on the fieldKey value
    const result = _(schema.properties[fieldKey])
      .map((field, id) => {
        return (
          <Input
            key={`${fieldKey}_${id}`}
            name={id}
            label={insertSpaces(id)}
            defaultValue={field}
            type={'text'}
          />
        )
      })
      .value()

    setSchemaElements(result)
    console.log('schema', result)
  }

  return (
    <div
      className={clsx(
        'mt-4 text-black px-4',
        {
          // 'rounded-full': corner === 'rounded-full',
        }
        // className
      )}
    >
      {/* <button
        className="text-pink-500 bg-transparent border border-solid active:bg-pink-600 font-semi-bold text-xs px-4 py-2  outline-none focus:outline-none flex flex-wrap items-center"
        type="button"
        onClick={() => {
          console.log('hi')
          generateSchemaForm()
        }}
      >
        <i className="fas inline-block pr-2">
          <Icon className="h-4 w-4" icon="plus" />
        </i>
        Textbox
      </button> */}
      <div key={fieldKey}>{schemaElements}</div>
    </div>
  )
}

export default SchemaViewer
