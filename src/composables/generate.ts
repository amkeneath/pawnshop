const generateId = (): string => `gen-${`${Math.random()}${Date.now()}`.slice(2)}`

export { generateId }
