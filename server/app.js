const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const user = require('./models/userInfo');
const task = require('./models/tasks');

const app = express();

require('dotenv').config();

const secretKey = crypto.randomBytes(64).toString('hex');

mongoose.connect(process.env.DATABASE)
    .then(res => console.log("connected!"))
    .catch(err => console.log(err))


app.use(express.json());
app.use(cors());


app.post('/newUsers', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await user.create({ email, password: hashedPassword });
        res.status(201).json({ message: "Registration Successful!" });
    }
    catch (e) {
        res.status(401).json({ message: 'Registration Unsuccessful, Try Again!' });
    }

});


app.post('/logInUsers', async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await user.findOne({ email });
        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (!isMatch)
            return res.status(401).json({ message: 'Wrong Password!' });

        const token = jwt.sign({ userId: foundUser.id, userEmail: email }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });

    }
    catch (e) {
        res.status(401).json({ message: "Login Not Successful, Try Again!" });
    }
});

const verifyToken = (req, res, next) => {
    try {

        const auth = req.headers.authorization;
        const recievedToken = auth && auth.split(' ')[1];

        const decoded = jwt.verify(recievedToken, process.env.SECRET_KEY);
        req.user = decoded;

        next();
    }
    catch (e) {
        res.status(400).json({ message: 'Invalid or Expired Token!' });
    }

}

app.post('/createTasks', verifyToken, async (req, res) => {
    try {
        const { taskName } = req.body;
        const userId = req.user.userId;
        const newTask = await task.create({ task: taskName, userId });

        if (!newTask)
            return res.status(401).json({ message: 'Task Not Added!' });

        res.status(201).json({ message: 'Task Added Successfully!' });

    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
})



app.get('/viewTasks', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const foundTasks = await task.find({ userId });

        if (!foundTasks || foundTasks.length == 0)
            return res.status(404).json({ message: 'No Tasks Found!' });

        res.status(200).json(foundTasks);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Internal Server Error!' });
    }


});



app.put('/toggleCompleted/:id', async (req, res) => {
    try {
        const toogleComplete = await task.findByIdAndUpdate(
            req.params.id,
            { completed: true },
            { runValidators: true }
        );
        if (!toogleComplete)
            return res.status(401).json({ message: 'Done Mark Unsuccessful!' });

        res.status(200).json({ message: 'Done Mark Successful!' });
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error!' })
    }

})

app.delete('/deleteTask/:id', async (req, res) => {
    try {
        const deleteTask = await task.findByIdAndDelete(req.params.id);

        if (!deleteTask)
            return res.status(401).json({ message: 'Delete Task unsuccessful!' });
        res.status(200).json({ message: 'Task Deleted Successfully!' });
    }
    catch (e) {
        res.status(500).json({ message: 'Internal Server Error!' })
    }



})


app.listen(3000, () => {
    console.log('server running on port 3000...')
});