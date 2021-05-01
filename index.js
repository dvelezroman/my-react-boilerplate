import React from 'react'
import { render as Render } from 'react-dom'

import App from './src/App'

Render(
    <App />,
    document.getElementById('root')
)

module.hot.accept();
