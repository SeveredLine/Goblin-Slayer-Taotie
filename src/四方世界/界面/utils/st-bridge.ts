const getWindow = () => (window as any);
const getParentWindow = () => (window.parent as any);

export const ST_API = {
  get eventOn() { return getWindow().ST_API?.eventOn || getWindow().eventOn; },
  get getVariables() { return getWindow().ST_API?.getVariables || getWindow().getVariables; },
  get getChatMessages() { return getWindow().ST_API?.getChatMessages || getWindow().getChatMessages; },
  get generate() { return getWindow().ST_API?.generate || getWindow().generate; },
  get tavern_events() { return getParentWindow().tavern_events || getWindow().tavern_events || {}; },
  get iframe_events() { return getParentWindow().iframe_events || getWindow().iframe_events || {}; }
};

export const MvuBridge = {
  get instance() { return getParentWindow().Mvu || getWindow().Mvu; },
  get events() { return this.instance?.events || {}; },
  get getMvuData() { return this.instance?.getMvuData; }
};

export const _ = getWindow()._ || getParentWindow()._;