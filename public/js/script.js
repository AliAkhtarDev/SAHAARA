const socket = io(); //socket io initialization to send a request in the backend

if(navigator.geolocation) { //check if gelocation supports in browser

    navigator.geolocation.watchPosition( // watch location to track user location continously
        (position)=>{
        const {latitude,longitude} = position.coords; //extracting the coordinates of the position
        socket.emit("send-location",{latitude,longitude});  // emit the latitude and longitude via a socket with "send-location". Log any errors to the console

    },
    
    (error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy:true, // ik daam pinpoint location dekhnai kai leye
        timeout:5000 ,//matlab 5 sec tk coordinates mnaiga phir naya corordinates lega even though humlog whi location m hai
        maximumAge:0,  // no cashing rhaiga i.e koi bhi location phlai s save nhi krke rkhainge
        
    }                 
       
                    

);

}


const map = L.map("map").setView([0,0],10) //initialize a map centered at coordinates(0,0) with a zoom level of 10

//OpenStreetMap tiles -world ka screen issai aata hai

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};

//when receiving location data via the socket, extract id, latitude,and longitude, and center the map on the new coordinations

//if a marker for the id exists,update its position,otherwise , create a new marker at the given coordinates and add it to the map. When a user disconnects, remove their marker from the map and delete it from markers.




socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} = data ;
    map.setView([latitude,longitude],15);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);

    }else{
        markers[id] = L.marker([latitude,longitude])
         
        .addTo(map);
    }
});
socket.on("user-disconnected",(id)=>{
    console.log("user-disconnected",id);
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});


        // Listen for driver details
        socket.on("receiveDetails", (data) => {
            const { name, phone, vehicleNumber, vehicleType, organisation, email } = data;

            // Display driver details
            const messageDiv = document.querySelector('.container');
            messageDiv.innerHTML = `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Driver Details</h5>
                        <p class="card-text"> ${name}</p>
                        <p class="card-text"> ${phone}</p>
                        <p class="card-text"> ${vehicleNumber}</p>
                        <p class="card-text"> ${vehicleType}</p>
                        <p class="card-text">${organisation}</p>
                        <p class="card-text"> ${email}</p>
                    </div>
                </div>
            `;
        });