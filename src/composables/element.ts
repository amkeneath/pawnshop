function getStylePropertyValue(element: HTMLElement, prop: string): string {
  return getComputedStyle(element)?.getPropertyValue(prop)
}
function getTransitionDuration(element: HTMLElement): number {
  return parseFloat(getStylePropertyValue(element, 'transition-duration')) * 1000
}
function requestFocus(element?: HTMLElement): void {
  document.querySelectorAll('.focus-element').forEach((element) => {
    element.classList.remove('focus-element')
  })
  if (element) element.classList.add('focus-element')
  document.querySelector('html')?.classList[getAddOrRemove(!!element)]('pointer-events-none')
}
function clearFocus(): void {
  requestFocus()
}

export { clearFocus, getStylePropertyValue, getTransitionDuration, requestFocus }
