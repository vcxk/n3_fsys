import { workdir,getFilePath} from '@/utils/fsutils'
import fs from 'fs'

export default defineEventHandler((e) => {
    let p = getFilePath(e)
    return sendStream(e,fs.createReadStream(p))
})