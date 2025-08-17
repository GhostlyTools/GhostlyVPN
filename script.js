// Make sure to include ips.js before this script in HTML
let ipList = document.getElementById('ipList');
let searchInput = document.getElementById('search');
let map = L.map('map').setView([20,0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = [];
let connectedMarker = null;

async function fetchIPData(ip){
    try {
        let resp = await fetch(https://ipapi.co/${ip}/json/);
        return await resp.json();
    } catch {
        return null;
    }
}

async function displayIPs(list){
    ipList.innerHTML = '';
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    for(const ip of list){
        let li = document.createElement('li');
        li.textContent = ip;
        li.onclick = () => connectIP(ip);
        ipList.appendChild(li);

        let data = await fetchIPData(ip);
        if(data && data.latitude && data.longitude){
            let marker = L.marker([data.latitude, data.longitude])
                          .addTo(map)
                          .bindPopup(${ip}<br>${data.country_name} - ${data.region});
            markers.push(marker);
        }
    }
}

async function connectIP(ip){
    alert(Connected to IP: ${ip});
    document.getElementById('connectBtn').style.backgroundColor = "#ff5555";
    document.getElementById('connectBtn').style.boxShadow = "0 0 20px #ff0000";

    if(connectedMarker) map.removeLayer(connectedMarker);

    let data = await fetchIPData(ip);
    if(data && data.latitude && data.longitude){
        connectedMarker = L.circle([data.latitude, data.longitude], {
            color: '#ff0000',
            fillColor: '#ff0000',
            fillOpacity: 0.5,
            radius: 50000,
            weight: 3
        }).addTo(map).bindPopup(👻 Connected: ${ip}<br>${data.country_name} - ${data.region});
        map.setView([data.latitude, data.longitude], 4);
    }
}

function autoConnect(){
    if(ghostlyIPs.length > 0){
        connectIP(ghostlyIPs[0]);
    }
}

searchInput.addEventListener('input', ()=>{
    let term = searchInput.value.trim();
    let filtered = ghostlyIPs.filter(ip => ip.includes(term));
    displayIPs(filtered);
});

// Initial load
displayIPs(ghostlyIPs);