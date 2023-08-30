---
layout: cover
background: /covers/chris-hardy-H5Ffv4I5ZMI-unsplash.jpg
---

# Demos

## Now for <span v-mark="{at:'+0'}">actual</span> examples

---

# “Type-safe” object properties

<<< @/snippets/type-safe-properties.ts {all|3-13|5-7|12}{lines:true}
<SnippetPath path="type-safe-properties.ts"/>

---

# “Type-safe” object properties

````md magic-move

```ts
const bestConf = makeTypeSafish({ name: 'dotJS' })
```

```ts
const bestConf = makeTypeSafish({ name: 'dotJS' })

bestConf.name = 42
// 💥 Throws with "Property name expects a string"
```

```ts
const bestConf = makeTypeSafish({ name: 'dotJS' })

bestConf.edition = 10
// ✅ OK

bestConf.edition = '10th'
// 💥 Throws with "Property edition expects a number"
```

````

---

# Shout-out: `tpyo`

The lib that defeats typos 🤣

```js {monaco-run}{height:'120px'}
import tpyo from 'tpyo'

const woah = tpyo(['dotAI', 'dotJS'])
woah.pousse('dotCSS', 'dotSwift')
console.log(woah.longueur, woah.avril(3), woah.plop(), woah.shot())
```

Finds the closest existing property using Levenshtein distances 🤯

---

# Negative array indices

<<< @/snippets/negative-array-indices.ts#def {3-7|8-12}{lines:true}
<SnippetPath path="negative-array-playground.ts"/>

---

# Negative array indices

````md magic-move

<<< @/snippets/negative-array-indices.ts#initial-use ts

<<< @/snippets/negative-array-indices.ts#next-use ts

````

---

# Negative array indices

<<< @/snippets/negative-array-playground.ts {monaco-run}{height:'220px'}
<SnippetPath path="negative-array-playground.ts"/>

---

# Mini observables

```ts {all|8-13|9|10|4,11}{lines:true}
type Subscribable = { $subscribe: (sub: Subscriber) => Subscribable }

function makeObservable(obj: object) {
  const subscribers = new Set<Subscriber>()
  const proxy = new Proxy(obj, {
    …
    set(target, key, value, receiver) {
      const previous = target[key as keyof typeof target]
      const result = Reflect.set(target, key, value, receiver)
      subscribers.forEach((sub) => sub({ key, previous, value }))
      return result
    }
  }) as Subscribable

  proxy.$subscribe = …

  return proxy
}
```
<SnippetPath path="mini-observables.ts"/>

---

# Mini observables

```ts {7-12|8|9|4,10}{lines:true}
type Subscribable = { $subscribe: (sub: Subscriber) => Subscribable }

function makeObservable(obj: object) {
  const subscribers = new Set<Subscriber>()
  const proxy = new Proxy(obj, {
    deleteProperty(target, key) {
      const previous = target[key as keyof typeof target]
      const result = Reflect.deleteProperty(target, key)
      subscribers.forEach((sub) => sub({ key, previous, deleted: true }))
      return result
    },
    …
  }) as Subscribable

  proxy.$subscribe = …

  return proxy
}
```
<SnippetPath path="mini-observables.ts"/>

---

# Mini observables

```ts {1-4,8,12-15}{lines:true}
type Notification =
  | { key: PropertyKey, previous: unknown, value: unknown }
  | { key: PropertyKey, previous: unknown, deleted: true }
type Subscriber = (notif: Notification) => void
type Subscribable = { $subscribe: (sub: Subscriber) => Subscribable }

function makeObservable(obj: object) {
  const subscribers = new Set<Subscriber>()
  const proxy = …

  proxy.$subscribe = (subscriber) => {
    subscribers.add(subscriber)
    return proxy
  }

  return proxy
}
```
<SnippetPath path="mini-observables.ts"/>

---

# Mini observables

<div class="soft-wrap-output">

<<< @/snippets/mini-observables-playground.ts {monaco-run}{lines:true,height:'200px'}
<SnippetPath path="mini-observables.ts"/>

</div>

---

# Shout-out: Vue.js 3 relies on ES proxies

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })
</script>

<template>
  <button @click="state.count += 1">
   {{ state.count }}
  </button>
</template>
```

It's more powerful and performant than Vue 2's reactivity.  For instance, no custom syntax for reacting to property deletion (`deleteProperty` trap), no need to have all properties defined from the start either (the`set` trap triggers on both existing and new properties).

---

# TTL Refs

```ts {all|6-12}{lines:true}
function makeTTL(fx: Function, ttlMS: number) {
  const expiry = Date.now() + ttlMS
  const fxName = fx.name || fx['displayName'] || 'Function'

  return new Proxy(fx, {
    apply(target, thisArg, args) {
      if (Date.now() >= expiry) {
        throw new Error(`${fxName} cannot be called anymore (${ttlMS}ms TTL expired)`)
      }

      return Reflect.apply(target, thisArg, args)
    }
  })
}
```
<SnippetPath path="ttl-refs.ts"/>

---

# TTL Refs

<<< @/snippets/ttl-refs.ts {monaco-run}{height: '220px',autorun:false}
<SnippetPath path="ttl-refs.ts"/>

---

# “URL builder”

```ts {all|9|10-13}{lines:true}
// We aim for this:
// const builder = makeURLBuilder('https://api.acme.biz')
// builder.buy.bacon.and.eggs() => https://api.acme.biz/buy/bacon/and/eggs

function makeURLBuilder(domain: string): URLBuilder {
  const parts: string[] = []

  return new Proxy(buildURL, {
    has: () =>  true,
    get(_target, prop, receiver) {
      parts.push(prop as string)
      return receiver
    },
  }) as URLBuilder

  …
}
```
<SnippetPath path="url-builder.ts"/>

---

# “URL builder”

```ts {10-17}{lines:true}
// We aim for this:
// const builder = makeURLBuilder('https://api.acme.biz')
// builder.buy.bacon.and.eggs() => https://api.acme.biz/buy/bacon/and/eggs

function makeURLBuilder(domain: string): URLBuilder {
  const parts: string[] = []

  …

  function buildURL(qs: object = {}) {
    const url = new URL([domain, ...parts].join('/'))
    for (const [key, value] of Object.entries(qs)) {
      url.searchParams.append(key, value)
    }
    parts.length = 0
    return url.toString()
  }
}
```
<SnippetPath path="url-builder.ts"/>

---

# “URL builder”

<<< @/snippets/url-builder.ts {monaco-run}{height:'100px'}
<SnippetPath path="url-builder.ts"/>

---

# VCR (record & replay)

Here's what we'd like to be able to do.

```ts {1|1-4|6-10|13}{lines:true}
const { vcr, replay } = makeVCR()
vcr.foo.bar.baz({ name: 'hello' })
vcr.foo.quux = 42
vcr.foo.doo('amazing').name = 'YOLO'

const subject: DemoSubject = {
  foo: {
    bar: { baz({ name }: { name: string }) { this.name = name } },
    doo(text: string) { this.kind = text.toUpperCase(); return this },
  },
}

replay(subject)
```
<SnippetPath path="vcr.ts"/>

---

# VCR (record & replay)

```ts {1-4,19|5,16|6|12-15|7-11}{lines:true}
function makeVCR({
  pathPrefix = [],
  ops = [],
}: { pathPrefix?: PropPath; ops?: Op[] } = {}): VCRTuple {
  const vcr = new Proxy(() => {}, {
    get: (_, prop) => makeVCR({ pathPrefix: [...pathPrefix, prop], ops }).vcr,
    apply(_, __, args) {
      const propPath = [...pathPrefix, { args }]
      ops.push({ kind: 'read', prop: propPath })
      return makeVCR({ pathPrefix: propPath, ops }).vcr
    },
    set(_, prop, value) {
      ops.push({ kind: 'write', prop: [...pathPrefix, prop], value })
      return true
    },
  }) as VCR

  return { vcr, replay: $replay.bind(null, ops) }
}
```

---

# VCR (record & replay)

<div class="soft-wrap-output">

<<< @/snippets/vcr.ts {monaco-run}{height:'260px',autorun:false}
<SnippetPath path="vcr.ts"/>

</div>

---

# Shout-out: <span v-mark="{at: '+0', color: 'var(--docto-yellow)'}">Immer.js</span> is amazing

Michel Weststrate (also of MobX fame) made this incredible library that provides transparent immutability.  It's sort of VCR done right, and on steroids.

````md magic-move

```ts {all|3|4|5}
// Without Immer

const nextState = [...baseState]
nextState[1] = { ...nextState[1], done: true }
nextState.push({ title: 'Tweet about it' })
```

```ts {4|5-6}
// With Immer
import { produce } from 'immer'

const nextState = produce(baseState, (draft) => {
    draft[1].done = true
    draft.push({ title: 'Tweet about it' })
})

// `baseState` is unchanged
// `nextState` is the deep, copy-on-write variant
```

````

---

# Shout-out: <span v-mark="{at: '+0', color: 'var(--docto-yellow)'}">Immer.js</span> is amazing

It's also great in combination with React, with or without Redux. Basic example:

```ts
const [todos, setTodos] = useImmer([
  { id: 'React', title: 'Learn React', done: true },
  { id: 'Immer', title: 'Try Immer', done: false }
])

function handleToggle(id) {
  setTodos((draft) => {
    const todo = draft.find((todo) => todo.id === id)
    todo.done = !todo.done
  })
}
```

Also has built-in solutions for `useReducer`, Redux reducers, etc.
