import fs from 'fs'
import os from 'os'
import path from 'path'
import dayjs from 'dayjs'

import { workdir , getFilePath} from '@/utils/fsutils'

// const workdir = "/Users/chenxuke/work/HCKJ/demo/fsys/"

export default defineEventHandler((e) => {
    // let spath = (e.context.params as any)['_']
    let dir = getFilePath(e)
    let igonrefiles = ['.DS_Store']
    let files = fs.readdirSync(dir).filter((n) => igonrefiles.indexOf(n) == -1)
    let stats = files.map((name) => {
        let stat = fs.lstatSync(path.resolve(dir,name))
        return {
            name:name,
            stat:stat,
            dir:stat.isDirectory()
        }
    })
    return stats
})