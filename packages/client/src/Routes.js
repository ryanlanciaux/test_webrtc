import React, { Component } from "react";

import { BrowserRouter, Route } from "react-router-dom";
import ConnectionBroker from "./ConnectionBroker";
import Host from "./Host";
import Client from "./Client";

const SOCKET_ADDRESS = "ws://127.0.0.1:8088";
const VERSION = 0.13;

function hasRTCPeer() {
  let hasRTCPeer = false;
  try {
    const o = new (window.RTCPeerConnection ||
      window.msRTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection)(null);
    hasRTCPeer = "createDataChannel" in o;
  } catch (e) {}

  return hasRTCPeer;
}

const buttonStyle = {
  height: 60,
  width: 200,
  fontSize: 40,
  backgroundColor: "#BAD"
};

class Main extends Component {
  state = { selected: this.firstLink };

  componentDidMount() {
    this.firstLink.focus();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = e => {
    const isArrow = e.key === "ArrowDown" || e.key === "ArrowUp";

    if (isArrow) {
      // just select the thing that's not selected since there's only two
      // #hacky
      this.setState(previous => ({
        selected:
          previous.selected === this.firstLink
            ? this.secondLink
            : this.firstLink
      }));
    }
  };

  componentDidUpdate() {
    this.state.selected.focus();
  }
  render() {
    return (
      <div
        style={{
          backgroundColor: "#EDEDED",
          padding: 20,
          margin: 60
        }}
      >
        <div
          style={{
            margin: 20,
            padding: 20
          }}
        >
          <button
            style={buttonStyle}
            onClick={() => {
              this.props.history.push("/host");
            }}
            ref={element => (this.firstLink = element)}
          >
            HOST
          </button>
        </div>
        <div
          style={{
            margin: 20,
            padding: 20
          }}
        >
          <button
            style={buttonStyle}
            onClick={() => {
              this.props.history.push("/join");
            }}
            ref={element => (this.secondLink = element)}
          >
            JOIN
          </button>
        </div>
        <div style={{ margin: 20, padding: 20 }}>
          {hasRTCPeer() ? (
            <span>Should have RTC connection</span>
          ) : (
            <span>RTC is not working</span>
          )}
        </div>
        <div style={{ margin: 20, padding: 20 }}>Version {VERSION}</div>
      </div>
    );
  }
}
const Router = () => (
  <BrowserRouter>
    <div>
      <Route exact path="/" render={props => <Main {...props} />} />
      <Route
        exact
        path="/host"
        render={props => (
          <ConnectionBroker socketAddress={SOCKET_ADDRESS}>
            {connectionProps => <Host {...connectionProps} />}
          </ConnectionBroker>
        )}
      />
      <Route
        exact
        path="/join"
        render={props => (
          <ConnectionBroker socketAddress={SOCKET_ADDRESS}>
            {connectionProps => <Client {...connectionProps} />}
          </ConnectionBroker>
        )}
      />
    </div>
  </BrowserRouter>
);

export default Router;
