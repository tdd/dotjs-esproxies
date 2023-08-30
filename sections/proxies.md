---
layout: cover
background: /covers/ayo-ogunseinde-sibVwORYqs0-unsplash.jpg
---

# Lay of the land

## You likely haven't used this stuff yet.

---

# What *are* proxies?

They're **not** network proxies 😉

- A proxy is a **wrapper** around an object (which could be a function)
- It can **intercept any interaction** your code has with that object… through the wrapper.
- It's the latest step in **JS metaprogramming**
- <span v-mark="{ color: 'var(--docto-blue)', at: '+0' }"> **Can't be polyfilled.** </span>
- Showed up in **ES2015**, available across browsers since Sep 2016, and Node 6+.
- Deemed **baseline** for a long time.

---

# You build one like this

```js
new Proxy(obj, {
  // handler object, usually provides "traps":  get, set, has, apply, etc.
})
```

- **Target** = the proxied object
- **Prop / Key** = property being used (looked up, read, written to or whose descriptor is defined)
- **Value** = property value being set
- For `apply` and `construct` you get arguments, `apply` also has the binding (`this`)

<v-click>

`Reflect` provides all the <span v-mark="{ color: 'var(--docto-yellow)', at: '1' }"> **built-in behaviors** </span> for every **trap**, so we can delegate to them.

</v-click>

---

# Here's a dumb example

```ts {monaco-run}{height:'250px'}
const conference = { name: 'dotJS', year: 2025 }
const proxiedConf = new Proxy(conference, {
  get(target, key, receiver) {
    console.log(`Reading ${key as string} off`, target)
    return Reflect.get(target, key, receiver)
  },
})

// console.log(proxiedConf.name)
```
