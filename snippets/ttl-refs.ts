function sayHi(whom: string) { console.log(`Hi ${whom}!`) }
const sayHiFast = makeTTL(sayHi, 500)

sayHiFast('John')
// ✅ Hi John

setTimeout(() => sayHiFast('Nessrine'), 400)
// ✅ Hi Nessrine!

setTimeout(() => sayHiFast('Sylvain'), 500)
// 💥 sayHi cannot be called anymore (500ms TTL expired)


const start = Date.now()
const origLog = console.log
console.log = (...args) => {
  const stamp = `+${Date.now() - start}ms: `
  origLog.call(console, stamp, ...args)
}
function makeTTL(fx: Function, ttlMS: number) {
  const expiry = Date.now() + ttlMS
  const fxName = fx.name || fx['displayName'] || 'Function'

  return new Proxy(fx, {
    apply(target, thisArg, args) {
      if (Date.now() >= expiry) {
        console.log(new Error(`${fxName} cannot be called anymore (${ttlMS}ms TTL expired)`))
        throw new Error(`${fxName} cannot be called anymore (${ttlMS}ms TTL expired)`)
      }

      return Reflect.apply(target, thisArg, args)
    }
  })
}