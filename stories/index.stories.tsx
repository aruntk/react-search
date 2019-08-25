import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// tslint:disable-next-line:import-name
import Search from '../src/search'
// tslint:disable-next-line:import-name
import Menu from '../src/menu'
import users from './users'

storiesOf('Search', module)
.add('basic usage', () => <Search users={users} onChange={action('changed')} />)

storiesOf('Menu', module)
.add('basic usage', () => (
  <Menu>
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <div>Item 4</div>
  </Menu>
)
)


storiesOf('button', module)
.add('with text', () => <button onClick={action('clicked')}>Hello Button</button>)
.add('with some emoji', () => (
  <button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </button>
))


