export function parserRss(dataXml) {
  const domParser = new DOMParser();
  const data = domParser.parseFromString(dataXml, "text/xml");
  const feedName = data.querySelector("channel title").textContent;
  const feedDescription = data.querySelector("channel description").textContent;

  const result = {
    feed: {
      title: feedName,
      description: feedDescription,
    },
    posts: [],
  };

  data.querySelectorAll("item").forEach((item) => {
    const postTitle = item.querySelector("title").textContent;
    const postLink = item.querySelector("link").textContent;
    const postDescription = item.querySelector("description").textContent;

    result.posts.push({
      title: postTitle,
      link: postLink,
      description: postDescription,
    });
  });

  const parseError = data.querySelector("parsererror");
  if (parseError) {
    throw new Error("Invalid RSS format");
  }

  return result;
}
