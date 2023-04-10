export const logger = {
  debug(message: string, props?: Record<string, any>) {
    const msg = `[yamashina] ${message}`

    if (props) {
      console.debug(msg, props)
    } else {
      console.debug(msg)
    }
  },
}
