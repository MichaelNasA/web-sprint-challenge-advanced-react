// // Write your tests here
// test('sanity', () => {
//   expect(true).toBe(true)
// })

// describe("reset button", ()=>{
//   test ("this is a test", ()=>{
//     // move the button
//     // test the count was changed
//     // click reset
//     // test the count is reset 
//     const button = document.querySelector("#reset")
//     console.log(button)
//   })
// })

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AppFunctional from './AppFunctional';

test('sanity', () => {
  expect(true).toBe(false);
});

describe('reset button', () => {
  test('resets state when clicked', () => {
    // Render the component
    const { getByText, getByTestId } = render(<AppFunctional />);

    // Interact with the component to change its state
    fireEvent.click(getByText('UP')); // For example, simulate moving UP

    // Check if the state is updated
    expect(getByTestId('steps').textContent).toContain('1 times');

    // Interact with the reset button
    fireEvent.click(getByText('reset'));

    // Check if the state is reset
    expect(getByTestId('steps').textContent).toContain('0 times');
  });
});