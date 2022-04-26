// On s'assure que la page est chargée
window.onload = function(){
  let coordonnees = {
    latitude: document.getElementById('mapContainer').dataset.latitude,
    longitude: document.getElementById('mapContainer').dataset.longitude
  }
  console.log(coordonnees);
  // On initialise la carte sur les coordonnées GPS ([Latitude, longitude], zoom par defaut)
  let macarte = L.map('mapContainer').setView([coordonnees.latitude, coordonnees.longitude], 13)

  // On charge les tuiles depuis un serveur au choix, ici OpenStreetMap France
  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
      minZoom: 1,
      maxZoom: 20
  }).addTo(macarte)

  // creation de l'incone marqueur
var greenIcon = L.icon({
  iconUrl: 'http://localhost:8024/assets/img/leaf-green.png',
  shadowUrl: 'http://localhost:8024/assets/img/leaf-shadow.png',
  iconSize:     [38, 95], // size of the icon
  shadowSize:   [50, 64], // size of the shadow
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor:  [-3, -90] // point from which the popup should open relative to the iconAnchor
});

  // marqueur et pop up
  L.marker([coordonnees.latitude, coordonnees.longitude], {icon: greenIcon}).addTo(macarte)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();
}

//----------------------------------------------------------------------------------------
function distance(lat1, lon1, lat2, lon2, unit){
	if((lat1 == lat2) && (lon1 == lon2)){
		return 0;
	}else{
		let radlat1 = Math.PI * lat1/180;
		let radlat2 = Math.PI * lat2/180;
		let theta = lon1-lon2;
		let radtheta = Math.PI * theta/180;
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if(dist > 1){
		  dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
	if(unit=="K") { dist = dist * 1.609344 }
	if(unit=="N") { dist = dist * 0.8684 }
	  return dist; 
	}
}
distance(43.282928, 5.606789, 43.283329, 5.56667, "K");

/*
distance(start_lat, start_lng, spot_lat, spot_lng, 'K'); // en kilometre
distance(start_lat, start_lng, spot_lat, spot_lng, 'M');// en miles
distance(start_lat, start_lng, spot_lat, spot_lng, 'N'); // en nautic

document.write("Calcul la distance entre deux points (ri7)-(Maison): " +distance(43.282928, 5.606789, 43.283329, 5.56667,"K")+" Km <BR>");
document.write("Calcul la distance entre deux points (ri7)-(aix): "+distance(43.282928, 5.606789, 43.533329, 5.43333, "K")+" Km <BR>");
document.write("Calcul la distance entre deux points (maison)-(eguilles): "+distance(43.283329, 5.56667, 43.5682983398, 5.35416984558, "K")+" Km <BR>");
*/