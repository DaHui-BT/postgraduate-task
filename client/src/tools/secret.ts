import { md5 } from 'js-md5'

function alert_close(message: string = "You do not have permission to access!") {
  alert(message)
  window.open('about:blank','_self')
}

function encode(key: string, salt: string): string {
  // @ts-ignore
  return md5(key, salt)
}

function verify(secret: string, secret_key: string): boolean {
  return secret === secret_key
}

export {
  alert_close,
  verify,
  encode
}
