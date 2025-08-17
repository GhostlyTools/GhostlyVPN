let ipList = document.getElementById('ipList');
let searchInput = document.getElementById('search');
let map = L.map('map').setView([20,0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = [];

function displayIPs(list){
    ipList.innerHTML = '';
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    list.forEach(ip => {
        let li = document.createElement('li');
        li.textContent = ip;
        li.onclick = () => connectIP(ip);
        ipList.appendChild(li);

        fetch(https://ipapi.co/${ip}/json/)
            .then(resp => resp.json())
            .then(data => {
                if(data.latitude && data.longitude){
                    let marker = L.marker([data.latitude, data.longitude]).addTo(map)
                        .bindPopup(${ip}<br>${data.country_name} - ${data.region});
                    markers.push(marker);
                }
            }).catch(()=>{});
    });
}

function connectIP(ip){
    alert(Connected to IP: ${ip});
    document.getElementById('connectBtn').style.backgroundColor = "#ff5555";
}

function autoConnect(){
    if(ghostlyIPs.length > 0){
        connectIP(ghostlyIPs[0]);
    }
}

function filterByCountry(country){
    let filtered = [];
    ghostlyIPs.forEach(ip => {
        fetch(https://ipapi.co/${ip}/json/)
            .then(resp => resp.json())
            .then(data => {
                if(data.country_name === country){
                    filtered.push(ip);
                }
                displayIPs(filtered);
            }).catch(()=>{});
    });
}

searchInput.addEventListener('input', ()=>{
    let term = searchInput.value.trim();
    let filtered = ghostlyIPs.filter(ip => ip.includes(term));
    displayIPs(filtered);
});

displayIPs(ghostlyIPs);