import React, {useState} from 'react';

const TodoList = ({tasks, createTask}) => {
    const [task, setTask] = useState('');

    const handleChange = (e) => {
        setTask(e.currentTarget.value)
    }

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault(); 
                createTask(task)
            }}>
                <input type="text" placeholder="Add a task..." onChange={handleChange}/>
                <input type="submit" hidden={true} />
            </form>
            <ul>
            {tasks.map((task, key) => {
                return (
                <div key={key}>
                    <input type="checkbox"></input>
                    <span>{task.content}</span>
                </div>
                )
            })}
            </ul>
        </div>
    )
}

export default TodoList;