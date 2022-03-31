const express = require("express");
const port = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Listening on port ${port}`);
    }
});
