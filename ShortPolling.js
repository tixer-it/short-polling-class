class ShortPolling{

  constructor(option) {
    if (!option.url) return console.error('No URL specified');
    if (!option.onMessage) return console.error('No onMessage function specified');
    this.url = option.url;
    this.params = option.params || {};
    this.on_message = option.onMessage;
    if (option.type && !['XML', 'JSON'].includes(option.type)) return console.error('Invalid type: enter XML or JSON');
    this.type = option.type;
    return this;
  }

  serializeParams() {
    return Object.entries(this.params).map(([param, value]) => {
      return `${param}=${encodeURIComponent(value)}`;
    }).join('&');
  }

  stopPolling() {
    if (!this.poll) return;
    this.poll.close();
    this.poll = null;
    return this;
  }

  onMessageXML(data) {
    return this.on_message(new DOMParser().parseFromString(data, "text/xml"));
  }

  onMessageJSON(data) {
    return this.on_message(JSON.parse(data));
  }

  onMessageEvent(e) {
    if (this.type === 'XML') return this.onMessageXML(e.data);
    if (this.type === 'JSON') return this.onMessageJSON(e.data);
    this.on_message(e);
  }

  startPolling() {
    this.stopPolling();

    const lastu_char = this.url.substr(-1);
    let separator = '?';
    if (this.url.includes('?')){
      separator = lastu_char === '&' || lastu_char === '?' ? '' : '&';
    }
    this.poll = new EventSource(this.url + separator + this.serializeParams());
    this.poll.onmessage = e => this.onMessageEvent(e);
    return this;
  }

  changeParam(params) {
    this.params = params;
    this.poll && this.startPolling();
    return this;
  }

  getEventSource() {
    return this.poll;
  }

}
