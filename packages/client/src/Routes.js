import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { BrowserRouter, Route, Link } from "react-router-dom";
import ConnectionBroker from "./ConnectionBroker";
import Host from "./Host";
import Client from "./Client";

const SOCKET_ADDRESS = "ws://127.0.0.1:8088";

const Router = () => (
  <BrowserRouter>
    <div>
      <Route
        exact
        path="/"
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
