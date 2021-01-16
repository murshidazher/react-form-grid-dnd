import React, {useState, useEffect} from 'react'
import './schema-viewer.styles.scss'
import Icon from 'react-hero-icon'
import _ from 'lodash'
import clsx from 'clsx'
import Input from '../common/input.component'
import {insertSpaces} from '../../utils/capitalize'

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

const SchemaViewer = ({form, fieldKey}) => {
  // const [schema, setSchema] = useState(initialSchema)
  const [schemaElements, setSchemaElements] = useState([])

  useEffect(() => {
    if (fieldKey.length > 0) {
      generateSchemaForm()
    }
  }, [form, fieldKey])

  const generateSchemaForm = () => {
    // get the schema based on the fieldKey value
    const newForm = {
      title: form['title'],
      required: form['required'],
    }

    const result = _(newForm)
      .map((val, id) => {
        return (
          <Input
            key={`${fieldKey}_${id}`}
            name={id}
            label={insertSpaces(id)}
            defaultValue={val}
            type={'text'}
          />
        )
      })
      .value()

    setSchemaElements(result)
  }

  return (
    <div
      className={clsx(
        'mt-4 text-black px-4',
        {
          // 'rounded-full': corner === 'rounded-full',
        },
        // className
      )}>
      <div key={fieldKey}>{schemaElements}</div>
    </div>
  )
}

export default SchemaViewer
