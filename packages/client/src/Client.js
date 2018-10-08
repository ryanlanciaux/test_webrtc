import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import DataChannelSender from "./DataChannelSender";
import { getRandomStuff } from "./utils";
import { CLIENT } from "./constants";

export default class extends Component {
  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.startEstablishingConnection();
    }
  };

  startEstablishingConnection = () => {
    console.log(CLIENT, this.element.value);
    const { sendSocketMessage } = this.props;
    sendSocketMessage({ type: CLIENT, code: this.element.value });
  };

  render() {
    const {
      hasDataChannel,
      sendDataChannelMessage,
      latestMessage
    } = this.props;

    if (hasDataChannel) {
      return (
        <DataChannelSender
          onClick={() => sendDataChannelMessage(getRandomStuff())}
          latestMessage={latestMessage}
        />
      );
    }

    return (
      <Fragment>
        <input
          type="text"
          ref={el => (this.element = el)}
          onKeyPress={this.handleKeyPress}
        />
        <button onClick={this.startEstablishingConnection}>GO!</button>
      </Fragment>
    );
  }
}
