import { Settings } from "./settings";

// Thông tin đại lý
export class Agency {
  domain: string;
  title: string;
  address: string;
  contact: string;
  agencyKey: string;
  paymentInformation: PaymentInformation;
  settings: Settings;
  constructor(
    domain: string = "",
    title: string = "",
    address: string = "",
    contact: string = "",
    agencyKey: string = "",
    paymentInformation: PaymentInformation = new PaymentInformation(),
    settings: Settings = new Settings()
  ) {
    this.domain = domain;
    this.title = title;
    this.address = address;
    this.contact = contact;
    this.agencyKey = agencyKey;
    this.paymentInformation = paymentInformation;
    this.settings = settings;
  }
}

// Thông tin ngân hàng
export class PaymentInformation {
  accountName: string;
  bankName: string;
  bankNumber: string;
  constructor(
    accountName: string = "",
    bankName: string = "",
    bankNumber: string = ""
  ) {
    this.accountName = accountName;
    this.bankName = bankName;
    this.bankNumber = bankNumber;
  }
}


