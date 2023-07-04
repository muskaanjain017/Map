let userIP="";
function getUserIP(callback) {
    // Using a third-party service to get the IP address
    return new Promise((resolve, reject) => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        const ipAddress = data.ip;
        callback(ipAddress);
        resolve(data.ip);
      }).catch(error => reject(error));
  });
}
  
  
  getUserIP(ip => {
    console.log('User IP:', ip);
    
    userIP = ip;
    document.getElementById("IP").innerHTML = userIP;
  }).catch(error => {
    console.log("Error:", error);
  });


  const button = document.getElementById('getInfoButton');
  
  button.addEventListener('click', () => {
    var x = document.getElementById("Main");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    
    
    fetch(`https://ipinfo.io/${userIP}?token=5593383b4b7c46`)
    .then(response => {
        if (!response.ok) {
          throw new Error("Unable to fetch data.");
        }
        return response.json();
      })
      .then(data => {
        console.log('Location Information:', data);
       
        const { loc } = data;
        const [latitude, longitude] = loc.split(',');

        document.getElementById("lat").innerHTML = latitude;
        document.getElementById("long").innerHTML = longitude;
        document.getElementById("city").innerHTML = data.city;
        document.getElementById("region").innerHTML = data.region;
        document.getElementById("organization").innerHTML = data.org;
        document.getElementById("hostname").innerHTML = data.country;

        
        showUserLocationOnMap(latitude, longitude);
        
        const { timezone } = data;
        getCurrentTimeByTimezone(timezone);
        
        const { postal } = data;
        getPostOfficesByPincode(postal);

        document.getElementById("timezone").innerHTML = timezone;
        document.getElementById("pincode").innerHTML = postal;
        
      }).catch(error => {
        console.log("Error:", error);
      });
  });

  function showUserLocationOnMap(latitude, longitude) {
    const mapDiv = document.getElementById('map');
    
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`;
    
    mapDiv.innerHTML = `<iframe src="${mapUrl}" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen></iframe>`;
  }

  function getCurrentTimeByTimezone(timezone) {
    
    const currentTime = new Date();
    
    const userTime = currentTime.toLocaleString("en-US", {timeZone:timezone});
    console.log('User Time:', userTime);
    document.getElementById("datetime").innerHTML = userTime;
  }

  function getPostOfficesByPincode(pincode) {
    return new Promise((resolve, reject) => {
    
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then(response => response.json())
      .then(data => {
        console.log('Post Offices:', data);
        displayPostOffices(data[0].PostOffice);
        
        document.getElementById("countPin").innerHTML = data[0].PostOffice.length;
        const searchBox = document.getElementById('searchBox');
        searchBox.addEventListener('input', () => {
          const searchTerm = searchBox.value.toLowerCase();
          const filteredPostOffices = data[0].PostOffice.filter(postOffice => {
            const name = postOffice.Name.toLowerCase();
            const branch = postOffice.BranchType.toLowerCase();
            return name.includes(searchTerm) || branch.includes(searchTerm);
          });
          displayPostOffices(filteredPostOffices);
          
          
        });
        resolve(data[0].PostOffice);
      })
      .catch(error => reject(error));
  });
}


function displayPostOffices(postOffices) {
    const postOfficeList = document.getElementById('postOfficeList');
    postOfficeList.innerHTML = '';
    
    postOffices.forEach((postOffice) => {
      const divPostOffice = document.createElement('div');
      divPostOffice.classList.add("postoffice");
      let name = `<p>Name : ${postOffice.Name}</p>`;
      let branchType = `<p>Branch Type : ${postOffice.BranchType}</p>`;
      let deliveryStatus =`<p>Delivery Status : ${postOffice.DeliveryStatus}</p>`;
      let district=`<p>District : ${postOffice.District}</p>`;
      let division=`<p>Division : ${postOffice.Division}</p>`;
      divPostOffice.innerHTML = name+branchType+deliveryStatus+district+division;
      postOfficeList.appendChild(divPostOffice);
    });
  }
