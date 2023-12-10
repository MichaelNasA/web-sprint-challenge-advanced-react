import React from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  state = { ...initialState };
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = () => {
    const { index } = this.state;
    const x = index % 3; 
    const y = Math.floor(index / 3);
    return { x, y };
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  getXYMessage = () => {
    const { x, y } = this.getXY();
    return `Coordinates (${x + 1}, ${y + 1})`;
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    this.setState({ ...initialState });
    // Use this helper to reset all states to their initial values.
  }

  getNextIndex = (direction) => {
    const { index } = this.state;
    const isLeft = direction === 'left' && index % 3 !== 0;
    const isUp = direction === 'up' && index >= 3;
    const isRight = direction === 'right' && index % 3 !== 2;
    const isDown = direction === 'down' && index < 6;

    if (isLeft) return index - 1;
    if (isUp) return index - 3;
    if (isRight) return index + 1;
    if (isDown) return index + 3;

    return index;
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (evt) => {
    const { steps } = this.state;
    const newIndex = this.getNextIndex(evt);
    const newSteps = steps + 1;

    this.setState({
      index: newIndex,
      steps: newSteps,
      message: `Moved ${evt}`,
    });
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    const { id, value } = evt.target;
    this.setState({ [id]: value });
    // You will need this to update the value of the input.
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    console.log(`Email submitted: ${this.state.email}`);
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props;
    const { steps, message } = this.state;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {steps} times</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
              {idx === this.state.index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move('left')}>
            LEFT
          </button>
          <button id="up" onClick={() => this.move('up')}>
            UP
          </button>
          <button id="right" onClick={() => this.move('right')}>
            RIGHT
          </button>
          <button id="down" onClick={() => this.move('down')}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange} value={this.state.email} />
          <input id="submit" type="submit" />
        </form>
      </div>
    );
  }
}