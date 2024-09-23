export const useContext = (key: symbol) => {
  return inject(key)
}

export const createContext = (key: symbol, value: any) => {
  provide(key, value)
}
