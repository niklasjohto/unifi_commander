# UniFi Commander

I am satisfied with this project so I do not plan on implementing more features

---

#### NOTICE: You cannot use an account with 2auth enabled

Instead, use a local account with a strong password

### Usage Example

```ts
import Unifi from "./unifi.js";

const unifictrl = new Unifi({
  host: "unifi",      // Hostname or ip address of the UniFi Controller   | default: "unifi"
  port: 8443,         // UniFi Controller port                            | default: 8443
  username: "admin",  // Username                                         | default: "admin"
  password: "ubnt",   // Password                                         | default: "ubnt"
  site: "default",    // UniFi site to target                             | default: "Default"
  sslStrict: false,   // Allow connection even if SSL fails               | default: false
  unifiOS: false      // Set as true if you're using UniFi OS Console     | default: false
});

(async () => {
  await unifictrl.connect();

  // Call example
  const response = await unifictrl.ctrlCall("stat/health")
  console.log(response);

  // If you ever need to disconnect manually
  await unifictrl.disconnect();
})();
```

### Methods
These methods return promises, so use them in an asynchronous manner

Please refer to the community driven [API documentation](https://ubntwiki.com/products/software/unifi-controller/api) to figure out what endpoints to use

**connect(options)** <br>
Connects to the UniFi Controller
The options argument is optional  
<br>
**disconnect()** <br>
Disconnects from the UniFi Controller  
<br>
**ctrlCall(path, options)** <br>
This is for endpoints that don't require a site <br>
The options argument is optional, though you need it if you use a payload  <br>
  
The method option will get set to POST automatically if you have a payload unless you specify otherwise
<br>
**siteCall(path, options)** <br>
This is for endpoints that require a site <br>
The options argument is optional, though you need it if you use a payload  <br>
  
The method option will get set to POST automatically if you have a payload unless you specify otherwise  
<br>

### Examples

GET request
```ts
  unifictrl.siteCall("stat/health");
```

POST request
```ts
  unifictrl.siteCall("cmd/sitemgr", {
    payload: "get-admins"
  });
```

User defined method request
```ts
  unifictrl.siteCall("endpoint", {
    method: "method"
  })
```

### Requirements

---

- [UniFi Controller](https://www.ui.com/download/unifi/)
- [Node.js](https://nodejs.org/en/)
- TypeScript compiler OR [ts-node](https://www.npmjs.com/package/ts-node)
