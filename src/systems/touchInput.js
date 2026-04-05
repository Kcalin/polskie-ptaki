// Shared touch-input state — read by Bird.js, Batalion.js, Level1Scene.js
// Set by TouchScene; consumed flags (_jumpDown etc.) must be reset by the reader.
const touchInput = {
  left:  false,
  right: false,

  // One-shot flags: set true by TouchScene on button press,
  // reset to false by the code that consumes them (same frame).
  _jumpDown:     false,
  _shiftDown:    false,
  _interactDown: false,

  // Level1Scene writes these so TouchScene can show/hide buttons.
  showInteract: false,
  modalOpen:    false,
}

export default touchInput
