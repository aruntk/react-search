import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// tslint:disable-next-line:import-name
import Search from '../src/search'
import users from './users'

storiesOf('Search', module)
.add('basic usage', () => <Search users={users} />)

storiesOf('button', module)
.add('with text', () => <button onClick={action('clicked')}>Hello Button</button>)
.add('with some emoji', () => (
  <button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </button>
))


