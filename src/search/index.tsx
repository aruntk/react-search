import * as React from 'react'


interface UserInterface {
  id: string
  name: string
  items: string[]
  address: string
  pincode: string
}
export interface ReactSearchProps {
  users?: UserInterface[]
}
export interface  ReactSearchState {
  value: string
}

/**
 * React Search Element
 */
class ReactSearch extends React.Component<ReactSearchProps, ReactSearchState> {
  state = {
    value: ''
  }
  constructor(props: ReactSearchProps) {
    super(props)
  }
  handleInputChange = (e: any) => {
    this.setState({
      value: e.target.value
    })
  }
  /**
   * get the user card list item
   */

  getDropdownListItem(user: UserInterface) {
    return (
      <li key={user.id}>
        {user.name}
      </li>
    )
  }
  /**
   * get a filtered list of users based on the search term
   */
  getDropdown() {
    const { users = [] } = this.props
    if (!this.state.value) {
      return null
      // return users.map(this.getDropdownListItem)
    }
    // react will ignore undefined, so map can be used
    const filteredUsers = users.filter((user) => {
      const regx = new RegExp(this.state.value, 'i')
      return user.name.match(regx)
    }) 
    if (filteredUsers.length) {
      return (
        <ul>
          {filteredUsers.map(this.getDropdownListItem)}
        </ul>
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
        <input type="search" placeholder="Search users by ID, address, name" onChange={this.handleInputChange} />
        <ul>
          {this.getDropdown()}
        </ul>
      </React.Fragment>
    )
  }
}

export default ReactSearch
