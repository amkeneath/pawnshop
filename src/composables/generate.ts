function generateId(): string {
  return `gen-${`${Math.random()}${Date.now()}`.slice(2)}`
}

export { generateId }
