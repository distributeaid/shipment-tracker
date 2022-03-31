import { authCookieName } from '../../authenticateRequest'

export const tokenCookieRx = new RegExp(`${authCookieName}=([^;]+);`, 'i')
