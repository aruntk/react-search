import * as React from 'react'
import { HoverHighlight } from '../highlight'

interface MenuProps {
  style?: React.CSSProperties
}

interface MenuState {
  selectedIndex: number
}
/**
 * Convert react node to array of elements
 */

function nodeToArray(children: React.ReactNode) {
  const ret: React.ReactNode[] = []
  React.Children.forEach(children, (c) => {
    ret.push(c)
  })
  return ret
}

/**
 * Menu which gets displayed on search
 */
class Menu extends React.Component<MenuProps, MenuState> {
  activeItemRef?: HTMLDivElement
  containerDivRef?: HTMLDivElement
  state = {
    selectedIndex: 0
  }
  saveActiveElementRef = (ref: HTMLDivElement) => {
    this.activeItemRef = ref
  }
  saveContainerDivRef = (ref: HTMLDivElement) => {
    this.containerDivRef = ref
  }
  getElementOffset = (el: HTMLDivElement) => {
    const box = el.getBoundingClientRect()
    return box.top + window.pageYOffset
  }
  scrollActiveItemIntoView = () => {
    if (this.activeItemRef && this.containerDivRef) {
      // this.activeItemRef.scrollIntoView()
      const activeElementOffset = this.getElementOffset(this.activeItemRef)
      const containerOffset = this.getElementOffset(this.containerDivRef)
      const elementOffsetInsideContainer = activeElementOffset - containerOffset
      const activeElementHeight = this.activeItemRef.offsetHeight
      const containerHeight = this.containerDivRef.offsetHeight
      const diffBottom = elementOffsetInsideContainer + activeElementHeight - containerHeight
      const diffTop = elementOffsetInsideContainer
      const diff = diffTop < containerHeight && diffTop > 0 ? 0 : (diffBottom < 0 ? diffTop : diffBottom)
      this.containerDivRef.scrollTop += diff
    } 
  }
  _setSelectedIndex = (index: number, callback?: Function) =>  {
     this.setState({
      selectedIndex: index,
     }, () => {
       if (callback) {
         callback(index)
       }
     })
  }
  setSelectedIndex = (index: number) => {
    this._setSelectedIndex(index, this.scrollActiveItemIntoView)
  }
  moveSelectedIndex = (inc: number) => {
    const incIndex = this.state.selectedIndex + inc
    const max = React.Children.count(this.props.children)
    const newIndex = incIndex < 0 || incIndex >= max ? this.state.selectedIndex : incIndex
    if (newIndex !== this.state.selectedIndex) {
      this.setSelectedIndex(newIndex)
    }
  }
  handleMenuItemMouseMove = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (this.state.selectedIndex !== index) {
      this._setSelectedIndex(index)
    }
  }
  /**
   * get a menu list with ref of active item
   */
  renderMenu() {
    const children = nodeToArray(this.props.children)
    const { selectedIndex } = this.state
    const processedChildren = children.map((child, index) => {
      const menuItemProps = {
        onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => this.handleMenuItemMouseMove(event, index)
      }

      if (index === selectedIndex) {
        return (
          <div
            key={index}
            ref={this.saveActiveElementRef}
            {...menuItemProps}
          >
            <HoverHighlight>{child}</HoverHighlight>
          </div>
        )
      }
      return (<div key={index} {...menuItemProps}>{child}</div>)
    })
    return processedChildren
  }
  // tslint:disable-next-line:completed-docs
  render() {
    return (
      <div style={this.props.style} ref={this.saveContainerDivRef}>
        {this.renderMenu()}
      </div>
    ) 
  }
}

export default Menu
