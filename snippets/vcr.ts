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
console.log(subject)

type DemoSubject = { foo: { bar: { baz: Function; name?: string }, doo: Function; kind?: string } }
type Op =
  | { kind: 'read'; prop: PropPath }
  | { kind: 'write'; prop: PropPath; value: unknown }
type PropPath = Array<PropertyKey | { args: unknown[] }>
type VCR = { [key: PropertyKey]: any; (...args: unknown[]): any }
type VCRTuple = { vcr: VCR; replay: (subject: object) => void }

function makeVCR({
  pathPrefix = [],
  ops = [],
}: { pathPrefix?: PropPath; ops?: Op[] } = {}): VCRTuple {
  const vcr = new Proxy(() => {}, {
    get(_, prop) {
      return makeVCR({ pathPrefix: [...pathPrefix, prop], ops }).vcr
    },

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

function $replay(ops: Op[], subject: object) {
  for (const op of ops) {
    if (op.kind === 'read') {
      traverseProps(subject, op.prop)
    } else {
      const node = traverseProps(subject, op.prop.slice(0, -1))
      node[op.prop.at(-1) as PropertyKey] = op.value
    }
  }
}

function traverseProps(subject: any, props: PropPath): any {
  let result = subject
  let obj = subject

  for (const prop of props) {
    if (typeof prop === 'object') {
      result = obj = result.apply(obj, prop.args)
    } else {
      obj = result
      result = result[prop]
    }
  }
  return result
}