import { startContentApp } from './content/app'

startContentApp().catch(err => {
  console.error('failed to start extension content script', err)
})
