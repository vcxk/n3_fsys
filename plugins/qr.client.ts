import QRCodeVue3 from 'qrcode-vue3'
import Vue from 'vue'

export default defineNuxtPlugin((napp) => {
    console.log('qr client ts')
    napp.vueApp.component('qrvue',QRCodeVue3)
})

