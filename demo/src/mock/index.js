import './style'
import Register from '@lib/mock/register'

new Register({ filename: '/mock/service-worker.js' })

const $app = document.getElementById('app')
fetch('/mock/demo1').then(res => res.json()).then(data => $app.innerHTML += `<div>${JSON.stringify(data)}</div>`)
fetch('/mock/demo2', { method: 'POST' }).then(res => res.json()).then(data => $app.innerHTML += `<div>${JSON.stringify(data)}</div>`)
fetch('/mock/demo3', { method: 'PATCH' }).then(res => res.json()).then(data => $app.innerHTML += `<div>${JSON.stringify(data)}</div>`)
