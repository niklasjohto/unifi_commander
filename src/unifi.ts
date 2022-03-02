import fetch, { Response } from "node-fetch";
import EventEmitter from "events";
import https from "https";
import WebSocket from "ws";

interface UnifiOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  site?: string;
}

class Unifi extends EventEmitter {
  // Unifi Controller options
  private host: string;
  private hostHREF: string;
  private port: number;
  private username: string;
  private password: string;
  private site: string;

  // Session variables
  private cookies: string;
  private ws: WebSocket;
  private isLoggedIn: boolean = false;

  private agent = new https.Agent({
    rejectUnauthorized: false,
  });

  constructor(options?: UnifiOptions) {
    super();
    this.port = options?.port ?? 8443;
    this.host = options?.host ?? "unifi";
    this.hostHREF = `https://${this.host}:${this.port}`;
    this.username = options?.username ?? "admin";
    this.password = options?.password ?? "ubnt";
    this.site = options?.site ?? "default";
  }

  public async connect(): Promise<void> {
    const login = await this._login();
    if (!login.ok) return;

    this.isLoggedIn = true;

    // Store the session cookies
    this.cookies = <string>login.headers.get("set-cookie");

    // This is mostly for debugging...
    const date = new Date().toLocaleString("en-DK");
    console.log(`${date}: User ${this.username} logged in`);

    return this._listen();
  }

  public async disconnect(): Promise<void> {
    if (!this.isLoggedIn) {
      return console.log("You are not logged in");
    }

    await this._logout();

    // Delete the session cookies
    this.cookies = "";

    // This is mostly for debugging...
    const date = new Date().toLocaleString("en-DK");
    console.log(`${date}: User ${this.username} logged out`);
  }

  private async _login(): Promise<Response> {
    return await fetch(`${this.hostHREF}/api/login`, {
      method: "POST",
      agent: this.agent,
      body: JSON.stringify({
        // Send the account credentials with the request
        username: this.username,
        password: this.password,
        remember: true,
      }),
    });
  }

  private async _logout(): Promise<Response> {
    return await fetch(`${this.hostHREF}/api/logout`, {
      method: "GET",
      agent: this.agent,
    });
  }

  private _listen(): void {
    const eventsEndpoint = `wss://${this.host}:${this.port}/wss/s/${this.site}/events`;

    this.ws = new WebSocket(eventsEndpoint, {
      agent: this.agent,
      headers: {
        // Send the session cookies for authentication with the server
        cookie: this.cookies,
      },
    });
  }
}

export default Unifi;
