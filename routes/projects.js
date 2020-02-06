const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

module.exports = (pool) => {
    router.get('/', (req, res, next) => {
            let getProjectData = `SELECT DISTINCT projects.projectid, projects.name, string_agg(users.firstname || ' ' || users.lastname, ', ') as membersname FROM projects LEFT JOIN members ON members.projectid = projects.projectid
            LEFT JOIN users ON users.userid = members.userid GROUP BY projects.projectid;`

            pool.query(getProjectData, (err, projectData) => {
                res.render('projects/dashboard', result = {
                    projects: projectData.rows
                });
            })
    });
    

    router.get('/add', (req, res, next) => {
        let getMembers = `SELECT userid, concat(firstname,' ',lastname) as fullname FROM users`
        pool.query(getMembers, (err, member) => {
            res.render('projects/add', result = {
                members: member.rows
            });
        })
    })

    router.get('/edit/:id', (req, res, next) => {
        if(err) return console.error(err);
        let getDataProject = 'SELECT name FROM projects WHERE id = $1'
        

    })

    router.post('/add', (req, res, next) => {
        let insertQuery = 'with new_project as ( INSERT INTO projects(name) VALUES($1) returning projectid ) INSERT INTO members(userid, projectid) VALUES ($2, (select projectid from new_project))';
        let body = [];
        if (req.body.members == undefined) {
            body = [req.body.name]
            insertQuery = `with new_project as ( INSERT INTO projects(name) VALUES($1) returning projectid ) INSERT INTO members(projectid) VALUES ((select projectid from new_project))`
        } else if (typeof req.body.members == 'string') {
            body = [req.body.name, req.body.members]
        } else if (typeof req.body.members == 'object') {
            let dataLength = req.body.members.length + 2;
            for (let i = 3; i < dataLength; i++) {
                insertQuery += `,($${i}, (select projectid from new_project))`;
                body = [req.body.name, ...req.body.members];
            }
        }
        pool.query(insertQuery, body, (err) => {
            if (err) return console.error(err);
            res.redirect('/projects/add');
        })
    })

    return router;
}