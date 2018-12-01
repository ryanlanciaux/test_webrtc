import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { BrowserRouter, Route, Link } from "react-router-dom";
import ConnectionBroker from "./ConnectionBroker";
import Host from "./Host";
import Client from "./Client";

const SOCKET_ADDRESS = "ws://127.0.0.1:8088";

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

const Router = () => (
  <BrowserRouter>
    <div>
      <Route
        exact
        path="/"
        render={props => (
          <div>
            <div
              style={{
                margin: 20,
                padding: 20,
                backgroundColor: "#EDEDED",
                borderRadius: 15
              }}
            >
              <Link to="/Host">HOST</Link>
            </div>
            <div
              style={{
                margin: 20,
                padding: 20,
                backgroundColor: "#EDEDED",
                borderRadius: 15
              }}
            >
              <Link to="/join">JOIN</Link>
            </div>
            <div style={{ margin: 20, padding: 20 }}>
              {hasRTCPeer() ? (
                <span>Should have RTC connection</span>
              ) : (
                <span>RTC is not working</span>
              )}
            </div>
            <div style={{ margin: 20, padding: 20 }}>Version 0.12</div>
          </div>
        )}
      />
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
