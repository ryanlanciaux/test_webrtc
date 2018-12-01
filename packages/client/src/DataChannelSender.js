import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
const buttonStyle = {
  height: 60,
  width: 600,
  fontSize: 40,
  backgroundColor: "#BAD",
  margin: 40
};

class DataChannelSender extends React.Component {
  componentDidMount() {
    this.element && this.element.focus();
  }
  render() {
    const { onClick, latestMessage } = this.props;
    return (
      <div
        style={{
          backgroundColor: "#EDEDED",
          padding: 20,
          margin: 60,
          fontSize: 40
        }}
      >
        Click to send random stuff over data channel.
        <button
          style={buttonStyle}
          onClick={onClick}
          ref={element => {
            this.element = element;
          }}
        >
          Click to send random stuff.
        </button>
        <h5>Latest received message</h5>
        {latestMessage}
      </div>
    );
  }
}

export default DataChannelSender;
