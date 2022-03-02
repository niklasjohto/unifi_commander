import Unifi from "./unifi.js";

const unifictrl = new Unifi();

(async () => {
  await unifictrl.connect();
})();
