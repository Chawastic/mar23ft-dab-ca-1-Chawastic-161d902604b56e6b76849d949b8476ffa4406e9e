function adoptAnimal(animalId) {
    fetch(`/animals/adopt/${animalId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Adoption successful!');
        } else {
          alert('Adoption failed. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error adopting animal:', error);
      });
  }
  

  function deleteAnimal(animalId) {
    fetch(`/animals/cancelAdoption/${animalId}`, {
      method: 'POST',
    })
      .then(response => response.text())
      .then(message => {
        console.log(message);
      })
      .catch(error => {
        console.error('Error canceling adoption:', error);
      });
  }
  

function updateSpecies(id){
    newSpecies = prompt("Update species")

}

function deleteSpecies(id){
}

function updateTemperament(id){
    newTemperament = prompt("Update temperament")
}

function deleteTemperament(id){
}