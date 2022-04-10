import fetch, { BodyInit, Response } from "node-fetch";
import https from "https";

interface UnifiOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  site?: string;
  sslStrict?: boolean;
  unifiOS?: boolean;
}

interface FetchOptions {
  payload?: string;
  method?: string;
}

type FetchReturn = Promise<Response | void>;

class Unifi {
  // Unifi Controller options
  private host: string;
  private hostHREF: string;
  private hostAPI: string;
  private port: number;
  private username: string;
  private password: string;
  private site: string;
  private sslStrict: boolean;
  private unifiOS: boolean;

  // Session variables
  private cookies: string;
  private isLoggedIn: boolean = false;

  private agent: https.Agent;

  constructor(options?: UnifiOptions) {
    this.port = options?.port ?? 8443;
    this.host = options?.host ?? "unifi";
    this.unifiOS = options?.unifiOS ?? false;

    this.hostHREF = `https://${this.host}:${this.port}`;
    this.hostAPI = `${this.hostHREF}/api`;
    if (this.unifiOS) {
      this.hostAPI = `${this.hostHREF}/proxy/network/api`;
    }

    this.username = options?.username ?? "admin";
    this.password = options?.password ?? "ubnt";

    this.site = options?.site ?? "default";
    this.sslStrict = options?.sslStrict ?? false;
    this.agent = new https.Agent({
      rejectUnauthorized: this.sslStrict,
    });
  }

  public async connect(): Promise<void> {
    const date = new Date().toLocaleString("en-DK");

    const login = await this._login();

    if (!login.ok) {
      return console.log(
        `${date}: Could not connect to the UniFi Controller\nReason: error ${login.status}`
      );
    }

    this.isLoggedIn = true;

    // Store the session cookies
    this.cookies = login.headers.get("set-cookie") as string;

    // This is mostly for debugging...
    console.log(`${date}: User ${this.username} logged in`);
  }

  public async disconnect(): Promise<void> {
    const date = new Date().toLocaleString("en-DK");

    if (!this.isLoggedIn) {
      return console.log(`${date}: You are not logged in`);
    }

    const response = await this._logout();

    if (!response?.ok) {
      return console.log(
        `${date}: There was an error logging out\nReason: error ${
          response!.status
        }`
      );
    }

    this.isLoggedIn = false;

    // Delete the session cookies
    this.cookies = "";

    // This is mostly for debugging...
    console.log(`${date}: User ${this.username} logged out`);
  }

  private async _login(): Promise<Response> {
    let endpointURL = `${this.hostHREF}/api/login`;
    if (this.unifiOS) {
      endpointURL = `${this.hostHREF}/api/auth/login`;
    }

    return await fetch(endpointURL, {
      method: "POST",
      agent: this.agent,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Send the account credentials with the request
        username: this.username,
        password: this.password,
        remember: false,
        strict: true,
      }),
    });
  }

  private async _logout(): Promise<Response | void> {
    return await fetch(`${this.hostHREF}/api/logout`, {
      method: "POST",
      agent: this.agent,
      headers: {
        "Content-Type": "application/json",
        cookie: this.cookies,
      },
    });
  }

  private async _call(
    endpointURL: string,
    options?: FetchOptions
  ): FetchReturn {
    const date = new Date().toLocaleString("en-DK");

    if (!this.isLoggedIn) {
      return console.log(`${date}: You are not logged in`);
    }

    // Check if user has provided a method or if there's a payload,
    // POST must be used if there's a payload
    const method = options?.method ?? options?.payload ? "POST" : "GET";

    // Check if user has provided a payload
    let body: BodyInit | undefined = undefined;
    if (options?.payload) {
      body = JSON.stringify({ cmd: options.payload });
    }

    const response = await fetch(endpointURL, {
      agent: this.agent,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Cookie: this.cookies,
      },
      body,
    });

    if (!response.ok) {
      return console.log(
        `${date}: Could not reach ${endpointURL}\nReason: error ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  }

  public ctrlCall(endpoint: string, options?: FetchOptions) {
    const endpointURL = `${this.hostAPI}/${endpoint}`;
    return this._call(endpointURL, options);
  }

  public siteCall(endpoint: string, options?: FetchOptions) {
    const endpointURL = `${this.hostAPI}/s/${this.site}/${endpoint}`;
    return this._call(endpointURL, options);
  }
}

export default Unifi;
