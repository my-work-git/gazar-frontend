import React, { Component, Fragment } from 'react';

class CountdownS extends Component {
  state = {
    number: this.props.startFrom,
  };
  interval = null;
  componentDidMount() {
    this.interval = setInterval(() => {
      const { number } = this.state;
      if (number <= 0) {
        clearInterval(this.interval);
        this.interval = null;

        if (this.props.onDone) {
          this.props.onDone();
        }
      }

      this.setState({ number: this.state.number - 1 });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    return <Fragment>{this.state.number}</Fragment>;
  }
}

export default CountdownS;
