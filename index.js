//DEPENDENCIES
const cors = require('cors');
const express =require('express');
const helmet = require('helmet');
const logger = require('morgan');

//IMPORTS FROM HELPERS
const actionModel = "./helpers/actionModel.js";
const projectModel = "./helpers/projectModel.js";

//PORT 
const port = 5000;

//SERVER INITIATED
const server = express();

//GLOBAL MIDDLEWARES
server.use(cors());
server.use(express.json());
server.use(helmet());
server.use(logger('combined'));

//PROJECT MODEL ROUTES

//ACTION MODEL ROUTES

//PORT LISTENER
server.listen(port, () => {
    console.log(`=== API LISTENING TO PORT ${port} ===`)
});
