import galleryItemTpl from './templates/gallery-item.hbs';
import PixabayApiService from './fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import refs from './refs';

let pixabayApi = new PixabayApiService();
let lightbox = new SimpleLightbox('.gallery a');

function createCardMarkup(images) {
  const imageMarkup = images.hits.reduce((acc, image) => {
    return (acc += galleryItemTpl(image));
  }, '');

  refs.galleryContainer.insertAdjacentHTML('beforeend', imageMarkup);
  lightbox.refresh();
}

async function onSearchFormSubmit(evt) {
  evt.preventDefault();
  refs.scrollDiv.classList.add('hidden');
  pixabayApi.query = evt.currentTarget.elements.searchQuery.value;
  pixabayApi.resetPage();
  clearGallery();

  try {
    const result = await pixabayApi.fetchImages();
    if (result.hits.length === 0 || pixabayApi.query === '') {
      throw new Error('Sorry, there are no images matching your search query. Please try again.');
    }
    showTotalHits(result.totalHits);
    createCardMarkup(result);
  } catch (Error) {
    Notify.failure(Error.message);
  }
  refs.scrollDiv.classList.remove('hidden');
}

function clearGallery() {
  refs.galleryContainer.innerHTML = '';
}

function showTotalHits(totalHits) {
  return Notify.info(`Hooray! We found ${totalHits} images.`);
}

const options = {
  rootMargin: '200px',
};

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && pixabayApi.searchString !== '') {
      pixabayApi.fetchImages().then(createCardMarkup);
    }
  });
}

let observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.scrollDiv);
refs.form.addEventListener('submit', onSearchFormSubmit);
