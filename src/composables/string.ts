const toCamelCase = (str = ''): string => str.replace(/-./g, (x) => x[1].toUpperCase())

export { toCamelCase }
