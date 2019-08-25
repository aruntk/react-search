import * as React from 'react'
// tslint:disable-next-line:import-name
import Menu from '../menu'
import { TextHighlight } from '../highlight'
import debounce from '../utils/debounce'


interface UserInterface {
  id: string
  name: string
  items: string[]
  address: string
  pincode: string
}
type KeyBoardEventHandler = (e: React.KeyboardEvent<HTMLInputElement>) => void
type ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => void
export interface SearchProps {
  users?: UserInterface[]
  onChange?: ChangeEventHandler
  onKeyDown?: KeyBoardEventHandler
  width?: number
  menuMaxHeight?: number
}
export interface  SearchState {
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
class Search extends React.Component<SearchProps, SearchState> {
  menuRef?: Menu
  state = {
    value: ''
  }
  constructor(props: SearchProps) {
    super(props)
    this._handleInputChange = debounce(this._handleInputChange.bind(this), 500)
  }
  saveMenuRef = (ref: Menu) => {
    this.menuRef = ref
  }
  /**
   * debounced method to set search value
   */
  _handleInputChange(value: string) {
    this.setState({
      value
    })
    if (this.menuRef) {
      // reset selected index of menu 
      this.menuRef.setSelectedIndex(0)
    }
  }
  handleInputChange: ChangeEventHandler = (event) => {
    this._handleInputChange(event.target.value)
    if (this.props.onChange) {
      this.props.onChange(event)
    }

  }
  /**
   * split the given text using search value and return array of elements
   */
  getHighlightedText(text: string) {
    const { value } = this.state
    // Split on higlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${value})`, 'gi'))
    const highlightText = (part: string, i: number) => {
      return part.toLowerCase() === value.toLowerCase() ? <TextHighlight>{part}</TextHighlight> : part
    }
    return (
      <span> {parts.map(highlightText)}</span>
    )
  }
  /**
   * get the user card list item
   */
  getDropdownListItem(user: UserInterface) {
    const { value } = this.state
    return (
      <div key={user.id} style={{ borderBottom: '1px solid #aaa' }}>
        <b>{this.getHighlightedText(user.id)}</b>
        <div>{this.getHighlightedText(user.name)}</div>
        {user.items.find((item) => (item.indexOf(value) > -1)) ? <div>{`${value} found in items`}</div> : null}
        <div>{this.getHighlightedText(user.address)}, {this.getHighlightedText(user.pincode)}</div>
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
    const filteredUsers = users.map((user) => {
      // join all searchable fields together
      const searchStr = Object.values(user).map((v) => {
        return typeof v === 'string' ? v : v.join('\n')
        // joining with new line char as new line char will never be entered by user
      }).join('\n')
      if (searchStr.toLowerCase().indexOf(this.state.value.toLowerCase()) > -1) {
        return this.getDropdownListItem(user)
      }
    }).filter(u => u)
    if (filteredUsers.length) {
      return (
        <Menu ref={this.saveMenuRef} style={{ width: this.getWidthInPx(), maxHeight: `${menuMaxHeight}px`, overflow: 'auto' }} >
          {filteredUsers}
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

export default Search
