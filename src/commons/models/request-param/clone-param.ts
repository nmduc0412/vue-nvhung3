export class CloneParam {
  aliveStatus: Array<String>;

  appname: Array<String>;

  skipCount: Number;

  maxResultCount: Number;

  android_id: any;

  constructor(
    aliveStatus: Array<String>,
    appname: Array<String>,
    skipCount: Number,
    maxResultCount: Number,
    android_id: any
  ) {
    this.aliveStatus = alive_status;
    this.appname = appname;
    this.skipCount = skipCount;
    this.maxResultCount = maxResultCount;
    this.android_id = android_id;
  }
}
