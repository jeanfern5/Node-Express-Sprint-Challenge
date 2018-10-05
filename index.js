//DEPENDENCIES
const cors = require('cors');
const express =require('express');
const helmet = require('helmet');
const logger = require('morgan');

//IMPORTS FROM HELPERS
const actionDb = require("./data/helpers/actionModel.js");
const projectDb = require("./data/helpers/projectModel.js");

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
    //GET ENDPOINT
    server.get('/api/projects', (req, res) => {
        projectDb
            .get()
            .then(projects => {
                res.status(200).json(projects)
            })
            .catch(() => {
                res.status(500).json({error: 'Could Not Retrieve Projects'})
            })
    });

    server.get('/api/projects/:id', (req, res) => {
        const {id} = req.params
        if (id) {
            projectDb
                .get(id)
                .then(gotId => {
                    res.status(200).json(gotId)
                })
                .catch(() => {
                    res.status(500).json({error: `Could Not Retrieve Project at Id ${id}`})
                })
        } else {
            res.status(404).json({error: `There is Not Project with Id ${id}`})
        }
    });

    //POST ENDPOINT
    server.post('/api/projects', (req, res) => {
        const {name, description, completed} = req.body;
        // const {newProject} = {name, description, completed}; --- ?newProject comes out as undefined, need to find out why?
        // console.log("**********", {name, description, completed}, "-----", req.body)
        if (!name.substr(1, 128)) {
            res.status(400).json({error: 'Need to Provide a Name Less than 128 Characters'})
        } else if (!description) {
            res.status(400).json({error: 'Need to Provide a Description'})
        }
        // else if (!completed) {
        //     res.status(400).json({error: 'Need to Provide if Completed is true or false'})
        // }
        else {
            projectDb
                .insert({name, description, completed})
                .then(newProject => {
                    res.status(200).json(newProject)
                })
                .catch(() => {
                    res.status(500).json({error: `Could Not Add New Project`})
                })
        }
    });

    //DELETE ENDPOINT
    server.delete('/api/projects/:id', (req,res) => {
        const {id} = req.params
        projectDb
            .remove(id)
            .then(isRemoved => {
                if (!isRemoved){
                    res.status(404).json({error: `Project Has Already been Removed or Did Not Exist`})
                }else{
                    res.status(200).json(isRemoved)
                }
            })
            .catch(() => {
                res.status(500).json({error: `Could Not Delete Project with Id ${id}`})
            })
    });

    //PUT ENDPOINT
    server.put('/api/projects/:id', (req, res) => {
        const {id} = req.params;
        const {name, description, completed} = req.body;
        // const {updatedProject} = {name, description, completed}; --- ?Same as Post updatedProject comes out as undefined?
        // console.log('*****', id, '-----',{name, description, completed}, '=====', updatedProject )
        projectDb
            .update(id, {name, description, completed})
            .then(isUpdated => {
                if (!isUpdated) {
                    res.status(400).json({error: `Project at ${id} was Not able to be Updated`})
                }else {
                    res.status(200).json(isUpdated)
                }
            })
            .catch(() => {
                res.status(500).json({error: `Could Not Update Project with Id ${id}`})
            })
    });

//ACTION MODEL ROUTES
    //GET ENDPOINT
    server.get('/api/actions', (req, res) => {
        actionDb
            .get()
            .then(actions => {
                res.status(200).json(actions)
            })
            .catch(() => {
                res.status(500).json({error: `Could Not Retrieve Actions`})
            })
    });

    server.get('/api/actions/:id', (req, res) => {
        const {id} = req.params
        projectDb
            .getProjectActions(id)
            .then(projectActions => {
                if (!projectActions) {
                    res.status(404).json({error: `There is No Project Actions with the Id ${id}`})
                }else {
                    res.status(200).json(projectActions)
                }
            })
            .catch(() => {
                res.status(500).json({error: `Could Not Retrieve Actions from Id ${id}`})
            })
    });

    //POST ENDPOINT
    server.post('/api/actions',(req, res) => {
        const {project_id, description, notes, completed} = req.body;
        if (!project_id) {
            res.status(400).json({error: `Need to Provide Project Id`})
        } else if (!description.substr(1,128)) {
            res.status(400).json({error: `Need to Provide Description Less than 128 Characters`})
        }else if (!notes) {
            res.status(400).json({error: `Need to Provide Notes`})
        }
        // else if (!completed) {
        //     res.status(400).json({error: `Need to Provide if Completed is true or false`})
        // }
        else {
            actionDb
            .insert({project_id, description, notes, completed})
            .then(newAction => {
                res.status(200).json(newAction)
            })
            .catch(() => {
                res.status(500).json({error: `Could Not Add New Action`})
            })
        }
    });

    //DELETE ENDPOINT
    server.delete('/api/actions/:id', (req, res) => {
        const {id} = req.params
        actionDb
            .remove(id)
            .then(isRemoved => {
                res.status(500).json(isRemoved)
            })
            .catch(() => {
                res.status(500).json({error: `Could Not Delete Action at Id ${id}`})
            })
    });

    //PUT ENDPOINT
    server.put('/api/actions/:id', (req, res) => {
        const {id} = req.params;
        const {project_id, description, notes, completed} = req.body;
        actionDb
            .update(id, {project_id, description, notes, completed})
            .then(isUpdated => {
                res.status(200).json(isUpdated)
            })
            .catch(() => {
                res.status(500).json({error: `Could Not Update Action at Id ${id}`})
            })
    });

//PORT LISTENER
server.listen(port, () => {
    console.log(`=== API LISTENING TO PORT ${port} ===`)
});
