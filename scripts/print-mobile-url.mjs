import os from 'node:os'

function getLanAddresses() {
  const addrs = []
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addrs.push(iface.address)
      }
    }
  }
  return addrs
}

const port = process.env.PORT || '5173'
const ips = getLanAddresses()

console.log('')
console.log('📱 手机浏览器请用下面地址（不要用 127.0.0.1）：')
if (ips.length === 0) {
  console.log('   未检测到局域网 IP，请确认已连接 WiFi')
} else {
  for (const ip of ips) {
    console.log(`   http://${ip}:${port}/`)
  }
}
console.log('')
console.log('   条件：手机和电脑在同一 WiFi（或同一公司 VPN）')
console.log('')
