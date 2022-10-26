type AddRemove = 'add' | 'remove'

function getAddOrRemove(add = false): AddRemove {
  return add ? 'add' : 'remove'
}

function extendBeforeExtension(string: string, extend = ''): string {
  const idx = string.lastIndexOf('.')
  return ~idx ? `${string.slice(0, idx)}${extend}${string.slice(idx)}` : string
}

function extractNumbers(string: string): Array<number> {
  const numbers = string.match(/[0-9]+/g)
  if (Array.isArray(numbers)) return numbers.map((number: string): number => +number)
  return []
}

function groupedDecimals(number = 0, max = 2, min = 2): string {
  return number.toLocaleString('en-US', { minimumFractionDigits: min, maximumFractionDigits: max })
}

function hslToHex(h = 0, s = 0, l = 0): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number): string => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function toCamelCase(string: string): string {
  return string.replace(/-./g, (x) => x[1].toUpperCase())
}

export { extendBeforeExtension, extractNumbers, getAddOrRemove, groupedDecimals, hslToHex, toCamelCase }
