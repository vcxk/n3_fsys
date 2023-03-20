import { H3Event } from 'h3'
import fs from 'fs'
import path from 'path' 
import { getFilePath } from '@/utils/fsutils'

export default defineEventHandler(async (e:H3Event) => {
    let formdata = await readMultipartFormData(e) || []
    let dir = getFilePath(e)
    if (!fs.lstatSync(dir).isDirectory()) {
        throw createError(dir + " is not a directory")
    }
    for (const data of formdata) {
        let filename = data.filename
        if (!filename) { continue }
        let fpath = path.resolve(dir,filename)
        if (fs.existsSync(fpath)) { 
            throw createError( filename + ' exists' )
        }
        fs.createWriteStream(fpath).write(data.data)
    }
    return "ok"
})