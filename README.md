# Package Badges

![build: passing](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/build.svg)
![test: passing](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/test.svg)
![license: ISC](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/license.svg)
![d.ts: ✔](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/dts.svg)
![Make: Badges](https://raw.githubusercontent.com/PavelDymkov/package-badges/master/badges/fun.svg)

Add badges to your package.

## CLI

```sh
npx badges --help
npx badges clean
npx badges create --help
npx badges create -F build -L build -M passing -MC success
```

## Node JS

```ts
import { clean, create } from "package-badges";

clean();

create("build", {
    label: "build",
    message: "passing",
    messageColor: "success",
});
```
