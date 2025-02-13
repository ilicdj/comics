import axios from 'axios'


// const apiCallURL = `https://my-json-server.typicode.com/ilicdj/api-test/comics/${props.id}`

const apiClient = axios.create({
  baseURL: 'https://my-json-server.typicode.com/ilicdj/api-test',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getComics() {
    return apiClient.get('/comics')
  },
  getComic(id) {
    return apiClient.get('/comics/' + id)
  }
}
