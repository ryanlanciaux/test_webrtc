import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { getRandomStuff } from "./utils";
import DataChannelSender from "./DataChannelSender";

const MAX_ATTEMPTS = 5;
export default class Host extends Component {
  state = { isHost: false, isClient: false, messages: [] };
  connectionAttempts = 0;

  componentDidMount() {
    this.attemptEstablishConnection();
  }

  attemptEstablishConnection = () => {
    if (this.connectionAttempts > MAX_ATTEMPTS) {
      return;
    }

    this.connectionAttempts++;

    window.setTimeout(() => {
      if (this.establishConnection()) {
        return;
      }

      this.attemptEstablishConnection();
    }, 200);
  };

  establishConnection = () => {
    const { sendSocketMessage, isSocketConnectionEstablished } = this.props;

    if (isSocketConnectionEstablished) {
      sendSocketMessage({ type: "HOST" });
      return true;
    }

    return false;
  };

  render() {
    const {
      isSocketConnectionEstablished,
      accessCode,
      hasDataChannel,
      sendDataChannelMessage,
      subscribe
    } = this.props;

    console.log("HOST", this.props);
    if (!isSocketConnectionEstablished) {
      return null;
    }

    if (hasDataChannel) {
      return (
        <DataChannelSender
          onClick={() => sendDataChannelMessage(getRandomStuff())}
          subscribe={subscribe}
        />
      );
    }

    return (
      <div style={{ margin: 100 }}>
        <h1>{accessCode ? accessCode : "Loading"}</h1>
        <div style={{ marginTop: 30 }}>Version 0.10</div>
      </div>
    );
  }
}
