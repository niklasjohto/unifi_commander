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

// If you ever need to disconnect manually
await unifictrl.disconnect();
})();
```

### Requirements

---

- [UniFi Controller](https://www.ui.com/download/unifi/)
- [Node.js](https://nodejs.org/en/)
