const object = document.getElementById('object');

function toggleVisibility() {
  object.style.display = object.style.display === 'none' ? 'block' : 'none';
}

function randomDelay() {
  return Math.floor(Math.random() * 3000) + 1000; // Random delay between 1 and 3 seconds
}

function disappearAndReappear() {
  toggleVisibility(); // Initial visibility
  setTimeout(function () {
    toggleVisibility(); // Toggle visibility after random delay
    setTimeout(disappearAndReappear, randomDelay()); // Schedule next appearance
  }, randomDelay());
}

disappearAndReappear(); // Start the cycle