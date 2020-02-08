const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const helpers = require('../helpers/util')

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

module.exports = (pool) => {
    router.get('/', (req, res, next) => {
        let getProjectData = `SELECT DISTINCT projects.projectid, projects.name, string_agg(users.firstname || ' ' || users.lastname, ', ') as membersname FROM projects LEFT JOIN members ON members.projectid = projects.projectid
            LEFT JOIN users ON users.userid = members.userid GROUP BY projects.projectid;`

        pool.query(getProjectData, (err, projectData) => {
            if (err) throw err;
            res.render('projects/dashboard', result = {
                projects: projectData.rows
            });
        })
    });


    router.get('/add', (req, res, next) => {projects
        let getMembers = `SELECT userid, concat(firstname,' ',lastname) as fullname FROM users WHERE isactive = true`
        pool.query(getMembers, (err, member) => {
            res.render('projects/add', result = {
                members: member.rows
            });
        })
    })

    router.get('/edit/:id', helpers.isLoggedIn, (req, res, next) => {
        const getUser = `SELECT userid, concat(firstname,' ',lastname) as fullname FROM users WHERE isactive = true`
        const id = [req.params.id];
        pool.query(getUser, (err, users) => {
            const getDataProject = `SELECT DISTINCT projects.projectid, projects.name, members.userid, concat(users.firstname || ' ' || users.lastname) as fullname FROM projects LEFT JOIN members ON members.projectid = projects.projectid
        LEFT JOIN users ON users.userid = members.userid WHERE projects.projectid = $1;`
            pool.query(getDataProject, id, (err, result) => {
                if (err) throw err;
                res.render('projects/edit', result = {
                    projects: result.rows,
                    members : result.rows.map(member => member.userid),
                    users : users.rows

                })
            })
        })
    })

    router.post('/edit/:id', helpers.isLoggedIn, (req, res, err) => {
        let updateProject = 'UPDATE projects SET name = $1 WHERE projectid = $2'
        let body = [req.body.name, req.params.id];
        pool.query(updateProject, body, (err) => {
            if (err) throw err;
            let deleteProject = 'DELETE FROM members WHERE projectid = $1';
            const id = [req.params.id];
            pool.query(deleteProject, id, (err) => {
                if(err) throw err;
                let insertQuery = 'INSERT INTO members(projectid, userid) VALUES ($1, $2)';
                body = [];
                if (req.body.members == undefined) {
                    res.redirect(`/projects/edit/${id}`)
                } else if (typeof req.body.members == 'string') {
                    body = [req.params.id, req.body.members]
                } else if (typeof req.body.members == 'object') {
                    let dataLength = req.body.members.length + 1;
                    for (let i = 3; i <= dataLength; i++) {
                        insertQuery += `,($1, $${i})`;
                        body = [req.params.id, ...req.body.members];
                    }
                    console.log(body)
                    console.log(insertQuery);
                }
                pool.query(insertQuery, body, (err) => {
                    if (err) return console.error(err);
                    res.redirect(`/projects/edit/${req.params.id}`);
                })
            })
        });
    })

    router.post('/add', helpers.isLoggedIn, (req, res, next) => {
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

    router.get('/delete/:id', helpers.isLoggedIn, (req, res, next) => {
        let deleteProject = 'DELETE FROM members WHERE projectid = $1';
        const id = [req.params.id];
        pool.query(deleteProject, id, (err) => {
            if (err) throw err;
            deleteProject = 'DELETE FROM projects WHERE projectid = $1';
            pool.query(deleteProject, id, (err) => {
                if (err) throw err;
                res.redirect('/projects');
            })
        });
    })

    router.get('/overview', (req,res,next) => {
        res.render('partials/sidebar');
    })

    return router;
}