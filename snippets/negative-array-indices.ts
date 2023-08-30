//#region def
function allowNegativeIndices(arr: Array<unknown>) {
  return new Proxy(arr, {
    get(target, prop, receiver) {
      const index = Number(prop);
      if (index < 0) prop = String(index + target.length);
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      const index = Number(prop);
      if (index < 0) prop = String(index + target.length);
      return Reflect.set(target, prop, value, receiver);
    },
  });
}
//#endregion

//#region initial-use
const allTheDots = allowNegativeIndices([
  'dotJS', 'dotAI',
  'dotRB', 'dotCSS', 'dotScale', 'dotSecurity', 'dotSwift',
])

allTheDots[0]  // => 'dotJS'
allTheDots[-1] // => 'dotSwift'
allTheDots[-2] // => 'dotSecurity'
//#endregion

//#region next-use
const allTheDots = allowNegativeIndices([
  'dotJS', 'dotAI',
  'dotRB', 'dotCSS', 'dotScale', 'dotSecurity', 'dotSwift',
])

allTheDots[0]  // => 'dotJS'
allTheDots[-1] // => 'dotSwift'
allTheDots[-2] // => 'dotSecurity'
allTheDots[-3] = 'dotMontéeÀLÉchelle' // Oh là là the frenchness 🇫🇷
//#endregion