/**
 * Constant time string comparison.
 * Typescript version of [Bruce17's safe-compare](https://github.com/Bruce17/safe-compare)
 * @returns Boolean that confirms whether the string is the same
 */
export const safeCompare = (a: string, b: string) => {
  const stringA = String(a)
  const lengthA = stringA.length
  let stringB = String(b)
  let result = 0

  if (lengthA !== stringB.length) {
    stringB = stringA
    result = 1
  }

  for (let i = 0; i < lengthA; i++) {
    result |= stringA.charCodeAt(i) ^ stringB.charCodeAt(i)
  }

  return result === 0
}
