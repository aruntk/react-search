import * as React from 'react'
// tslint:disable-next-line:import-name
import Menu from '../menu'


interface UserInterface {
  id: string
  name: string
  items: string[]
  address: string
  pincode: string
}
type KeyBoardEventHandler = (e: React.KeyboardEvent<HTMLInputElement>) => void
type ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => void
export interface ReactSearchProps {
  users?: UserInterface[]
  onChange?: ChangeEventHandler
  onKeyDown?: KeyBoardEventHandler
  width?: number
  menuMaxHeight?: number
}
export interface  ReactSearchState {
  value: string
}

const moveIndexMap = {
  38: -1,
  40: 1
}
const defaultWidth = 200

/**
 * React Search Element
 */
class ReactSearch extends React.Component<ReactSearchProps, ReactSearchState> {
  menuRef?: Menu
  state = {
    value: ''
  }
  constructor(props: ReactSearchProps) {
    super(props)
  }
  saveMenuRef = (ref: Menu) => {
    this.menuRef = ref
  }
  handleInputChange: ChangeEventHandler = (event) => {
    this.setState({
      value: event.target.value
    })
    if (this.menuRef) {
      // reset selected index of menu 
      this.menuRef.setSelectedIndex(0)
    }
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }
  /**
   * get the user card list item
   */

  getDropdownListItem(user: UserInterface) {
    return (
      <div key={user.id} style={{ borderBottom: '1px solid #aaa' }}>
        <b>{user.id}</b>
        <div>{user.name}</div>
        <div>{user.address}, {user.pincode}</div>
      </div>
    )
  }
  /**
   * get a filtered list of users based on the search term
   */
  getDropdown() {
    const { users = [], menuMaxHeight = 200 } = this.props
    if (!this.state.value) {
      return null
      // return users.map(this.getDropdownListItem)
    }
    const filteredUsers = users.filter((user) => {
      const regx = new RegExp(this.state.value, 'i')
      return user.name.match(regx)
    }) 
    if (filteredUsers.length) {
      return (
        <Menu ref={this.saveMenuRef} style={{ width: this.getWidthInPx(), maxHeight: `${menuMaxHeight}px`, overflow: 'auto' }} >
          {filteredUsers.map(this.getDropdownListItem)}
        </Menu>
      ) 
    }
    return (
      <div>No Users Found</div>
    )
  }
  propagateKeyboardEvent = (event: React.KeyboardEvent<HTMLInputElement>, fn?: KeyBoardEventHandler) => {
    if (fn)  {
      fn(event)
    }
  }
  handleKeyDown: KeyBoardEventHandler = (event) => {
    if (moveIndexMap[event.keyCode] && this.menuRef && this.menuRef.setSelectedIndex) {
      event.preventDefault()
      this.menuRef.moveSelectedIndex(moveIndexMap[event.keyCode])
    }
    this.propagateKeyboardEvent(event, this.props.onKeyDown)
  }
  getWidthInPx = () => {
    const { width = defaultWidth } = this.props
    return `${width}px`
  }
  // tslint:disable-next-line:completed-docs
  render() {
    return (
      <React.Fragment>
        <input
          type="search"
          style={{ width: this.getWidthInPx() }}
          placeholder="Search users by ID, address, name"
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
        />
        {this.getDropdown()}
      </React.Fragment>
    )
  }
}

export default ReactSearch
