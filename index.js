"use strict"

window.addEventListener("DOMContentLoaded", () => {

  // References to relevant DOM elements
  var parentBox    = document.getElementById("parent")
  var wordBox      = document.getElementById("word")
  var nonceBox     = document.getElementById("nonce")
  var autoButton   = document.getElementById("auto")
  var incButton    = document.getElementById("increment")
  var decButton    = document.getElementById("decrement")
  var randomButton = document.getElementById("random")
  var hashDiv      = document.getElementById("hash")

  // Populate default values if no values are entered or left over
  if (parentBox.value === "" &&
      wordBox.value   === "" &&
      nonceBox.value  === "") {

        wordBox.value = "BitStory"
        nonceBox.value = "0"
  }

  // Update the hash whenever the text changes
  parentBox.addEventListener("input", updateHash)
  wordBox  .addEventListener("input", updateHash)
  nonceBox .addEventListener("input", updateHash)

  // Handle clicking the increment buttons
  incButton.addEventListener("click", () => {changeBy( 1);updateHash()})
  decButton.addEventListener("click", () => {changeBy(-1);updateHash()})

  // Auto-mine when the secret button is clicked
  autoButton.addEventListener("click", () => {
    var hash = "33"
    while(hash.slice(0, 4) !== "0000") {
      var nonce = parseInt(nonceBox.value, 10)
      changeBy(1)

      hash = getHash()
    }
    updateHash()
  })



  /**
   * Get the hash and update the DOM
   * Also checks for the secret keyword
   */
  function updateHash(){
    if (parentBox.value === "auto-mine") {
      autoButton.style.display = "inline"
    }
    hashDiv.innerHTML = getHash()
  }

  /**
   * Change the nonce in the DOM by n
   * @param n The amount to change by
   */
  function changeBy(n){
    var nonce = parseInt(nonceBox.value, 10)
    nonce += n
    nonceBox.value = nonce
  }

  // Handle clicking the random button
  randomButton.addEventListener("click", () => {

    // Generate the random 32-bit nonce
    var nonce = new Uint32Array(1)
    window.crypto.getRandomValues(nonce)
    nonceBox.value = nonce[0]

    updateHash()
  })

  /**
   * Calculate the sha256 hash of the parameters, and return the first
   * 8 hexadigits as a string
   * @return The computed has value
   */
  function getHash() {
    // Read in the values
    var nonce = parseInt(nonceBox.value, 10)
    var parent = parentBox.value
    var word = wordBox.value

    var concat = parent + word + nonce
    var hash = sha256(concat).slice(0, 8)

    return hash
  }

})
