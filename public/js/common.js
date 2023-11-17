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

function sortAnimalsByName() {
    $.ajax({
      url: '/animals/popularNames',
      method: 'GET',
      success: function (data) {
        var animalContainer = $('.list-group');
        animalContainer.replaceWith($(data).find('.list-group'));
      },
      error: function (error) {
        console.error('Error sorting animals by name:', error);
      }
    });
  }
  

  function showAdoptedAnimals() {
    $.ajax({
      url: '/animals/adoptedAnimals',
      method: 'GET',
      success: function (data) {
        var listGroup = $('.list-group');
        listGroup.html($(data).find('.list-group').html());
      },
      error: function (error) {
        console.error('Error fetching adopted animals:', error);
      }
    });
  }


  function showAnimalsByAge() {
    $.ajax({
      url: '/animals/animalsByAge',
      method: 'GET',
      success: function (data) {
        var listGroup = $('.list-group');
        listGroup.html($(data).find('.list-group').html());
      },
      error: function (error) {
        console.error('Error fetching animals by age:', error);
      }
    });
  }

  function showAnimalsByDateRange() {
    const startDate = prompt('Enter start date (YYYY-MM-DD):');
    const endDate = prompt('Enter end date (YYYY-MM-DD):');
  
    $.ajax({
      url: '/animals/animalsByDateRange',
      method: 'POST',
      data: { startDate, endDate },
      success: function (data) {
        var listGroup = $('.list-group');
        listGroup.html($(data).find('.list-group').html());
      },
      error: function (error) {
        console.error('Error fetching animals by date range:', error);
      }
    });
  }

  function showAnimalsPerSize() {
    $.ajax({
      url: '/animals/animalsPerSize',
      method: 'GET',
      success: function (data) {
        const resultString = data.map(item => `${item.size}: ${item.count}`).join('\n');
        alert('Number of Animals Per Size:\n\n' + resultString);
      },
      error: function (error) {
        console.error('Error fetching animals per size:', error);
      }
    });
  }

  function allAnimals() {
    window.location.href = '/animals';
  }