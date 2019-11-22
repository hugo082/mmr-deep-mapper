const PATH_DELIMITER = "_"

export const appendToPath = (path: string, index: number) => {
  const delimiter = path ? PATH_DELIMITER : ""
  return `${path}${delimiter}${index}`
}
