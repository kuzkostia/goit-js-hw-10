import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const searchBox = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInformation = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(search, DEBOUNCE_DELAY));

function search(event) {
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
  countriesList.innerHTML = '';
  countryInformation.innerHTML = '';
}

function renderCountryList(countries) {
  const markup = countries
    .map(
      country =>
        `<li><img src="${country.flags.svg}" alt="${country.name.official} flag"><p>${country.name.official}</p> </li>`
    )
    .join('');

  countriesList.innerHTML = markup;
  countryInformation.innerHTML = '';
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

  countryInformation.innerHTML = markup;
  countriesList.innerHTML = '';
}
