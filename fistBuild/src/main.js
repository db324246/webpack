import './assets/index.less'
import './assets/index.css'
import './assets/global.css'
console.log('第一次打包')
console.log('配置webpack入口')
const a = function() {
  const p = new Promise(reslove => {
    console.log(1)
    reslove(2)
  })
  return p
}
a()
  .then(num => {
    console.log(num)
  })