// @flow
import React from 'react'
import SchemaForm from '../common/form/SchemaForm'
import utils from '../common/form/utils'
import AceEditor from 'react-ace'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-github'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core'
import Localizer from './localizer'
import SelectLabel from './selectlabel'
import ErrorBoundary from './ErrorBoundary'
import LayoutBuilder from '../layout-builder/layout-builder.component'

// RcSelect is still in migrating process so it's excluded for now
// import RcSelect from 'react-schema-form-rc-select/lib/RcSelect';
const examples = {
  localizer: Localizer,
  selectLabel: SelectLabel,
}

type State = {
  showErrors: boolean,
}

class ExamplePage extends React.Component<void, State> {
  tempModel = {
    comments: [
      {
        name: '1',
      },
      {
        name: '2',
      },
    ],
  }

  state = {
    // tests: [
    //   {
    //     label: 'Simple',
    //     value: 'data/simple.json',
    //   },
    //   {
    //     label: 'Triple Boolean',
    //     value: 'data/noanswer.json',
    //   },
    //   {
    //     label: 'Simple Array',
    //     value: 'data/simplearray.json',
    //   },
    //   {
    //     label: 'Basic JSON Schema Type',
    //     value: 'data/types.json',
    //   },
    //   {
    //     label: 'Checkbox',
    //     value: 'data/checkbox.json',
    //   },
    //   {
    //     label: 'Basic Radios',
    //     value: 'data/radio.json',
    //   },
    //   {
    //     label: 'Condition',
    //     value: 'data/condition.json',
    //   },
    //   {
    //     label: 'Help',
    //     value: 'data/help.json',
    //   },
    //   {
    //     label: 'Kitchen Sink',
    //     value: 'data/kitchenSink.json',
    //   },
    //   {
    //     label: 'Login',
    //     value: 'data/login.json',
    //   },
    //   {
    //     label: 'Date',
    //     value: 'data/date.json',
    //   },
    //   {
    //     label: 'Number',
    //     value: 'data/number.json',
    //   },
    //   {
    //     label: 'Timestamp',
    //     value: 'data/timestamp.json',
    //   },
    //   {
    //     label: 'Subjects',
    //     value: 'data/subjects.json',
    //   },
    //   {
    //     label: 'Readonly',
    //     value: 'data/readonly.json',
    //   },
    //   {
    //     label: 'Array',
    //     value: 'data/array.json',
    //   },
    //   {
    //     label: 'Object',
    //     value: 'data/object.json',
    //   },
    //   {
    //     label: 'Select',
    //     value: 'selectLabel',
    //   },
    //   {
    //     label: 'ArraySelect',
    //     value: 'data/arrayselect.json',
    //   },
    //   {
    //     label: 'htmlClass',
    //     value: 'data/htmlclass.json',
    //   },
    //   {
    //     label: 'Tuples',
    //     value: 'data/tuple.json',
    //   },
    //   {
    //     label: 'Advanced Tuples',
    //     value: 'data/tuple-advanced.json',
    //   },
    //   {
    //     label: 'Conditional Array',
    //     value: 'data/conditionalarray.json',
    //   },
    //   {
    //     label: 'Markdown',
    //     value: 'data/markdown.json',
    //   },
    //   {
    //     label: 'Taxonomy',
    //     value: 'data/taxonomy.json',
    //   },
    //   {
    //     label: 'Test - Date Capture',
    //     value: 'data/tests/datecapture.json',
    //   },
    //   {
    //     label: 'Test - Localizer',
    //     value: 'localizer',
    //   },
    //   {
    //     label: 'Portal Config',
    //     value: 'data/portal/config-detail.json',
    //   },
    //   {
    //     label: 'Portal Quiz',
    //     value: 'data/portal/quiz.json',
    //   },
    //   {
    //     label: 'Schema Form',
    //     value: 'data/portal/schema-form.json',
    //   },
    //   {
    //     label: 'Logger Config',
    //     value: 'data/portal/logger-config.json',
    //   },
    //   {
    //     label: 'Portal Category',
    //     value: 'data/portal/category.json',
    //   },
    //   {
    //     label: 'MapRoot Restaurant',
    //     value: 'data/maproot/restaurant.json',
    //   },
    //   {
    //     label: 'MapRoot Payment',
    //     value: 'data/maproot/payment.json',
    //   },
    //   {
    //     label: 'MapRoot Pickup',
    //     value: 'data/maproot/pickup.json',
    //   },
    // ],
    tests: [
      {
        label: 'Login',
        value: 'data/login.json',
      },
    ],
    validationResult: {},
    schema: {},
    form: [],
    layout: {},
    model: {},
    schemaJson: '',
    formJson: '',
    layoutJson: '',
    selected: '',
    currentLayout: 'sm',
    localization: undefined,
    showErrors: false,
  }

  setStateDefault = () =>
    this.setState({
      model: this.tempModel,
    })

  onSelectChange = ({ target: { value } }) => {
    // value = value || 'data/login.json'
    if (!value) {
      this.setState({
        schemaJson: '',
        formJson: '',
        layoutJson: '',
        selected: '',
        schema: {},
        layout: {},
        model: {},
        form: [],
        showErrors: false,
      })
    }

    if (!value.endsWith('json')) {
      const elem = examples[value]
      this.setState({
        schemaJson: JSON.stringify(elem.schema, undefined, 2),
        formJson: JSON.stringify(elem.form, undefined, 2),
        layoutJson: JSON.stringify(elem.layout, undefined, 2),
        selected: value,
        schema: elem.schema,
        model: elem.model || {},
        layout: elem.layout,
        form: elem.form,
        localization: elem.localization,
        showErrors: false,
      })
    } else {
      fetch(value)
        .then((x) => x.json())
        .then(({ form, schema, model, layout }) => {
          this.setState({
            schemaJson: JSON.stringify(schema, undefined, 2),
            formJson: JSON.stringify(form, undefined, 2),
            layoutJson: JSON.stringify(layout, undefined, 2),
            selected: value,
            schema,
            layout,
            model: model || {},
            form,
            showErrors: false,
          })
        })
    }
  }

  onModelChange = (key, val, type) => {
    const { model } = this.state
    const newModel = model
    utils.selectOrSet(key, newModel, val, type)
    this.setState({
      model: newModel,
    })
  }

  onValidate = () => {
    const { schema, model } = this.state
    const result = utils.validateBySchema(schema, model)
    this.setState({
      validationResult: result,
      showErrors: true,
    })
  }

  onFormChange = (val) => {
    try {
      const form = JSON.parse(val)
      this.setState({
        formJson: val,
        form,
      })
    } catch (e) {
      console.error(e)
    }
  }

  onSchemaChange = (val) => {
    try {
      const schema = JSON.parse(val)
      this.setState({
        schemaJson: val,
        schema,
      })
    } catch (e) {
      console.error(e)
    }
  }

  onLayoutChange = (val) => {
    // console.log('layout changed')
  }

  render() {
    const {
      schema,
      form,
      model,
      layout,
      validationResult,
      currentLayout,
      selected,
      tests,
      formJson,
      schemaJson,
      localization,
      showErrors,
    } = this.state
    const mapper = {
      // 'rc-select': RcSelect
    }

    this.onSelectChange({ target: { value: 'data/login.json' } })

    let schemaForm = ''
    let validate = ''

    if (form.length > 0) {
      // console.log('data-grid', layout)
      // console.log('example page schema', schema)
      schemaForm = (
        <LayoutBuilder
          onLayoutChange={this.onLayoutChange}
          initialSchema={schema}
          initialForm={form}
          initialLayout={layout[currentLayout]}
          onModelChange={this.onModelChange}
          mapper={mapper}
          model={model}
          localization={localization}
          showErrors={showErrors}
        />
        // <SchemaForm
        //   schema={schema}
        //   form={form}
        //   layout={layout[currentLayout]}
        //   onModelChange={this.onModelChange}
        //   mapper={mapper}
        //   model={model}
        //   localization={localization}
        //   showErrors={showErrors}
        // />
      )
      validate = (
        <div>
          <Button variant="contained" color="primary" onClick={this.onValidate}>
            Validate{' '}
          </Button>{' '}
          <Button
            variant="contained"
            color="primary"
            onClick={this.setStateDefault}
          >
            Throw temp model in
          </Button>{' '}
          <pre> {JSON.stringify(validationResult, undefined, 2)} </pre>{' '}
        </div>
      )
    }

    return (
      <>{schemaForm}</>
      // <div className="col-md-12">
      //   <h1> Schema Form Example </h1>{' '}
      //   <div className="row">
      //     <div className="col-sm-4">
      //       <h3
      //         style={{
      //           display: 'inline-block',
      //         }}
      //       >
      //         The Generated Form{' '}
      //       </h3>{' '}
      //       {schemaForm} <h3> Model </h3>{' '}
      //       <pre> {JSON.stringify(model, undefined, 2)} </pre> {validate}{' '}
      //     </div>{' '}
      //     <div className="col-sm-8">
      //       <h3> Select Example </h3>{' '}
      //       <FormControl
      //         classes={{
      //           root: 'form-group',
      //         }}
      //         style={{
      //           minWidth: 150,
      //         }}
      //       >
      //         <InputLabel htmlFor="select-test">select - test </InputLabel>{' '}
      //         <Select
      //           autoWidth
      //           name="selectTest"
      //           inputProps={{
      //             name: 'selectTest',
      //             id: 'select-test',
      //           }}
      //           value={selected}
      //           onChange={this.onSelectChange}
      //         >
      //           {tests.map(({ label, value }) => (
      //             <MenuItem key={value} value={value}>
      //               {' '}
      //               {label}{' '}
      //             </MenuItem>
      //           ))}{' '}
      //         </Select>{' '}
      //       </FormControl>{' '}
      //       <h3> Form </h3>{' '}
      //       <AceEditor
      //         mode="json"
      //         theme="github"
      //         height="300px"
      //         width="800px"
      //         onChange={this.onFormChange}
      //         name="aceForm"
      //         value={formJson}
      //         editorProps={{
      //           $blockScrolling: true,
      //         }}
      //       />{' '}
      //       <h3> Schema </h3>{' '}
      //       <AceEditor
      //         mode="json"
      //         theme="github"
      //         height="300px"
      //         width="800px"
      //         onChange={this.onSchemaChange}
      //         name="aceSchema"
      //         value={schemaJson}
      //         editorProps={{
      //           $blockScrolling: true,
      //         }}
      //       />{' '}
      //     </div>{' '}
      //   </div>{' '}
      // </div>
    )
  }
}

export default ExamplePage
