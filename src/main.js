import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { state } from "./app/state.js";
import { initView } from "./view/view.js";
import { initController } from "./app/controller.js";

const watchedState = initView(state);
const controller = initController(watchedState);

window.watchedState = watchedState; //TESTING

const app = document.getElementById("app");
app.innerHTML = `
  <div class="container mt-5">
    <h1>RSS Aggregator</h1>
    <form id="rss-form" class="mt-4">
      <div class="mb-3">
        <label for="rss-url" class="form-label">RSS URL</label>
        <input type="url" class="form-control" id="rss-url" name="input" placeholder="https://example.com/rss" required>
      </div>
      <button type="submit" class="btn btn-primary">Add RSS</button>
    </form>
    <div id="feed-container" class="mt-4"></div>
  </div>
`;

document.getElementById("rss-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get("rss-url");
  controller.handleFormSubmit(url);
});
