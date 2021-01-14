import React from 'react'
import Dashboard from './pages/dashboard/dashboard.component'

import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

const App = (props) => <Dashboard />

const mapStateToProps = createStructuredSelector({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(App)
