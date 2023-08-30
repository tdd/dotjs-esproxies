function makeTypeSafish(obj: object) {
  return new Proxy(obj, {
    set(target, key, value) {
      if (key in target) {
        const knownType = typeof target[key];

        if (knownType !== typeof value) {
          throw new Error(`Property ${key as string} expects a ${knownType}`);
        }
      }

      return Reflect.set(target, key, value);
    },
  });
}
