import fetch from "node-fetch";
import https from "https";
import WebSocket from "ws";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

interface UnifiOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  site?: string;
}

class Unifi {
  private host: string;
  private hostHREF: string;
  private port: number;
  private username: string;
  private password: string;
  private site: string;

  constructor(options?: UnifiOptions) {
    this.port = options?.port || 8443;
    this.host = options?.host || "unifi";
    this.hostHREF = `https://${this.host}:${this.port}`;
    this.username = options?.username || "admin";
    this.password = options?.password || "ubnt";
    this.site = options?.site || "default";
  }

  public async connect() {
    const login = await this._login();
    if (!login.ok) return;
  }

  private async _login() {
    const loginEndpoint = `${this.hostHREF}/api/login`;

    return await fetch(loginEndpoint, {
      method: "POST",
      agent,
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        remember: true,
      }),
    });
  }

  private async _listen() {
    const eventsURL = `wss://${this.host}/wss/s/${this.site}/events`;

    // const ws = new WebSocket(eventsURL, {
    //   perMessageDeflate: false,
    //   agent,
    // });
  }
}

export default Unifi;
