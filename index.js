const searchForm = document.querySelector('#property-search');
const propertyList = document.querySelector('#propertyList');
const priceInput = document.querySelector('#price');
const priceOutput = document.querySelector('#price-output');
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(searchForm);
  const location = formData.get('location');
  const price = formData.get('price');
  const buyOrRent = formData.get('buy') || formData.get('rent');
  fetch(`http://localhost:3000/locations`)
    .then(response => response.json())
    .then(locations => {
      const filteredLocations = locations.filter(locationObj => {
        if (location !== 'All locations' && locationObj.name !== location) {
          return false;
        }
        for (let i = 0; i < locationObj.houses.length; i++) {
          const house = locationObj.houses[i];
          const housePrice = typeof house.price === 'string' ? parseInt(house.price.replace(/[^\d]/g,'')) : house.price;
          if (housePrice > price) {
            return false;
          }
          if (buyOrRent === 'buy' && house.type.includes('rental')) {
            return false;
          }
          if (buyOrRent === 'rent' && house.type.includes('sale')) {
            return false;
          }
        }
        return true;
      });
      // Clear the property list
      propertyList.innerHTML = '';
      filteredLocations.forEach(locationObj => {
        const locationName = locationObj.name;
        locationObj.houses.forEach(house => {
          const div = document.createElement('div');
          div.textContent = `${locationName}: ${house.type} - ${house.price}`;
          propertyList.appendChild(div);
        });
      });
    })
    .catch(error => {
      console.error(error);
    });
});
priceInput.addEventListener('input', () => {
  // Update the price output element with the new value
  priceOutput.textContent = `${priceInput.value}`;
});