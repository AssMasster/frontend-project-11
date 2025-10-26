export const state = {
  ui: {
    lng: "en",
    readPostsId: [],
  },
  form: {
    url: "",
    valid: true,
    status: "", //filling, validating, error, success
    errors: [],
  },
  //feeds: [{name, description, dateAdded}]
  feeds: [], //{id, title, url, description}
  posts: [], //{id, feedId, title, link, description}
  loading: {
    status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed' | 'retrying'
    error: null,
  },
};
