import { validateUrl } from "../lib/validator.js";
import { getRss } from "../lib/rss.js";
import { parserRss } from "../lib/parser.js";
import { uniqIdWithPref } from "../lib/utils.js";

export function initController(watchedState, i18nInstance) {
  function handleFormSubmit(url) {
    const existingUrls = watchedState.feeds.map((feed) => feed.url);
    watchedState.form.status = "validating";
    watchedState.form.errors = [];
    watchedState.loading.status = "idle";

    validateUrl(url, existingUrls, i18nInstance)
      .then((validUrl) => {
        watchedState.loading.status = "loading";

        return getRss(validUrl).then((xmlDoc) => {
          const { feed, posts } = parserRss(xmlDoc);

          const feedId = uniqIdWithPref("feed");
          feed.id = feedId;
          feed.url = validUrl;

          posts.forEach((post) => {
            post.feedId = feed.id;
            post.id = uniqIdWithPref("post");
          });

          watchedState.feeds.push(feed);
          watchedState.posts.push(...posts);
          watchedState.form.status = "success";
          watchedState.loading.status = "succeeded";
        });
      })
      .catch((error) => {
        watchedState.form.status = "error";
        watchedState.form.valid = false;
        watchedState.form.errors.push(error.message);
        watchedState.loading.status = "failed";
        watchedState.loading.error = error.message;
      });
  }

  return {
    handleFormSubmit,
  };
}
