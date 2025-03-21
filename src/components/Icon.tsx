import L from 'leaflet';
import cafe from '../assets/images/cafeIcon.png';

const userMarkerStyle = `
  background-color: #E50000;
  width: 3rem;
  height: 3rem;
  display: block;
  left: -1.5rem;
  top: -1.5rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

const cafeIcon = new L.Icon({
    iconUrl: cafe,
    iconRetinaUrl: cafe,
    iconAnchor: undefined,
    popupAnchor: undefined,
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined,
    iconSize: new L.Point(30, 25),
    className: 'leaflet-div-icon'
});

// const userIcon = new L.Icon({
//     iconAnchor: [0, 24],
//     labelAnchor: [-6, 0],
//     popupAnchor: [0, -36],
//     html: `<span style="${userMarkerStyle}" />`
// });

export { cafeIcon };