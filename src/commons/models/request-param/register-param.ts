// Thông tin đăng ký tài
export class RegisterParam {
  name: string;

  surName: string;

  fullname: string;

  phoneNumber: string;

  email: string;

  userName: string;

  password: string;

  constructor(
    name: string = "",
    surName: string = "",
    fullname: string = "",
    email: string = "",
    userName: string = "",
    phoneNumber: string = "",
    password: string = ""
  ) {
    this.name = name;
    this.surName = surName;
    this.fullname = fullname;
    this.email = email;
    this.userName = userName;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }
}
