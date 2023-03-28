<style lang="scss" scoped>
.dep-dir {
    margin-top: 30px;
}

.dirs {
    margin-top: 30px;
    margin-bottom: 30px;
}

</style>

<template>


<div class="dep-dir">
    <h3>路径</h3>
    <div>
        <el-button @click="updateDepDirs(0)">/</el-button>
        <div style="display: inline-block;"  v-for="(d,i) in depDirs" :key="i">
            <el-button @click="updateDepDirs(i + 1)" >{{ d }}</el-button>
            <span v-if="i < depDirs.length - 1">/</span>
        </div> 
    </div>
</div>

<div class="dirs">
    <h3>目录</h3>
    <el-button @click="clickDir(d)" v-for="d in dirs">{{ d.name }}</el-button>    
</div>
<h3>文件</h3>
<el-table :data="data">
    <el-table-column label="名称" prop="name" width="300" align="left"/>
    <el-table-column label="大小" prop="size" align="right" width="200" />
    <el-table-column prop="time" label="修改时间" />
    <el-table-column width="300">
        <template #default="scope">
            <el-button v-if="scope.row.dir">进入目录</el-button>
            <div v-else>
                <el-button @click="clickDownload(scope.row)">下载</el-button>
                <el-popconfirm @confirm="clickDelete(scope.row)" :title="'确定删除' + scope.row.name + '?'">
                    <template #reference>
                        <el-button>删除</el-button>
                    </template>
                </el-popconfirm>
                <el-button @click="clickQr(scope.row)">二维码</el-button>
            </div>
        </template>
    </el-table-column>
</el-table>

<el-dialog v-model="qrvisible" :show-close="false">
    <template #default>
        <div style="display: flex;justify-content: center;align-items: center;">
            <qrvue :width="200"
            :height="200"
            :value="qrvalue"
            :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
            :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
            :dotsOptions="{
                type: 'dot',
                color: '#26249a',
                gradient: {
                type: 'linear',
                rotation: 0,
                colorStops: [
                    { offset: 0, color: '#26249a' },
                    { offset: 1, color: '#26249a' },
                ],
                },
            }"
            />
        </div>
    </template>
    <template #footer>
        <p style="white-space: pre-wrap;width: 100%;">{{ qrvalue }}</p>
    </template>
</el-dialog>

</template>

<script setup>

import dayjs from 'dayjs'
import os from 'os'

const env = ref(null) 
const href = ref(null)

const data = ref(null)
const dirs = ref(null)
const depDirs = ref((useRoute().params.path || []).filter((e)=> e.length != 0))

const qrvisible = ref(false)
const qrvalue = ref(null)

console.log(depDirs)

if (process.server) {
    for (const net of os.networkInterfaces()['en0']) {
        // console.log(net)
        if (net.family == 'IPv4') {
            
        }
    }
    env.value = process.env
}

if (process.client) {
    let v = window.location.href
    if (v.endsWith('/')) { v = v.slice(0,-1)}
    href.value = v 
}

const prettySize = (size) => {
    let units = ['bytes','KB','MB','GB']
    for (let index = 0; index < units.length; index++) {
        let u = units[index]
        let usize = 1024
        let n = size/Math.pow(usize,index)
        if (n < usize) {
            return n.toFixed(2) + ' ' + units[index]
        }
    }
    return size
}

const getFiles = async () => {
    let files = await useFetch('/api/fs/list',{
        params:{
            path:depDirs.value.join('/')
        }
    })
    console.log(files.data)
    let value = files.data.value
    for (const f of value) {
        let day = dayjs(f.stat.mtimeMs)
        f.time = day.format('YYYY-MM-DD HH:mm:ss')
        let size = f.stat.size
        f.size = prettySize(size) 
    }
    value = value.sort((a,b) => b.stat.mtimeMs - a.stat.mtimeMs)

    data.value = value.filter((e) => !e.dir)
    dirs.value = value.filter((e) => e.dir)
}

const updateDepDirs = (i) => {
    depDirs.value = depDirs.value.slice(0,i)
    getFiles()
}

const clickDir = (d) => {
    depDirs.value.push(d.name)
    getFiles()
}

const filePath = (row) => {
    let dirs = depDirs.value.join('/')
    if (dirs.length > 0) { dirs += '/' }
    return '/api/fs/file/' + dirs + row.name
}

const clickDownload = (row) => { window.open(filePath(row)) }

const clickDelete = async (row) => {
    // console.log('delete ',row)
    await useFetch(filePath(row),{method:'delete'})
    await getFiles()
}

const clickQr = (row) => {
    qrvalue.value = href.value  + filePath(row)
    qrvisible.value = true 
}

getFiles()

</script>