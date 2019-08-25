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
  menuOpen: boolean
  menuSelectedIndex: number
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
  state = {
    value: '',
    menuOpen: false,
    menuSelectedIndex: 0
  }
  _debouncedMoveMenuSelectedIndex: Function
  constructor(props: SearchProps) {
    super(props)
    this._handleInputChange = debounce(this._handleInputChange.bind(this), 500)
    this._debouncedMoveMenuSelectedIndex = debounce(this.moveMenuSelectedIndex, 20)
  }
  /**
   * debounced method to set search value
   */
  _handleInputChange(value: string) {
    this.setState({
      value,
      menuSelectedIndex: 0
    })
  }
  handleInputChange: ChangeEventHandler = (event) => {
    this._handleInputChange(event.target.value)
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }
  handleInputFocus = () => {
    this.setState({
      menuOpen: true
    }) 
  }

  handleInputBlur = () => {
    this.setState({
      menuOpen: false
    }) 
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
  renderMenuItem(user: UserInterface) {
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
   * get the total number of users matched with search value
   */
  matchCount() {
    const { users = [] } = this.props
    const filteredUsers = users.filter((user) => {
      // join all searchable fields together
      const searchStr = Object.values(user).map((v) => {
        return typeof v === 'string' ? v : v.join('\n')
        // joining with new line char as new line char will never be entered by user
      }).join('\n')
      return searchStr.toLowerCase().indexOf(this.state.value.toLowerCase()) > -1
    })
    return filteredUsers.length
  }
  handleMenuSelectionChange = (selectedIndex: number) => {
    this.setState({
      menuSelectedIndex: selectedIndex,
    })
  }
  propagateKeyboardEvent = (event: React.KeyboardEvent<HTMLInputElement>, fn?: KeyBoardEventHandler) => {
    if (fn)  {
      fn(event)
    }
  }
  moveMenuSelectedIndex = (inc: number) => {
    const incIndex = this.state.menuSelectedIndex + inc
    const max = this.matchCount()
    const newIndex = incIndex < 0 || incIndex >= max ? this.state.menuSelectedIndex : incIndex
    if (newIndex !== this.state.menuSelectedIndex) {
      this.setState({
        menuSelectedIndex: newIndex,
      })
    }
  }

  handleKeyDown: KeyBoardEventHandler = (event) => {
    if (moveIndexMap[event.keyCode]) {
      event.preventDefault()
      this._debouncedMoveMenuSelectedIndex(moveIndexMap[event.keyCode])
    }
  }
  getWidthInPx = () => {
    const { width = defaultWidth } = this.props
    return `${width}px`
  }
  /**
   * get a filtered list of users based on the search term
   */
  renderMenu() {
    const { users = [], menuMaxHeight = 200 } = this.props
    if (!this.state.value || !this.state.menuOpen) {
      return null
      // return users.map(this.renderMenuItem)
    }
    const filteredUsers = users.map((user) => {
      // join all searchable fields together
      const searchStr = Object.values(user).map((v) => {
        return typeof v === 'string' ? v : v.join('\n')
        // joining with new line char as new line char will never be entered by user
      }).join('\n')
      if (searchStr.toLowerCase().indexOf(this.state.value.toLowerCase()) > -1) {
        return this.renderMenuItem(user)
      }
    }).filter(u => u)
    if (filteredUsers.length) {
      return (
        <Menu
          selectedIndex={this.state.menuSelectedIndex}
          style={{ width: this.getWidthInPx(), maxHeight: `${menuMaxHeight}px`, overflow: 'auto' }}
          onSelectionChange={this.handleMenuSelectionChange}
        >
          {filteredUsers}
        </Menu>
      ) 
    }
    return (
      <div>No Users Found</div>
    )
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
          onBlur={this.handleInputBlur}
          onFocus={this.handleInputFocus}
        />
        {this.renderMenu()}
      </React.Fragment>
    )
  }
}

export default Search
