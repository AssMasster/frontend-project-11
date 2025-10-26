import axios from 'axios'

export function getRss(rssUrl) {
  const encodedUrl = encodeURIComponent(rssUrl)
  const urlSpecial = `https://allorigins.hexlet.app/get?url=${encodedUrl}&disableCache=true`

  return axios({
    method: 'get',
    url: urlSpecial,
  })
    .then(function (response) {
      return response.data.contents
    })
    .catch((error) => {
      throw new Error(error)
    })
}
