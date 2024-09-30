const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const mongoose = require('mongoose');
const User = require("./models/users.js");
const Booking = require("./models/booking.js");
const Admin = require("./models/Admin.js");

const app = express();
const server = http.createServer(app); // Creating server for socket
const io = socketio(server);

main().then(() => {
    console.log("Connected to Database sahara");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/sahara');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// ---Socket.IO Connection---
io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    // --- GPS Tracking Logic ---
    socket.on("send-location", function(data) {
        // Emit the GPS location data to all connected clients
        io.emit("receive-location", {
            id: socket.id,
            type: data.type,
            ...data
        });
    });

    // --- Emit and Receive Driver Details ---
    socket.on("sendDetails", (data) => {
        console.log('Received driver details:', data);
        io.emit("receiveDetails", data); // Broadcast the driver details to all clients
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
        console.log("A client disconnected:", socket.id);
        io.emit("user-disconnected", socket.id);
    });
    
    socket.on('sendDetails', (data) => {
        // Save data to database or handle the details
        console.log('Details received: ', data);
    
        // Emit an event to acknowledge the data saving
        socket.emit('detailsSaved');
    });
    
});


// --- Routes ---

// Home Route
app.get("/sahara/home", async (req, res) => {
    res.render("index.ejs");
});

// Login Route
app.get("/sahara/login", (req, res) => {
    res.render("login.ejs");
});
app.post("/sahara/login",(req,res)=>{
    res.redirect("/sahara");
})
app.get("/sahara",(req,res)=>{
    res.render("home.ejs");
})

// Signup Route
app.get("/sahara/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/sahara/signup", async (req, res) => {
    let { username, email, password } = req.body;
    const newUser = new User({
        username: username,
        email: email,
        password: password
    });
    await newUser.save();
    console.log("User registered Successfully!");
    res.redirect("/sahara");
});

// Booking Confirmation Route
app.get("/sahara/booking/:userId/:driverId", async (req, res) => {
    let { userId, driverId } = req.params;
    let driver = await Admin.findById(driverId);
    let user = await Booking.findById(userId);

    if (driver && user) {
        // Emit the driver and booking details to the frontend via Socket.IO
        io.emit("receiveDetails", {
            driverName: driver.driverName,
            driverPhone: driver.driverPhone,
            ambulanceNumber: driver.ambulanceNumber,
            vehicleType: driver.vehicleType,
            organisation: driver.organisation,
            email: driver.email
        });

        res.render("confirmBooking.ejs", { user, driver });
    } else {
        console.log("Driver or User not found");
        res.redirect("/sahara/home");
    }
});

app.post("/sahara/booking/:userId/:driverId", (req, res) => {
    res.redirect("/sahara/home");
});

// Booking Route
app.get("/sahara/booking", (req, res) => {
    res.render("booking.ejs");
});

app.post("/sahara/booking", async (req, res) => {
    let { name, phoneNumber, address, emergencyType, additionalDetails } = req.body;
    const newBooking = new Booking({
        name: name,
        phoneNumber: phoneNumber,
        address: address,
        emergencyType: emergencyType,
        additionalDetails: additionalDetails
    });
    await newBooking.save();
    console.log("Booking Confirmed");
    res.redirect("/sahara/home");
});

// Admin Routes
app.get("/sahara/admin", (req, res) => {
    res.render("adminLogin.ejs");
});

app.get("/sahara/admin/home/:id", async (req, res) => {
    let { id } = req.params;
    let driver = await Admin.findOne({ _id: id });

    if (driver) {
        const users = await Booking.find({});
        res.render("adminHome.ejs", { users, driver });
    } else {
        console.log("Driver does not exist");
    }
});

app.post("/sahara/admin/home/:id", async (req, res) => {
    res.redirect("/sahara/home");
});

app.get("/sahara/adminRegistration", (req, res) => {
    res.render("adminRegistration.ejs");
});

app.post("/sahara/adminRegistration", async (req, res) => {
    const { driverName, driverPhone, ambulanceNumber, vehicleType, organisation, email, password } = req.body;

    const newAmbulance = new Admin({
        driverName: driverName,
        driverPhone: driverPhone,
        ambulanceNumber: ambulanceNumber,
        vehicleType: vehicleType,
        organisation: organisation,
        email: email,
        password: password
    });
    await newAmbulance.save();

    let driver = await Admin.findOne({ driverPhone: driverPhone });
    if (driver) {
        res.redirect(`/sahara/admin/home/${driver._id}`);
    } else {
        console.log("Driver does not exist");
    }
});

// Start the server
server.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
