import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const DataChannelSender = ({ onClick, latestMessage }) => (
  <Fragment>
    Click to send random stuff over data channel.
    <button onClick={onClick}>Click to send random stuff.</button>
    <h5>Latest received message</h5>
    {latestMessage}
  </Fragment>
);

export default DataChannelSender;
