    var api = "https://gateway.holdstation.com/services/launchpad/api/staking/wallets?list=";
    var fetchInProgress = false;

    // Load watchlist from localStorage
    var watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    document.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
    });

    function returnText() {
      if (fetchInProgress) {
        // If fetch is in progress, ignore the click
        return;
      }

      var input = document.getElementById("Input").value;
      var inputArray = input.split(",");

      var resultTable = document.getElementById("result");

      // Clear existing table content
      resultTable.innerHTML = "";

      var headerRow = document.createElement("tr");

      var addressHeader = document.createElement("th");
      addressHeader.textContent = "Address";
      headerRow.appendChild(addressHeader);

      var pendingRewardHeader = document.createElement("th");
      pendingRewardHeader.textContent = "Pending Reward";
      headerRow.appendChild(pendingRewardHeader);

      var harvestedRewardHeader = document.createElement("th");
      harvestedRewardHeader.textContent = "Harvested Reward";
      headerRow.appendChild(harvestedRewardHeader);

      resultTable.appendChild(headerRow);

      fetchInProgress = true;

      function processAddress(address) {
        var api_address = api + address;
        fetch(api_address)
          .then(response => response.json())
          .then(data => {
            if (data.length > 0) {
              var dataRow = document.createElement("tr");

              var addressCell = document.createElement("td");
              addressCell.textContent = data[0].address;
              dataRow.appendChild(addressCell);

              var pendingRewardCell = document.createElement("td");
              pendingRewardCell.textContent = data[0].pendingReward;
              dataRow.appendChild(pendingRewardCell);

              var harvestedRewardCell = document.createElement("td");
              harvestedRewardCell.textContent = data[0].harvestedReward;
              dataRow.appendChild(harvestedRewardCell);

              resultTable.appendChild(dataRow);
            } else {
              alert(`No data found for address: ${address}`);
            }

            fetchInProgress = false;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            fetchInProgress = false;
          });
      }

      // Process each address in sequence
      for (let address of inputArray) {
        processAddress(address.trim());
      }
    }

    function addToWatchlist() {
      var input = document.getElementById("Input").value.trim();
      if (input !== '' && !watchlist.includes(input)) {
        watchlist.push(input);
        updateWatchlist();
        saveWatchlistToLocalStorage();
      }
    }

    function removeFromWatchlist(address) {
      watchlist = watchlist.filter(item => item !== address);
      updateWatchlist();
      saveWatchlistToLocalStorage();
    }

    function updateWatchlist() {
      var watchlistItems = document.getElementById("watchlistItems");
      watchlistItems.innerHTML = ""; // Clear existing watchlist items

      watchlist.forEach(function (address) {
        var listItem = document.createElement("li");
        listItem.textContent = address;

        var deleteButton = document.createElement("button");
        deleteButton.classList ='delete'
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
          removeFromWatchlist(address);
        };

        listItem.appendChild(deleteButton);
        watchlistItems.appendChild(listItem);
      });
    }

    function saveWatchlistToLocalStorage() {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }

    // Initial load of watchlist
    updateWatchlist();