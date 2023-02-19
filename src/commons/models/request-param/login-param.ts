export class LoginParam {
  username: string;

  password: string;

  phoneNumber: string;

  grant_type: string;

  client_id: string;

  client_secret: string;

  constructor(
    username: string = "",
    password: string = "",
    phoneNumber: string = "",
    grant_type: string = "",
    client_id: string = "",
    client_secret: string = ""
  ) {
    this.username = username;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.grant_type = grant_type;
    this.client_id = client_id;
    this.client_secret = client_secret;
  }
}
