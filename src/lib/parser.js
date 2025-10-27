export function parserRss(dataXml) {
  const domParser = new DOMParser()
  const data = domParser.parseFromString(dataXml, 'text/xml')

  const feedTitleElement = data.querySelector('channel title')
  const feedDescriptionElement = data.querySelector('channel description')

  if (!feedTitleElement) {
    throw new Error('Invalid RSS: missing channel title')
  }
  if (!feedDescriptionElement) {
    throw new Error('Invalid RSS: missing channel description')
  }

  const feedName = feedTitleElement.textContent
  const feedDescription = feedDescriptionElement.textContent

  const result = {
    feed: {
      title: feedName,
      description: feedDescription,
    },
    posts: [],
  }
  data.querySelectorAll('item').forEach((item) => {
    const postTitleElement = item.querySelector('title')
    const postLinkElement = item.querySelector('link')
    const postDescriptionElement = item.querySelector('description')
    if (!postTitleElement || !postLinkElement || !postDescriptionElement) {
      return
    }

    const postTitle = postTitleElement.textContent
    const postLink = postLinkElement.textContent
    const postDescription = postDescriptionElement.textContent

    result.posts.push({
      title: postTitle,
      link: postLink,
      description: postDescription,
    })
  })

  const parseError = data.querySelector('parsererror')
  if (parseError) {
    throw new Error('Invalid RSS format')
  }

  return result
}
