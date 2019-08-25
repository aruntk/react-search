/**
 * Basic debounce function
 */
function debounce(callback: Function, wait: number) {
  let timeout = 0
  
  return function() {
    const callNow = !timeout
    const next = () => callback.apply(null, arguments)
    
    clearTimeout(timeout)
    timeout = setTimeout(next, wait)

    if (callNow) {
      next()
    }
  }
}

export default debounce
