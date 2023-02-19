import { createToaster } from "@meforma/vue-toaster";
// https://vuejsexamples.com/vue-js-toast-notification-plugin-for-vue-3/ reference link

export class BaseToast {
  toaster = createToaster();
  constructor() {}

  /**
   * Show toast default
   */
  showToastDefault(content: String, option: OptionToast = new OptionToast()) {
    this.toaster.show(content, option);
  }

  /**
   * Show toast success
   */
  showToastSuccess(content: String, option: OptionToast = new OptionToast()) {
    this.toaster.success(content, option);
  }

  /**
   * Show toast error
   */
  showToastError(content: String, option: OptionToast = new OptionToast()) {
    this.toaster.error(content, option);
  }

  /**
   * Show toast warning
   */
  showToastWarning(content: String, option: OptionToast = new OptionToast()) {
    this.toaster.warning(content, option);
  }

  /**
   * Show toast info
   */
  showToastInfo(content: String, option: OptionToast = new OptionToast()) {
    this.toaster.info(content, option);
  }
}

/**
 * Object setting toast
 */
export class OptionToast {
  position: string;
  duration: Number;
  constructor(position = "top-right", duration = 3000) {
    this.position = position;
    this.duration = duration;
  }
}
