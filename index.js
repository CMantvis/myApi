const express = require("express");
const Joi = require("joi");
const app = express();

app.use(express.json());

const courses = [
    {id:1,name:"course1"},
    {id:2,name:"course2"},
    {id:3,name:"course3"},
]

app.get("/", (req,res) => {
    res.send("hello world");
});

app.get("/api/courses", (req,res) => {
    res.send(courses);
});

app.post("/api/courses", (req,res) => {

    //validation using Joi
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body, schema);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // validate if user send correct info
    // if(!req.body.name || req.body.name.length <3) {
    //     // 400 = bad request
    //     res.status(400).send("Name is required and should be atleast 3 characters");
    //     return;
    // }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
})

app.put("/api/courses/:id", (req,res) => {
    // look if the given course with the id exists
    // if not return 404
    //otherwise validate and return course,if invalid return 400
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("The course with the given ID was not found");
        return;
    }

    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);

}) 

app.delete("/api/courses/:id", (req,res) => {
    // Look up the course with given id +
    //if it doesnt exit return 404+
    //otherwise delete it
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("The course with the given ID was not found");

    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
})


app.get("/api/courses/:id", (req,res) => {
    //read value of the slug and send it
    // res.send(req.params.id)
    //read value of query and send it
    // res.send(req.query);
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if (!course) return res.status(404).send("The course with the given ID was not found");
   res.send(course);
})

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`))

