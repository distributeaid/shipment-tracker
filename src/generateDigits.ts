import { randomInt } from 'crypto'

export const generateDigits = (len: number): string => {
  let digits = ''
  while (digits.length < len) {
    digits += randomInt(0, 9)
  }
  return digits
}
