const express = require('express');
const app = express();
const PORT = process.env.PORT || 3300;



//Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
