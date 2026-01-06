import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'

function Tasks() {
    const navigate = useNavigate();
    const [view, setView] = useState(false);
    const [create, setCreate] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [response, setResponse] = useState('');
    const [taskName, setTaskName] = useState('');
    const [completed, setCompleted] = useState(false);

    const handleView = async () => {

        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/viewTasks', {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.ok && Array.isArray(data))
            return setTasks(data);

        setResponse(data.message);

    }

    useEffect(() => {
        handleView();

    }, [taskName]);

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/createTasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ taskName })
        });

        const data = await res.json();
        setTaskName('');
        setResponse(data.message);


    }

    const handleCompleted = async (id) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/toggleCompleted/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            authorization: `Bearer ${token}`

        });

        const data = await res.json();
        setResponse(data.message);

        setTasks(prevTasks =>
            prevTasks.map(task =>
                task._id === id ? { ...task, completed: true } : task
            )
        );
    }

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/deleteTask/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            authorization: `Bearer ${token}`

        });

        const data = await res.json();
        setResponse(data.message);

        setTasks((prevTasks) => prevTasks.filter((taskDeleted) => taskDeleted._id != id))

    }

    const handleLogout = async (e) => {
        e.preventDefault();

        localStorage.removeItem('token');


    }



    return (
        <div className='container-fluid'>
            <h1 className='text-center m-5 p-5 fw-bolder ' style={{ textShadow: '1px 2px 2px black' }}>Tasks</h1>
            <hr />
            <h2 className='text-center my-5 fw-bold fst-italic'>Welcome to your tasks page.</h2>
            <div className='d-flex flex-row justify-content-center pt-3'>
                <button type='button' className='btn btn-dark' onClick={() => {
                    setCreate(!create)
                }}>createMyNewTask</button>
            </div>

            {response ? <p className='fw-bold fst-italic text-center mt-5'>{response}</p> : <p></p>}


            {create && <form className='' onSubmit={handleCreate}>
                <input type="text" className='form-control'
                    placeholder='Enter the task to be done'
                    name='taskName'
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                />
                <br />
                <button type='submit' className='btn btn-dark my-3'>AddTask</button>



            </form>}

            <h1 className='text-center fw-bolder mt-5 fst-italic'>Your tasks</h1>
            <hr />

            {tasks.map((task) => (
                <ul className='list-unstyled'>
                    <li className='my-3 fst-italic fw-bold fs-5' key={task._id}>{task.task}
                        <br />
                        <br />

                        {task.completed ? <span className="text-success">✔ Completed</span> : <span className="text-warning">⏳ Pending</span>}
                        <br />
                        <button type='button' className='m-3 btn btn-outline-dark' onClick={() => handleCompleted(task._id)}>Done</button>
                        <button type='button' className='btn btn-outline-danger m-3' onClick={() => handleDelete(task._id)}>Delete</button>
                    </li>

                </ul>
            ))}

            <div className='d-flex flex-row justify-content-center'>
            <button className='btn btn-outline-secondary mx-5'  onClick={() => navigate('/')}>BackToHomePage</button>
            <button className=' btn btn-outline-secondary mx-5' style={{float:'right'}} onClick={() => {
                navigate('/')
                handleLogout();
            }}>LogOut</button>
            </div>



        </div>
    )
}

export default Tasks
