import fetch, { Response } from "node-fetch";
import https from "https";
import { parseCookies } from "./cookies.js";

interface UnifiOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  site?: string;
}

interface FetchOptions {
  method: string;
  payload?: string;
}

type FetchReturn = Promise<Response | void>;

class Unifi {
  // Unifi Controller options
  private host: string;
  private hostAPI: string;
  private port: number;
  private username: string;
  private password: string;
  private site: string;

  // Session variables
  private cookies: string;
  private isLoggedIn: boolean = false;

  private agent = new https.Agent({
    rejectUnauthorized: false,
  });

  constructor(options?: UnifiOptions) {
    this.port = options?.port ?? 8443;
    this.host = options?.host ?? "unifi";
    this.hostAPI = `https://${this.host}:${this.port}/api`;
    this.username = options?.username ?? "admin";
    this.password = options?.password ?? "ubnt";
    this.site = options?.site ?? "default";
  }

  public async connect(): Promise<void> {
    const date = new Date().toLocaleString("en-DK");

    const login = await this._login();

    if (!login.ok) {
      return console.log(`${date}: Could not connect to the UniFi Controller`);
    }

    this.isLoggedIn = true;

    // Store the session cookies
    this.cookies = parseCookies(login);

    // This is mostly for debugging...
    console.log(`${date}: User ${this.username} logged in`);
  }

  public async disconnect(): Promise<void> {
    const date = new Date().toLocaleString("en-DK");

    if (!this.isLoggedIn) {
      return console.log(`${date}: You are not logged in`);
    }

    await this._logout();

    // Delete the session cookies
    this.cookies = "";

    // This is mostly for debugging...
    console.log(`${date}: User ${this.username} logged out`);
  }

  private async _login(): Promise<Response> {
    return await fetch(`${this.hostAPI}/login`, {
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

  private async _logout(): Promise<Response | void> {
    return await fetch(`${this.hostAPI}/logout`, {
      method: "GET",
      agent: this.agent,
    });
  }

  public async call(endpoint: string, options: FetchOptions): FetchReturn {
    const date = new Date().toLocaleString("en-DK");

    if (!this.isLoggedIn) {
      return console.log(`${date}: You are not logged in`);
    } else if (options.payload && options.method === "GET") {
      return console.log(`${date}: You cannot use GET with a payload`);
    }

    const endpointURL = `${this.hostAPI}/s/${this.site}/${endpoint}`;

    const response = await fetch(endpointURL, {
      agent: this.agent,
      headers: {
        Cookie: this.cookies,
      },
      ...options,
    });

    if (!response.ok) {
      return console.log(
        `${date}: Invalid configuration, could not reach ${endpointURL}`
      );
    }

    const data = await response.json();

    console.log(data);
    return data;
  }
}

export default Unifi;
