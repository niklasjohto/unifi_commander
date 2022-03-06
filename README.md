# UniFi Commander

Currently W.I.P

---

#### NOTICE: You cannot use an account with 2auth enabled

Instead, use a local account with a strong password

### Usage Example

```ts
import Unifi from "./unifi.js";

const unifictrl = new Unifi({
  host: "unifi",      // Hostname or ip address of the UniFi Controller   | default: "unifi"
  port: 8433,         // UniFi Controller port                            | default: "8443"
  username: "admin",  // Username                                         | default: "admin"
  password: "ubnt",   // Password                                         | default: "ubnt"
  site: "default"     // UniFi site to target                             | default: "Default"
});

(async () => {
  await unifictrl.connect();

  // Call example
  await unifictrl.call("endpoint", {
    method: "GET"
  })

  // Call with payload example 
  await unifictrl.call("manager", {
    method: "PUT",
    payload: "command"
  })

  // If you ever need to disconnect manually
  await unifictrl.disconnect();
})();
```

Please refer to the community driven [API documentation](https://ubntwiki.com/products/software/unifi-controller/api) to figure out what endpoints to use

### Requirements

---

- [UniFi Controller](https://www.ui.com/download/unifi/)
- [Node.js](https://nodejs.org/en/)
- TypeScript compiler OR [ts-node](https://www.npmjs.com/package/ts-node)
