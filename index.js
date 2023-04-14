const searchForm = document.getElementById("property-search")
const propertyList = document.getElementById("propeertyList")
const priceInput = document.getElementById("price")
const priceOutput = document.getElementById("price-output")

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(searchForm);
  const location = formData.get('location');
  const price = formData.get('price');
  const buyOrRent = formData.get('buy')|| formData.get('rent');

  fetch(' http://localhost:3000/locations')
  .then(resp => resp.json())
  .then(locations => {

  const filteredLocations = locations.filter(locationObj => { 
  if (location !== 'all locations' && locationObj.name !== location){
     return false;
  }
  for (let i=0; i<locationObj.houses.length; i++){
    const house = locationObj.houses [i];
    const housePrice = parseInt(house.price.replace(/[^\d]/g,''))
    if (housePrice > price){
      return false;
    }
    if (buyOrRent === 'buy' && house.type.includes('rental')){
      return false;
    }
    if (rent === 'rent' && house.type.includes('sell')) {
      return false;
    }
  }
  return true;
});

filteredLocations.forEach(locationObj => {
   const locationName = locationObj.name;
   locationObj.houses.forEach(house => {
    const div = document.createElement('div');
    div.textContent = `${locationName}: ${house.type}-${house.price}`; 
    propertyList.appendChild(div);
   });
});
  })
  .catch(error => {
    console.error(error);
  });
});
priceInput.addEventListener('input', () => {
  priceOutput.textContent= `${priceInput.value}`;
});