import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import DataChannelSender from "./DataChannelSender";
import { getRandomStuff } from "./utils";
import { CLIENT } from "./constants";

const inputStyle = {
  height: 60,
  fontSize: 40,
  width: 200
};
const buttonStyle = {
  height: 60,
  width: 200,
  fontSize: 40,
  backgroundColor: "#BAD"
};

export default class extends Component {
  state = { selected: this.element };

  componentDidMount() {
    this.element.focus();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = e => {
    const isArrow = e.key.startsWith("Arrow");

    if (isArrow) {
      // just select the thing that's not selected since there's only two
      // #hacky
      this.setState(previous => ({
        selected:
          previous.selected === this.element ? this.button : this.element
      }));
    }
  };

  componentDidUpdate() {
    this.state.selected && this.state.selected.focus();
  }

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
      <div
        style={{
          backgroundColor: "#EDEDED",
          padding: 20,
          margin: 60
        }}
      >
        <input
          style={inputStyle}
          type="text"
          ref={el => (this.element = el)}
          onKeyPress={this.handleKeyPress}
          placeholder="Enter key"
        />
        <button
          ref={element => (this.button = element)}
          onClick={this.startEstablishingConnection}
          style={buttonStyle}
        >
          GO!
        </button>
      </div>
    );
  }
}
