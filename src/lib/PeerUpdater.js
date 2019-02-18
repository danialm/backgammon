class PeerUpdater {
  cunstructor(peerId) {
    this.peerId = peerId;
  }

  update(message) {
    console.log(message);
    return new Promise((resolve, reject) => {
      window.setTimeOut(() => resolve(), 10);
    });
  }
}

export default PeerUpdater;
