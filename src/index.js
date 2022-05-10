const express = require("express");
const webpush = require("web-push");
const path = require("path");
const fs = require('fs-extra')

const init = !fs.existsSync('config.json')
if(init) {
    const vapidKeys = webpush.generateVAPIDKeys()
    fs.outputJSONSync('config.json', vapidKeys)
}

const rvapidKeys = fs.readJSONSync('config.json')

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, "../client")));

app.use(express.json());

const publicVapidKey = rvapidKeys.publicKey
const privateVapidKey = rvapidKeys.privateKey

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

app.get('/k', (req,res) => {
    res.status(200).json({publicVapidKey})
})

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: "Push Notifications Using Node", body: `Alert: ${new Date().toLocaleString()}` });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));