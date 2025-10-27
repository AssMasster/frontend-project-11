// @ts-ignore
import { validateUrl } from '../lib/validator.js'
import { getRss } from '../lib/rss.js'
import { parserRss } from '../lib/parser.js'
import { uniqIdWithPref } from '../lib/utils.js'

export function initController(watchedState, i18nInstance) {
  function handleFormSubmit(url) {
    const existingUrls = watchedState.feeds.map(feed => feed.url)
    watchedState.form.status = 'validating'
    watchedState.form.errors = []
    watchedState.loading.status = 'idle'

    validateUrl(url, existingUrls, i18nInstance)
      .then((validUrl) => {
        watchedState.loading.status = 'loading'
        return getRss(validUrl).then((xmlDoc) => {
          try {
            const { feed, posts } = parserRss(xmlDoc)

            const feedId = uniqIdWithPref('feed')
            feed.id = feedId
            feed.url = validUrl

            posts.forEach((post) => {
              post.feedId = feed.id
              post.id = uniqIdWithPref('post')
            })
            const wasEmpty = watchedState.feeds.length === 0

            watchedState.feeds.push(feed)
            watchedState.posts.push(...posts)

            if (wasEmpty) {
              startAutoUpdate()
            }
            watchedState.form.status = 'success'
            watchedState.loading.status = 'succeeded'
          }
          catch (parseError) {
            console.log('i18nInstance:', i18nInstance)
            console.log('Текущий язык:', i18nInstance.language)
            console.log('Доступные namespace:', i18nInstance.options.ns)
            console.log('Ошибка парсинга RSS:', parseError)
            throw new Error(i18nInstance.t('ui.errors.invalidRss'))
          }
        })
      })
      .catch((error) => {
        console.log('Ошибка при обработке формы:', error.message)

        watchedState.form.status = 'error'
        watchedState.form.valid = false
        watchedState.form.errors = [error.message]
        watchedState.loading.status = 'failed'
        watchedState.loading.error = error.message
      })
  }
  function updateFeed(feed) {
    return getRss(feed.url)
      .then((xmlDoc) => {
        const { posts } = parserRss(xmlDoc)

        const newPosts = posts.filter((post) => {
          const postExists = watchedState.posts.some(
            existingPost => existingPost.link === post.link,
          )
          return !postExists
        })

        newPosts.forEach((post) => {
          post.feedId = feed.id
          post.id = uniqIdWithPref('post')
        })
        if (newPosts.length > 0) {
          watchedState.posts.unshift(...newPosts)
          console.log(
            `Добавлено ${newPosts.length} новых постов из фида "${feed.title}"`,
          )
        }

        return newPosts
      })
      .catch((error) => {
        console.error(`Ошибка обновления фида "${feed.title}":`, error)
        return []
      })
  }
  function updateAllFeeds() {
    if (watchedState.feeds.length === 0) {
      console.log('Нет фидов для обновления')
      return
    }

    console.log(`Обновление ${watchedState.feeds.length} фидов...`)

    const updatePromises = watchedState.feeds.map(feed => updateFeed(feed))

    Promise.all(updatePromises)
      .then((results) => {
        const allNewPosts = results.flat()
        console.log(
          `Обновление завершено. Новых постов: ${allNewPosts.length}`,
        )
      })
      .finally(() => {
        setTimeout(updateAllFeeds, 5000)
      })
  }

  function startAutoUpdate() {
    console.log('Запуск авто-обновления...')
    updateAllFeeds()
  }
  function showPostModal(post, watchedState) {
    document.getElementById('post-modal-title').textContent = post.title
    document.getElementById('post-modal-body').textContent = post.description

    const modal = new bootstrap.Modal(document.getElementById('post-modal'))
    modal.show()

    if (!watchedState.ui.readPostsId.includes(post.id)) {
      watchedState.ui.readPostsId.push(post.id)
    }
  }

  return {
    handleFormSubmit,
    startAutoUpdate,
    showPostModal,
  }
}
