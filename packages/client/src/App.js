import React, { Component, Fragment } from "react";
import "./App.css";
import { error } from "util";

const SOCKET_ADDRESS = "ws://127.0.0.1:8088";

const messagesTypes = {
  CANDIDATE: "CANDIDATE",
  OFFER: "OFFER",
  ANSWER: "ANSWER",
  HOST_KEY: "HOST_KEY",
  HOST_CONNECTION_INFO: "HOST_CONNECTION_INFO"
};

const rtcConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

class ConnectionEstablishizer extends Component {
  state = {
    isSocketConnectionEstablished: false,
    accessCode: null,
    hasDataChannel: false,
    latestMessage: null
  };

  constructor() {
    super();

    // name provided by server
    this.name = null;
    this.webSocket = null;
    this.remoteName = null;
    this.rtcConnection = {};
    this.dataChannel = null;
    this.peer = null;

    this.onIceCandidate = this.onIceCandidate.bind(this);
  }

  componentDidMount() {
    const socket = new WebSocket(this.props.socketAddress);

    socket.onopen = () => {
      this.setState({ isSocketConnectionEstablished: true });
      this.webSocket = socket;

      socket.onmessage = this.onSocketMessage;
      socket.onclose = this.onSocketClose;
      socket.onerror = this.onSocketError;
    };

    this.peer = new RTCPeerConnection(rtcConfig, this.rtcConnection);
    this.peer.onicecandidate = this.onIceCandidate;

    this.dataChannel = this.peer.createDataChannel("datachannel", {
      reliable: false
    });

    this.dataChannel.onopen = this.onDataChannelOpen;
    this.dataChannel.onerror = this.onDataChannelError;
    this.dataChannel.onclose = this.onDataChannelClose;

    this.peer.ondatachannel = this.onPeerDataChannel;
  }

  componentWillUnmount() {
    this.webSocket.close();
  }

  onDataChannelOpen = () => {
    console.log("data channel opened");
  };

  onDataChannelClose = () => {
    console.log("data channel closed");
  };

  onDataChannelError = () => {
    console.log("data channel error");
  };

  onPeerDataChannel = channelEvent => {
    channelEvent.channel.onopen = () => {
      console.log("Data channel opened");
    };

    channelEvent.channel.onmessage = this.onChannelMessage;
    this.setState({ hasDataChannel: true });
  };

  onChannelMessage = ({ data }) => {
    console.log("Received data on channel", data);
    this.setState({ latestMessage: data });
  };

  onIceCandidate(e) {
    const candidate = e.candidate;
    this.sendNegotiation(messagesTypes.CANDIDATE, candidate);
  }

  onSocketClose = () => {
    // do something to handle the closing of the socket
  };

  onSocketError = () => {
    console.log("Error occurred");
  };

  establishConnection = async () => {
    const constraints = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    };

    try {
      const params = await this.peer.createOffer(constraints);
      this.peer.setLocalDescription(params);
      this.sendNegotiation(messagesTypes.OFFER, params);
    } catch (ex) {
      console.error("Could not establish connection");
    }
  };

  onSocketMessage = async messageEvent => {
    var message = JSON.parse(messageEvent.data);

    console.log(message);
    if (!message.type && !message.clientName) {
      throw new Error("Not an expected message");
    }

    if (message.clientName) {
      this.name = message.clientName;
      return;
    }

    // This is a bit more stateful / mutatey than I would like as an end result
    // refactorrrrrrr
    if (message.from && !this.remoteName) {
      this.remoteName = message.from;
    }

    switch (message.type) {
      case messagesTypes.CANDIDATE:
        this.processIce(message.data);
        return;
      case messagesTypes.OFFER:
        this.processOffer(message.data);
        return;
      case messagesTypes.ANSWER:
        this.processAnswer(message.data);
        return;
      case messagesTypes.HOST_KEY:
        this.displayHostKey(message.accessCode);
        return;
      case messagesTypes.HOST_CONNECTION_INFO:
        this.remoteName = message.host;
        this.establishConnection();
        return;
      default:
        throw new error("Unknown message type");
    }
  };

  displayHostKey = accessCode => {
    this.setState({ accessCode });
  };

  processIce = async candidate => {
    try {
      this.peer.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (ex) {
      console.error("Error processing ice candidate");
    }
  };

  processOffer = async offer => {
    try {
      this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const constraints = {
        mandatory: {
          OfferToReceiveAudio: false,
          OfferToReceiveVideo: false
        }
      };

      const sessionDescriptionParameters = await this.peer.createAnswer(
        constraints
      );
      await this.peer.setLocalDescription(sessionDescriptionParameters);
      this.sendNegotiation(messagesTypes.ANSWER, sessionDescriptionParameters);
    } catch {
      console.error("Error in process offer");
    }
  };

  processAnswer = async answer => {
    this.peer.setRemoteDescription(new RTCSessionDescription(answer));
  };

  sendNegotiation = (type, sessionDescriptionParameters) => {
    this.sendMessage({
      from: this.name,
      to: this.remoteName,
      action: type,
      data: sessionDescriptionParameters
    });
  };

  sendMessage = message => {
    if (typeof message !== "object") {
      throw new Error("Must send an object from sendMessage!");
    }

    console.log("SENDING MESSAGE FROM", this.name);
    this.webSocket.send(JSON.stringify({ ...message, socketName: this.name }));
  };

  sendChannelMessage = message => {
    this.dataChannel.send(message);
  };

  onClick = () => {
    this.sendMessage({ id: "12345" });
  };

  render() {
    const { children } = this.props;
    const {
      isSocketConnectionEstablished,
      accessCode,
      hasDataChannel,
      latestMessage
    } = this.state;

    return children({
      isSocketConnectionEstablished,
      sendSocketMessage: this.sendMessage,
      sendDataChannelMessage: this.sendChannelMessage,
      accessCode: accessCode,
      hasDataChannel: hasDataChannel,
      latestMessage
    });
  }
}

function getRandomStuff() {
  return Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
}

class SendMessage extends Component {
  state = { isHost: false, isClient: false };

  render() {
    const {
      isSocketConnectionEstablished,
      sendSocketMessage,
      accessCode,
      hasDataChannel,
      sendDataChannelMessage,
      latestMessage
    } = this.props;

    const { isHost, isClient } = this.state;

    if (hasDataChannel) {
      return (
        <Fragment>
          Click to send random stuff over data channel.
          <button onClick={() => sendDataChannelMessage(getRandomStuff())}>
            Click to send random stuff.
          </button>
          <h5>Latest received message</h5>
          {latestMessage}
        </Fragment>
      );
    }

    if (isClient) {
      return (
        <Fragment>
          <input type="text" ref={el => (this.element = el)} />
          <button
            onClick={() => {
              sendSocketMessage({ type: "CLIENT", code: this.element.value });
            }}
          >
            GO!
          </button>
        </Fragment>
      );
    }

    if (accessCode) {
      return <h1>{accessCode}</h1>;
    }

    return isSocketConnectionEstablished ? (
      <Fragment>
        <button onClick={() => sendSocketMessage({ type: "HOST" })}>
          Host
        </button>
        <button onClick={() => this.setState({ isClient: true })}>
          client
        </button>
      </Fragment>
    ) : (
      <h1>Loading</h1>
    );
  }
}

class App extends Component {
  render() {
    return (
      <ConnectionEstablishizer socketAddress={SOCKET_ADDRESS}>
        {props => <SendMessage {...props} />}
      </ConnectionEstablishizer>
    );
  }
}

export default App;
