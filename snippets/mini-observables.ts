const propLog: PropertyKey[] = []
const foo = makeObservable({ name: 'dotJS', ranking: '👍' })
  .$subscribe(console.debug)
  .$subscribe(({ key }) => propLog.push(key))

// foo.name += ' 2025'
// foo.ranking = '💫'
// foo.hasAfterParty = true
// delete foo.hasAfterParty
// console.log(propLog)

//#region impl
type Notification =
  | { key: PropertyKey, previous: unknown, value: unknown }
  | { key: PropertyKey, previous: unknown, deleted: true }
type Subscriber = (notif: Notification) => void
type Subscribable = { $subscribe: (sub: Subscriber) => Subscribable }

function makeObservable(obj: object) {
  const subscribers = new Set<Subscriber>()

  const proxy = new Proxy(obj, {
    deleteProperty(target, key) {
      const previous = target[key]
      const result = Reflect.deleteProperty(target, key)
      subscribers.forEach((sub) => sub({ key, previous, deleted: true }))
      return result
    },
    set(target, key, value, receiver) {
      const previous = target[key]
      const result = Reflect.set(target, key, value, receiver)
      subscribers.forEach((sub) => sub({ key, previous, value }))
      return result
    }
  }) as Subscribable

  proxy.$subscribe = (subscriber) => {
    subscribers.add(subscriber)
    return proxy
  }

  return proxy
}
//#endregion