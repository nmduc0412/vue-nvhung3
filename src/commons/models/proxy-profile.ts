export class Proxy {
  type: string;
  ip: string;
  username: string;
  pasword: string;
  port: string;
  constructor(
    type: string,
    ip: string,
    port: string,
    username: string,
    pasword: string
  ) {
    this.type = type;
    this.ip = ip;
    this.port = port;
    this.username = username;
    this.pasword = pasword;
  }
}

export class ProxyProfile {
  id: string;
  proxyProfile: string;
  Note: string;
  data: Array<Proxy>;
  constructor(
    id: string,
    proxyProfile: string,
    note: string,
    data: Array<Proxy>
  ) {
    this.id = id;
    this.proxyProfile = proxyProfile;
    this.Note = note;
    this.data = data;
  }
}
