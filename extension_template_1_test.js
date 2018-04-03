// Import ##title##
var extension = require('./##filename##');

// Manufacture an event payload here for extensions that occur BLR/ALR
var payload = {
  page_title: "A Page"
};

// Pick an event type
var event_type = "view";

// Dummy up a window object
var window = {
  location: {}
};

// Execute the extension against the event type and payload
var result = extension(event_type, payload);

// Add some tests..
if(payload.page_title == "A Page"){
  console.log("Page title unchanged");
} else {
  console.log("Page title updated");
}