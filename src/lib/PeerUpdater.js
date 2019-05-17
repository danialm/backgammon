import Peer from "simple-peer";

class PeerUpdater {
  constructor(
    token,
    offerUrl,
    responseUrl,
    {
      isInitiator,
      onConnect,
      onError
    })
  {
    this.token = token;
    this.offerUrl = offerUrl;
    this.responseUrl = responseUrl;
    this.isInitiator = isInitiator;
    this.onConnect = onConnect;
    this.onError = onError;
    this._setUpConnection();
  }

  _setUpConnection() {
    const p = new Peer({ initiator: this.isInitiator, trickle: false })

    p.on('error', this.onError);
    p.on('connect', this.onConnect);

    p.on('signal', function (data) {
      console.log('SIGNAL', JSON.stringify(data))
      fetch(
        this.offerUrl,
        {
          body: JSON.stringify({ load: data }),
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token,
          }
        })
    })

    // document.querySelector('form').addEventListener('submit', function (ev) {
    //   ev.preventDefault()
    //   p.signal(JSON.parse(document.querySelector('#incoming').value))
    // })

    p.on('data', function (data) {
      console.log('data: ' + data)
    })

    this.peer = p;
  }

  update(message) {
    console.log(message);
    return new Promise((resolve, reject) => {
      window.setTimeOut(() => resolve(), 10);
    });
  }
}

export default PeerUpdater;
