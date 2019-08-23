import * as React from 'react'

export interface ReactSearchProps {
  users: string[]
}

/**
 * React Search Element
 */
class ReactSearch extends React.Component {
  constructor(props: ReactSearchProps) {
    super(props)
  }
  // tslint:disable-next-line:completed-docs
  render() {
    return <div>Hello world</div>
  }
}

export default ReactSearch
