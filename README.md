# To-Do List

A lightweight, responsive to-do list web application built with vanilla JavaScript, HTML5, and CSS3. No frameworks or external dependencies required.

## Features

- **Add Tasks** – Type a task and press *Add* or hit Enter to add it to the list.
- **Mark Complete** – Click any task (or its circle checkbox) to toggle its completion state. Completed tasks are shown with a strikethrough.
- **Delete Tasks** – Click the **✕** button on any task to remove it with a smooth animation.
- **Clear Completed** – Click *Clear Completed* in the footer to remove all done tasks at once.
- **Persistent Storage** – All tasks are saved to browser Local Storage and survive page refreshes or browser restarts.
- **Task Counter** – The header shows the total number of tasks and how many are completed.
- **Input Validation** – Empty submissions are blocked, and an inline error message is shown.
- **Responsive Design** – Mobile-first layout that works on all screen sizes.

## Getting Started

No build step or server is needed. Simply open `index.html` in any modern web browser:

```bash
# Option 1 – open directly
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows

# Option 2 – serve locally (optional)
npx serve .
# or
python3 -m http.server 8080
```

## File Structure

```
todo-list/
├── index.html    # Application markup (HTML5 semantic elements)
├── styles.css    # Styling and animations (CSS3, Flexbox, custom properties)
├── script.js     # Application logic (vanilla JS, Local Storage API)
└── README.md     # This file
```

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge) that support:
- ES2015+ (arrow functions, `const`/`let`, template literals)
- `localStorage` API
- CSS custom properties and Flexbox

## Usage

1. **Add a task**: Type in the input field and click **Add** or press **Enter**.
2. **Complete a task**: Click anywhere on the task row to toggle its status.
3. **Delete a task**: Click the **✕** button on the right side of a task.
4. **Clear all done tasks**: Click **Clear Completed** at the bottom.

Tasks are automatically saved after every action — no manual save required.
