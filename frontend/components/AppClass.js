import React from 'react'
import axios from 'axios';

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
  state = initialState;
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = () => {
    const { index } = this.state;
    const x = (index % 3) + 1; 
    let y
    if(index < 3) y =1
      else if (index < 6) y=2
      else if (index < 9) y=3
    return [ x, y ];
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  getXYMessage = () => {
    const [ x, y ] = this.getXY();
    return `Coordinates (${x}, ${y})`;
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    this.setState({ ...initialState });
    // Use this helper to reset all states to their initial values.
  }

  getNextIndex = (direction) => {
    const {index} = this.state
    console.log("current spot", index);
    console.log("direction", direction);
    switch( direction ){
      case 'up':
        return (index >= 3) ? index - 3 : index;
      case 'down':
        return (index < 6) ? index + 3 : index;
      case 'left':
        return (index % 3 !== 0) ? index - 1 : index;
      case 'right':
        return ((index + 1) % 3 !== 0) ? index + 1 : index;
      default:
        return;  
    }
    // const { index } = this.state;
    // const isLeft = direction === 'left' && index % 3 !== 0;
    // const isUp = direction === 'up' && index >= 3;
    // const isRight = direction === 'right' && index % 3 !== 2;
    // const isDown = direction === 'down' && index < 6;

    // if (isLeft) return index - 1;
    // if (isUp) return index - 3;
    // if (isRight) return index + 1;
    // if (isDown) return index + 3;

    //return index;
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (evt) => {
    //const index = evt.target
    const direction = evt.target.id
    const { steps } = this.state;
    const newIndex = this.getNextIndex(direction);
    if(newIndex === this.state.index){
      this.setState({
        ...this.state,
        message: `You can't go ${direction}`,
      })
      // can't move 
    } else {
      this.setState({
        ...this.state,
        index: newIndex,
        steps: steps + 1,
        message: `Moved ${direction}`,
      });
      // can move
    }

    console.log("move");

    // this.setState({
    //   index: newIndex,
    //   //steps: newSteps,
    //   message: `Moved ${direction}`,
    // });
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    const { id, value } = evt.target;
    this.setState({ [id]: value });
    // You will need this to update the value of the input.
  }

  onSubmit = (evt) => {
    //const email = evt.target.email.value;
    evt.preventDefault();
    const [x,y] = this.getXY()
    const {email, steps} = this.state
    axios.post("http://localhost:9000/api/result", {
        email,steps,x,y
        })
        .then((res) => {
          this.setState({ message: res.data.message });
        })
        .catch((err) => {
          console.log("Error:", err);
          if (err.response && err.response.data) {
            this.setState({ message: err.response.data.message });
          } else {
            this.setState({ message: "An unexpected error occurred." });
          }
        })
    //console.log(`Email submitted: ${this.state.email}`);
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props;
    const { steps, message, index, email } = this.state;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {steps} times</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={(evt) =>this.move(evt)}>
            LEFT
          </button>
          <button id="up" onClick={(evt) => this.move(evt)}>
            UP
          </button>
          <button id="right" onClick={(evt) => this.move(evt)}>
            RIGHT
          </button>
          <button id="down" onClick={(evt) => this.move(evt)}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" value={email} placeholder="type email" onChange={this.onChange}/>
          <input id="submit" type="submit" />
        </form>
      </div>
    );
  }
}