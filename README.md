# UCAPI

Currently W.I.P

### Usage Example

---

(needs to be compiled to javascript first)

```ts
import Unifi from "./unifi.js";

const unifictrl = new Unifi();

(async () => {
  await unifictrl.connect();

  // If you ever need to disconnect manually
  await unifictrl.disconnect();
})();
```

### Requirements

---

- [UniFi Controller](https://www.ui.com/download/unifi/)
- [Node.js](https://nodejs.org/en/)
