const canvas = document.getElementById('canvas');
const fontSizeDropdown = document.getElementById('fontSize');
const fontFamilyDropdown = document.getElementById('fontFamily');
const boldButton = document.getElementById('bold');
const italicButton = document.getElementById('italic');
const underlineButton = document.getElementById('underline');
const centerButton = document.getElementById('centerText');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');

let selectedElement = null;
let history = [];
let redoStack = [];

// Set default font size
fontSizeDropdown.value = "20";

// Save state for undo
function saveState() {
  history.push(canvas.innerHTML);
  if (history.length > 50) history.shift(); // Limit history to 50
  redoStack = [];
}

// Handle undo
undoButton.addEventListener('click', () => {
  if (history.length > 0) {
    redoStack.push(canvas.innerHTML);
    canvas.innerHTML = history.pop();
  }
});

// Handle redo
redoButton.addEventListener('click', () => {
  if (redoStack.length > 0) {
    history.push(canvas.innerHTML);
    canvas.innerHTML = redoStack.pop();
  }
});

// Handle canvas click to add or select text
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // If clicking on an existing element, select it
  if (e.target.classList.contains('draggable')) {
    selectedElement = e.target;
  } else {
    // Create a new blank text element
    const newText = document.createElement('div');
    newText.className = 'draggable';
    newText.contentEditable = true;
    newText.textContent = ''; // Keep blank initially
    newText.style.left = `${x}px`;
    newText.style.top = `${y}px`;
    newText.style.fontSize = `${fontSizeDropdown.value}px`;
    newText.style.fontFamily = fontFamilyDropdown.value;

    makeDraggable(newText);
    canvas.appendChild(newText);

    selectedElement = newText;
    newText.focus();
    saveState();
  }
});

// Handle font size change
fontSizeDropdown.addEventListener('change', () => {
  if (selectedElement) {
    selectedElement.style.fontSize = `${fontSizeDropdown.value}px`;
    saveState();
  }
});

// Handle font family change
fontFamilyDropdown.addEventListener('change', () => {
  if (selectedElement) {
    selectedElement.style.fontFamily = fontFamilyDropdown.value;
    saveState();
  }
});

// Formatting buttons
boldButton.addEventListener('click', () => {
  if (selectedElement) {
    selectedElement.style.fontWeight =
      selectedElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
    saveState();
  }
});

italicButton.addEventListener('click', () => {
  if (selectedElement) {
    selectedElement.style.fontStyle =
      selectedElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
    saveState();
  }
});

underlineButton.addEventListener('click', () => {
  if (selectedElement) {
    selectedElement.style.textDecoration =
      selectedElement.style.textDecoration === 'underline' ? 'none' : 'underline';
    saveState();
  }
});

centerButton.addEventListener('click', () => {
  if (selectedElement) {
    selectedElement.style.textAlign = 'center';
    selectedElement.style.left = '50%';
    selectedElement.style.transform = 'translateX(-50%)';
    saveState();
  }
});

// Make draggable
function makeDraggable(element) {
  let offsetX, offsetY;

  element.addEventListener('mousedown', (e) => {
    selectedElement = element;
    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    const onMouseMove = (e) => {
      const canvasRect = canvas.getBoundingClientRect();
      let newX = e.clientX - canvasRect.left - offsetX;
      let newY = e.clientY - canvasRect.top - offsetY;

      newX = Math.max(0, Math.min(newX, canvas.offsetWidth - element.offsetWidth));
      newY = Math.max(0, Math.min(newY, canvas.offsetHeight - element.offsetHeight));

      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
      saveState();
    }, { once: true });
  });
}
