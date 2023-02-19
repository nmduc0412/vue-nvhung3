export class ButtonsCellGrid {
    // content tolltip
    Hint = "";

    // icon
    Icon = "";

    Visible = true;

    Disabled = false;

    // event click action
    CallBackFuntion: Function = ()=> {};

    constructor(callBackFuntion: Function, hint = "", icon = "", visible = true, disabled = false ){
        this.CallBackFuntion = callBackFuntion;
        this.Hint = hint;
        this.Icon = icon;
        this.Visible = visible;
        this.Disabled = disabled;
    }
}