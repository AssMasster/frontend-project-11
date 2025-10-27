import axios from 'axios'

export function getRss(rssUrl) {
  const encodedUrl = encodeURIComponent(rssUrl)
  const urlSpecial = `https://allorigins.hexlet.app/get?url=${encodedUrl}&disableCache=true`

  return axios({
    method: 'get',
    url: urlSpecial,
    timeout: 10000,
  })
    .then(function (response) {
      console.log('Полный ответ от All Origins:', response.data)

      if (response.data && response.data.contents) {
        return response.data.contents
      } else {
        console.error('Неожиданная структура ответа:', response.data)
        throw new Error('Invalid response format from All Origins')
      }
    })
    .catch((error) => {
      console.error('Ошибка загрузки RSS:', error)
      if (error.response) {
        throw new Error(`Server error: ${error.response.status}`)
      } else if (error.request) {
        throw new Error('Network error: No response from server')
      } else {
        throw new Error(`Request error: ${error.message}`)
      }
    })
}
