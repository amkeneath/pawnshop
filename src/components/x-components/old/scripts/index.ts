interface Styles {
  base: string
  focus: string
  radius: string
  transition: string
}
export const xId = (): string => `${Math.random()}${Date.now()}`.replace('0.', '')

export const height = 'h-10'

export const styles: Styles = {
  base: `relative block overflow-hidden ${height}`,
  focus: 'outline-none ring-offset-2 focus:ring-2 focus-within:ring-2',
  radius: 'rounded-md',
  transition: 'transition-all duration-500'
}

export const xColor = {
  op: (color: string | undefined): string => `bg-${color ? `${color}` : 'base-500'}/20`,
  bg: (color: string | undefined): string => `bg-${color ? `${color}` : 'base-500'}`,
  focus: (color: string | undefined): string => `ring-${color ? `${color}-tint` : 'base-300'}`,
  hover: (color: string | undefined): string => `hover:bg-${color ? `${color}-shade` : 'base-600'}`,
  text: (color: string | undefined): string => `text-${color ? `${color}` : 'base-500'}`
}
