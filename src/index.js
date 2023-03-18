import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  const searchQuery = event.target.value.trim();
  if (!searchQuery || searchQuery === '') {
    clearMarkup();
    return;
  }
  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (countries.length > 1 && countries.length <= 10) {
        renderCountryList(countries);
        return;
      }

      if (countries.length === 1) {
        renderCountryInfo(countries[0]);
        return;
      }
    })
    .catch(error => {
      clearMarkup();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountryList(countries) {
  const markup = countries
    .map(
      country =>
        `<li><img src="${country.flags.svg}" alt="${country.name.official} flag"><p>${country.name.official}</p> </li>`
    )
    .join('');

  countryList.innerHTML = markup;
  countryInfo.innerHTML = '';
}

function renderCountryInfo(country) {
  const languages = Object.values(country.languages)
    .map(el => el)
    .join(', ');

  const markup = `<div class="wrap">
    <img src="${country.flags.svg}" alt="${country.name.official} flag">
    <h1>${country.name.official}</h1></div>
    <p><strong>Capital:</strong> ${country.capital}</p>
    <p><strong>Population:</strong> ${country.population}</p>
    <p><strong>Languages:</strong> ${languages}</p>
    `;

  countryInfo.innerHTML = markup;
  countryList.innerHTML = '';
}
