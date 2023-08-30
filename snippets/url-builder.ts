const builder = makeURLBuilder('https://api.acme.biz')
console.log(builder.buy.bacon.and.eggs())

console.log(builder.categories[124].discounts({ mode: 'sale', pageSize: 10 }))


type URLBuilder = {
  (...args: unknown[]): string
  [key: string | number | symbol]: URLBuilder
}

function makeURLBuilder(domain: string): URLBuilder {
  const parts: string[] = []

  return new Proxy(buildURL, {
    has: () => true,
    get(_target, prop, receiver) {
      parts.push(prop as string)
      return receiver
    },
  }) as URLBuilder

  function buildURL(qs: object = {}) {
    const url = new URL([domain, ...parts].join('/'))
    for (const [key, value] of Object.entries(qs)) {
      url.searchParams.append(key, value)
    }
    parts.length = 0
    return url.toString()
  }
}