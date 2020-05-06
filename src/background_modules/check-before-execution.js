import fs from 'fs'
import path from 'path'

export default function checkBeforeExecution () {
  fs.access(path.join(process.env.PORTABLE_EXECUTABLE_DIR, '정리'), fs.constants.F_OK, (err) => {
    if (err) fs.mkdir(path.join(process.env.PORTABLE_EXECUTABLE_DIR, '정리'), (err) => { if (err) throw err })
  })

  fs.access(path.join(process.env.PORTABLE_EXECUTABLE_DIR, '미정리'), fs.constants.F_OK, (err) => {
    if (err) fs.mkdir(path.join(process.env.PORTABLE_EXECUTABLE_DIR, '미정리'), (err) => { if (err) throw err })
  })
}
