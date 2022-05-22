const axios = require('axios');

export default class PixabayApiService {
  constructor() {
    this.KEY = '27364094-60e70b419df12f13170509f73';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.page = 1;
    this.searchString = '';
  }

  async fetchImages() {
    const searchParams = new URLSearchParams({
      key: this.KEY,
      q: this.searchString,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page: this.page,
    });
    const response = await axios.get(`${this.BASE_URL}?${searchParams}`);
    this.incrementPage();
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchString;
  }

  set query(newQuery) {
    this.searchString = newQuery;
  }
}
