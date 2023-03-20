import path from 'path'
import { H3Event } from 'h3'
import os from 'os'

export const workdir = process.env?.ROOT_DIR || "/Users/chenxuke/work/HCKJ/demo/fsys/public"

export const getFilePath = (e:H3Event) => {    
    let spath = e.context.params?._ || (getQuery(e).path || '') as string 

    if (spath.startsWith('/')) {
        throw "path start with /"
    }
    let p = path.resolve(workdir,spath)
    return p 
}

