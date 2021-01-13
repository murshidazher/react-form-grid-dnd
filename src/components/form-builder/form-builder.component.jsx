import React from 'react'
import { DragSourceBox } from '../drag-source-box/drag-source-box.component'
import { FormElements } from '../FormElements'
import './form-builder.styles.scss'
import Icon from 'react-hero-icon'
import { SmileOutlined } from '@ant-design/icons'

const FormBuilder = (props) => (
  <DragSourceBox draggable={false}>
    <div className="text-black px-2">
      <DragSourceBox color={FormElements.text}>
        <a
          className="cursor-move flex items-center font-medium text-sm px-3 hover:text-gray-900 transition-colors duration-200 mb-4 text-gray-900"
          onClick={() => console.log('hi')}
        >
          <div className="mr-3 p-1 rounded-sm bg-gray-500">
            <SmileOutlined />
            {/* <Icon className="h-3 w-3 text-white" icon="pencil" /> */}
          </div>
          {/* <i className="fas inline-block pr-2">
        
      </i> */}
          Textbox
        </a>
      </DragSourceBox>
    </div>
  </DragSourceBox>
)

export default FormBuilder
