import onChange from 'on-change'

function updateLanguageButtons(activeLng) {
  document.querySelectorAll('[data-lng]').forEach((button) => {
    const isActive = button.dataset.lng === activeLng
    button.classList.toggle('btn-primary', isActive)
    button.classList.toggle('btn-outline-primary', !isActive)
  })
}

function showSuccessMessage(message) {
  const feedbackElement = document.querySelector('.feedback')
  if (!feedbackElement) return

  feedbackElement.textContent = message
  feedbackElement.classList.add('text-success')
  feedbackElement.classList.remove('text-danger', 'd-none')
  feedbackElement.style.display = 'block'

  setTimeout(() => {
    feedbackElement.style.display = 'none'
  }, 5000)
}

function renderInitialTexts(i18n) {
  const title = document.querySelector('h1')
  const label = document.querySelector('label[for="rss-url"]')
  const input = document.querySelector('#rss-url')
  const button = document.querySelector('#rss-form button')

  if (title) title.textContent = i18n.t('ui.title')
  if (label) label.textContent = i18n.t('ui.urlLabel')
  if (input) input.placeholder = i18n.t('ui.urlPlaceholder')
  if (button) button.textContent = i18n.t('ui.submitButton')
}

function updateInputValidity(isValid) {
  const input = document.querySelector('#rss-url')
  if (isValid) {
    input.classList.remove('is-invalid')
  }
  else {
    input.classList.add('is-invalid')
  }
}

function updateErrorDisplay(errors) {
  const feedbackElement = document.querySelector('.feedback')
  if (!feedbackElement) return

  if (errors.length > 0) {
    const errorMessage = errors[errors.length - 1]
    feedbackElement.textContent = errorMessage
    feedbackElement.classList.add('text-danger')
    feedbackElement.classList.remove('text-success', 'd-none')
    feedbackElement.style.display = 'block'

    const input = document.querySelector('#rss-url')
    input.classList.add('is-invalid')
  }
  else {
    feedbackElement.textContent = ''
    feedbackElement.classList.add('d-none')
    feedbackElement.classList.remove('text-danger', 'text-success')
    feedbackElement.style.display = 'none'

    const input = document.querySelector('#rss-url')
    input.classList.remove('is-invalid')
  }
}

function handleNewFeedAdded(feeds) {
  const feedContainer = document.querySelector('.feeds-list')
  if (!feedContainer) {
    console.error('Не найден .feeds-list контейнер')
    return
  }

  feedContainer.innerHTML = ''

  feeds.forEach((feed) => {
    const feedElement = document.createElement('div')
    feedElement.className = 'feed-item mb-3 p-3 border rounded'

    const h3 = document.createElement('h3')
    h3.className = 'h5'
    h3.textContent = feed.title

    const pDescription = document.createElement('p')
    pDescription.className = 'text-muted mb-0'
    pDescription.textContent = feed.description

    feedElement.append(h3, pDescription)
    feedContainer.append(feedElement)
  })

  console.log(`Отрисовано фидов: ${feeds.length}`)
}

function renderAllTexts(i18n) {
  // Функция для перевода всех текстов
  const elementsToTranslate = [
    { selector: 'h1', key: 'ui.title' },
    { selector: 'label[for="rss-url"]', key: 'ui.urlLabel' },
    { selector: '#rss-url', key: 'ui.urlPlaceholder', attr: 'placeholder' },
    { selector: '#rss-form button', key: 'ui.submitButton' },
  ]

  elementsToTranslate.forEach(({ selector, key, attr }) => {
    const element = document.querySelector(selector)
    if (element) {
      if (attr) {
        element[attr] = i18n.t(key)
      }
      else {
        element.textContent = i18n.t(key)
      }
    }
  })
}

export function initView(state, i18Instance) {
  renderInitialTexts(i18Instance)

  const watchedState = onChange(state, (path, value, oldValue) => {
    console.log('State изменился:', path, 'было', oldValue, 'стало', value)

    if (path === 'ui.readPostsId') {
      updatePostStyles(watchedState)
    }

    if (path === 'form.status') {
      updateFormStatus(value, i18Instance, watchedState)
    }
    if (path === 'form.valid') {
      updateInputValidity(value)
    }
    if (path === 'form.errors') {
      updateErrorDisplay(value)
    }
    if (path === 'feeds') {
      handleNewFeedAdded(value)
    }
    if (path === 'loading.status') {
      handleLoadingStatus(value, i18Instance)
    }
    if (path === 'posts') {
      handleNewPostAdded(value, watchedState)
    }
    if (path === 'ui.lng') {
      i18Instance.changeLanguage(value).then(() => {
        renderAllTexts(i18Instance)
        updateLanguageButtons(value)
      })
    }
  })

  return watchedState
}

// Остальные функции, которые используют watchedState
function updateFormStatus(value, i18n, watchedState) {
  const input = document.querySelector('#rss-url')
  const button = document.querySelector('#rss-form button')

  switch (value) {
    case 'validating':
      input.disabled = true
      button.textContent = i18n.t('ui.checkingButton')
      break
    case 'success':
      input.disabled = false
      input.value = ''
      input.focus()
      showSuccessMessage('RSS успешно загружен')
      setTimeout(() => {
        watchedState.form.status = 'filling'
      }, 100)
      break
    case 'error':
    case 'filling': // Объединенный case для одинакового поведения
      input.disabled = false
      button.textContent = i18n.t('ui.submitButton')
      break
  }
}

function handleNewPostAdded(posts, watchedState) {
  const postsContainer = document.querySelector('.posts-list')
  if (!postsContainer) {
    console.error('Не найден .posts-list контейнер')
    return
  }

  postsContainer.innerHTML = ''

  posts.forEach((post) => {
    const isRead = watchedState.ui.readPostsId.includes(post.id)
    const titleClass = isRead ? 'fw-normal' : 'fw-bold'

    const postElement = document.createElement('div')
    postElement.className = 'post-item mb-3 p-3 border rounded'
    postElement.dataset.postId = post.id

    const titleLink = document.createElement('a')
    titleLink.href = post.link
    titleLink.target = '_blank'
    titleLink.rel = 'noopener noreferrer'
    titleLink.className = `${titleClass}`
    titleLink.textContent = post.title

    const previewButton = document.createElement('button')
    previewButton.type = 'button'
    previewButton.className = 'btn btn-outline-primary btn-sm'
    previewButton.textContent = 'Просмотр'
    previewButton.dataset.postId = post.id

    const link = document.createElement('a')
    link.href = post.link
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.className = 'text-muted small d-block mt-1'
    link.textContent = post.link

    const headerContainer = document.createElement('div')
    headerContainer.className
      = 'd-flex justify-content-between align-items-center mb-2'
    headerContainer.append(titleLink, previewButton)

    postElement.append(headerContainer, link)
    postsContainer.append(postElement)
  })

  console.log(`Отрисовано постов: ${posts.length}`)
}

function handleLoadingStatus(status, i18n) {
  const button = document.querySelector('#rss-form button')
  if (!button) return

  switch (status) {
    case 'loading':
      button.disabled = true
      button.textContent = i18n.t('ui.loadingButton')
      break
    case 'succeeded':
    case 'failed':
      button.disabled = false
      button.textContent = i18n.t('ui.submitButton')
      break
  }
}

function updatePostStyles(watchedState) {
  const postElements = document.querySelectorAll('.post-item')
  postElements.forEach((postElement) => {
    const postId = postElement.dataset.postId
    const titleLink = postElement.querySelector('a[class*="fw-"]')
    if (!titleLink) return

    const isRead = watchedState.ui.readPostsId.includes(postId)

    if (isRead) {
      titleLink.classList.remove('fw-bold')
      titleLink.classList.add('fw-normal')
    }
    else {
      titleLink.classList.remove('fw-normal')
      titleLink.classList.add('fw-bold')
    }
  })
}
