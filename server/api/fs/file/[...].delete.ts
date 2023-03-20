import { getFilePath } from '@/utils/fsutils'
import fs from 'fs'

export default defineEventHandler((e) => {
    let fpath = getFilePath(e)
    fs.unlinkSync(fpath)
    return "ok"
})