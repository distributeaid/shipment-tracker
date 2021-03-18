import { URL } from 'url'

/**
 * Checks if a string is a valid URL by initializing a node.js URL
 * object with it. See node docs for more info:
 * https://nodejs.org/api/url.html#url_new_url_input_base
 * @param url the URL to validate
 */
const stringIsUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

export default stringIsUrl
