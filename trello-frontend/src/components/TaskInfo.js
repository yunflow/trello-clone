import { Box, Button, Card, CardActionArea, Container, TextField, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState } from "react";


function getTasksByStatus(tasks, status) {
    return tasks.filter(task => task.status === status);
}

function TaskInfo({ boardObject, workspaceId }) {
    const tasksNoStatus = getTasksByStatus(boardObject.tasks, null);
    const tasksByStatus0 = getTasksByStatus(boardObject.tasks, "TODO");
    const tasksByStatus1 = getTasksByStatus(boardObject.tasks, "IN_PROGRESS");
    const tasksByStatus2 = getTasksByStatus(boardObject.tasks, "DONE");

    // New Task Param
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskDesc, setNewTaskDesc] = useState("");
    const [newTaskStatus, setNewTaskStatus] = useState("");
    const [newTaskDue, setNewTaskDue] = useState("");

    // Update Task Param
    const [updateTaskName, setUpdateTaskName] = useState("");
    const [updateTaskDesc, setUpdateTaskDesc] = useState("");
    const [updateTaskStatus, setUpdateTaskStatus] = useState("");
    const [updateTaskDue, setUpdateTaskDue] = useState("");

    // Page change
    const [adding, setAdding] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    // Member
    const [taskMember, setMember] = useState("");
    const [showMembersDropdown, setShowMembersDropdown] = useState(false);

    // Search, Filter tasks based on search term, and Date filter
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const filterTasks = (tasks) => {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        return tasks.filter((task) => {
            const taskDate = new Date(task.dueDate);
            const taskNameMatch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase());
            let dateMatch = false;

            switch (dateFilter) {
                case 'dueToday':
                    dateMatch = taskDate.toDateString() === today.toDateString();
                    break;
                case 'dueThisWeek':
                    dateMatch = taskDate.getTime() >= today.getTime() && taskDate.getTime() < nextWeek.getTime();
                    break;
                case 'overdue':
                    dateMatch = taskDate.getTime() < today.getTime();
                    break;
                default:
                    dateMatch = true;
            }

            return taskNameMatch && dateMatch;
        });
    }

    // Get Workspace Members
    const [members, setMembers] = useState(null);
    useEffect(() => {
        let paramData = new URLSearchParams();
        paramData.append('workspaceId', workspaceId);
        fetch("http://localhost:8311/customer/get-workspace-member", {
            method: 'PUT',
            body: paramData
        })
            .then(response => response.json())
            .then(data => { setMembers(data) })
            .catch(error => console.error('Error:', error));
    }, []);

    if (!members) {
        return (
            <Box>
                <Container>
                    Loading...
                </Container>
            </Box>
        )
    }

    // Expand the card to add a task
    const addTask = () => {
        setAdding(!adding);
    };

    // Expand task card information
    const showTaskDetail = id => {
        if (expandedTaskId === id) {
            setExpandedTaskId(null);
        } else {
            setExpandedTaskId(id);
        }
    };

    // Expand the card to update task
    const showUpdateForum = () => {
        setUpdating(!updating);
    }

    // Create new Task
    const handleCreateTask = async () => {
        if (!newTaskName || !newTaskStatus || !newTaskDue) {
            alert("You must set the Name, Status, and Due Date!");
            return;
        }

        fetch('http://localhost:8311/task/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "taskName": newTaskName,
                "taskDesc": newTaskDesc,
                "dueDate": newTaskDue,
                "status": newTaskStatus
            })
        })
            .then(response => response.json())
            .then(data => {
                alert("Success in creating a task!");

                let taskId = data.taskId;
                let paramData = new URLSearchParams();
                paramData.append('boardId', boardObject.boardId);
                paramData.append('taskId', taskId);

                // assign-task
                fetch('http://localhost:8311/board/assign-task', {
                    method: 'PUT',
                    body: paramData
                })
                    .then(response => response.json())
                    .then(data => { boardObject = data })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert(error);
                    });
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(error);
            });
    };

    // Update new Task
    const handleUpdateTask = async (task) => {
        if (!updateTaskStatus) {
            alert("You must set the Status");
            return;
        }

        fetch(`http://localhost:8311/task/${task.taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "taskId": task.taskId,
                "taskName": task.taskName,
                // "taskDesc": updateTaskDesc,
                // "dueDate": updateTaskDue,
                "taskDesc": task.taskDesc,
                "dueDate": task.dueDate,
                "status": updateTaskStatus
            })
        })
            .then(response => response.json())
            .then(data => {
                alert("Update successful!");
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(error);
            })
    };

    // Assign Member
    const handleAssignMember = async (id) => {
        let paramData = new URLSearchParams();
        paramData.append('workspaceId', workspaceId);
        paramData.append('taskId', id);
        paramData.append('userName', taskMember);

        fetch(`http://localhost:8311/customer/assign-member-to-task`, {
            method: 'PUT',
            body: paramData
        })
            .then(response => response.json())
            .then(data => {
                alert("Assign successful!");
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(error);
            })
    };


    // Page
    return (
        <>
            {/* Search, Date Filter*/}
            <Box backgroundColor="#f2f4f5">
                <div className="search-filter">
                    <div>Search & Date Filter:&emsp;</div>
                    <input
                        type="text"
                        placeholder="Search tasks"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                        <option value="">All</option>
                        <option value="dueToday">Due today</option>
                        <option value="dueThisWeek">Due this week</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
            </Box>

            {/* Other Tasks */}
            <div className="all-tasks">

                {/* No status */}
                <div className="column">
                    <h4>Add a New Task</h4>
                    {filterTasks(tasksNoStatus).map((task, index) => (
                        <div key={index} style={{ paddingBottom: "20px" }}>
                            <div className="Task-Container" >
                                <Card>
                                    <CardActionArea onClick={() => showTaskDetail(task.taskId)}>
                                        <Typography variant="h6">
                                            &nbsp;&nbsp;{task.taskName}
                                        </Typography>
                                    </CardActionArea>
                                    {expandedTaskId === task.taskId && (
                                        <Container>
                                            <Box sx={{ marginTop: 2, marginBottom: 3, alignItems: 'center', }}>
                                                <Button variant="contained" onClick={showUpdateForum}>
                                                    Edit
                                                </Button>
                                                <br />
                                                <br />
                                                {!updating && (
                                                    <>
                                                        {task.user ? (
                                                            <Typography component="h3">
                                                                Member: {task.user}
                                                            </Typography>
                                                        ) : (
                                                            <div>
                                                                <Typography component="h3">
                                                                    <span id="set-a-member">Assign a member: </span><button onClick={() => setShowMembersDropdown(!showMembersDropdown)}>
                                                                        Set Member
                                                                    </button>
                                                                </Typography>
                                                                {showMembersDropdown && (
                                                                    <>
                                                                        <select onChange={(e) => setMember(e.target.value)}>

                                                                            <option value="">Select Member...</option>

                                                                            {members.map((user, index) => (
                                                                                <option key={index} value={user.userName}>{user.userName}</option>
                                                                            ))}

                                                                        </select>
                                                                        <button onClick={() => handleAssignMember(task.taskId)}>Assign Member</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* <Typography component="h3">
                                                            Status: {task.status}
                                                        </Typography> */}
                                                        <Typography component="h3">
                                                            Due date: {task.dueDate}
                                                        </Typography>
                                                        <br />
                                                        <Typography component="h3">
                                                            Mission: {task.taskDesc}
                                                        </Typography>
                                                    </>
                                                )}
                                                {updating && (
                                                    <>
                                                        {/* <Typography component="h3">
                                                            Task Name: <input type="text" size="15" onChange={(e) => setUpdateTaskName(e.target.value)} />
                                                        </Typography> */}
                                                        <Typography component="h3">
                                                            Status:
                                                            <select onChange={(e) => setUpdateTaskStatus(e.target.value)}>
                                                                <option value="">Select Status...</option>
                                                                <option value="TODO">TODO</option>
                                                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                                <option value="DONE">DONE</option>
                                                            </select>
                                                        </Typography>
                                                        {/* <Typography component="h3">
                                                            Due date:<input type="date" size="15" onChange={(e) => setUpdateTaskDue(e.target.value)} />
                                                        </Typography> */}
                                                        <br />
                                                        {/* <Typography component="h3">
                                                            Desc: <input type="text" size="25" onChange={(e) => setUpdateTaskDesc(e.target.value)} />
                                                        </Typography> */}

                                                        <Button variant="contained" onClick={() => handleUpdateTask(task)}>
                                                            Update Task
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>
                                        </Container>
                                    )}
                                </Card>
                            </div>
                        </div>
                    ))}

                    {/* Add new Task */}
                    <div className="task-new">
                        <div className="Task-Container">
                            <Card>
                                <CardActionArea onClick={addTask} sx={{ paddingLeft: 16 }}>
                                    <AddCircleIcon />
                                </CardActionArea>
                                {adding && (
                                    <Container>
                                        <Box sx={{ marginTop: 2, marginBottom: 3, alignItems: 'center', }}>
                                            <Typography component="h3">
                                                Create New Task
                                            </Typography>

                                            <TextField
                                                label="Task Name"
                                                variant="outlined"
                                                required
                                                value={newTaskName}
                                                onChange={(e) => setNewTaskName(e.target.value)}
                                                fullWidth
                                                className="board-name-input"
                                                margin="normal"
                                            />
                                            <TextField
                                                label="Task Mission"
                                                variant="outlined"
                                                required
                                                value={newTaskDesc}
                                                onChange={(e) => setNewTaskDesc(e.target.value)}
                                                fullWidth
                                                className="board-name-input"
                                                margin="normal"
                                            />

                                            <Typography component="h3">
                                                Status:
                                                <select onChange={(e) => setNewTaskStatus(e.target.value)}>
                                                    <option value="">Select Status...</option>
                                                    <option value="TODO">TODO</option>
                                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                    <option value="DONE">DONE</option>
                                                </select>
                                            </Typography>
                                            <Typography component="h3">
                                                Due date:<input type="date" size="15" onChange={(e) => setNewTaskDue(e.target.value)} />
                                            </Typography>
                                            <br />
                                            <Button variant="contained" onClick={handleCreateTask}>
                                                Create Task
                                            </Button>
                                        </Box>
                                    </Container>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>

                {/* TODO */}
                <div className="column">
                    <h4>TODO</h4>
                    {filterTasks(tasksByStatus0).map((task, index) => (
                        <div key={index} style={{ paddingBottom: "20px" }}>
                            <div className="Task-Container" >
                                <Card>
                                    <CardActionArea onClick={() => showTaskDetail(task.taskId)}>
                                        <Typography variant="h6">
                                            &nbsp;&nbsp;{task.taskName}
                                        </Typography>
                                    </CardActionArea>
                                    {expandedTaskId === task.taskId && (
                                        <Container>
                                            <Box sx={{ marginTop: 2, marginBottom: 3, alignItems: 'center', }}>
                                                <Button variant="contained" onClick={showUpdateForum}>
                                                    Edit
                                                </Button>
                                                <br />
                                                <br />
                                                {!updating && (
                                                    <>
                                                        {task.user ? (
                                                            <Typography component="h3">
                                                                Member: {task.user}
                                                            </Typography>
                                                        ) : (
                                                            <div>
                                                                <Typography component="h3">
                                                                    <span id="set-a-member">Assign a member: </span><button onClick={() => setShowMembersDropdown(!showMembersDropdown)}>
                                                                        Set Member
                                                                    </button>
                                                                </Typography>
                                                                {showMembersDropdown && (
                                                                    <>
                                                                        <select onChange={(e) => setMember(e.target.value)}>

                                                                            <option value="">Select Member...</option>

                                                                            {members.map((user, index) => (
                                                                                <option key={index} value={user.userName}>{user.userName}</option>
                                                                            ))}

                                                                        </select>
                                                                        <button onClick={() => handleAssignMember(task.taskId)}>Assign Member</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* <Typography component="h3">
                                                            Status: {task.status}
                                                        </Typography> */}
                                                        <Typography component="h3">
                                                            Due date: {task.dueDate}
                                                        </Typography>
                                                        <br />
                                                        <Typography component="h3">
                                                            Mission: {task.taskDesc}
                                                        </Typography>
                                                    </>
                                                )}
                                                {updating && (
                                                    <>
                                                        {/* <Typography component="h3">
                                                            Task Name: <input type="text" size="15" onChange={(e) => setUpdateTaskName(e.target.value)} />
                                                        </Typography> */}
                                                        <Typography component="h3">
                                                            Status:
                                                            <select onChange={(e) => setUpdateTaskStatus(e.target.value)}>
                                                                <option value="">Select Status...</option>
                                                                <option value="TODO">TODO</option>
                                                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                                <option value="DONE">DONE</option>
                                                            </select>
                                                        </Typography>
                                                        {/* <Typography component="h3">
                                                            Due date:<input type="date" size="15" onChange={(e) => setUpdateTaskDue(e.target.value)} />
                                                        </Typography> */}
                                                        <br />
                                                        {/* <Typography component="h3">
                                                            Desc: <input type="text" size="25" onChange={(e) => setUpdateTaskDesc(e.target.value)} />
                                                        </Typography> */}

                                                        <Button variant="contained" onClick={() => handleUpdateTask(task)}>
                                                            Update Task
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>
                                        </Container>
                                    )}
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>

                {/* IN_PROGRESS */}
                <div className="column">
                    <h4>IN_PROGRESS</h4>
                    {filterTasks(tasksByStatus1).map((task, index) => (
                        <div key={index} style={{ paddingBottom: "20px" }}>
                            <div className="Task-Container" >
                                <Card>
                                    <CardActionArea onClick={() => showTaskDetail(task.taskId)}>
                                        <Typography variant="h6">
                                            &nbsp;&nbsp;{task.taskName}
                                        </Typography>
                                    </CardActionArea>
                                    {expandedTaskId === task.taskId && (
                                        <Container>
                                            <Box sx={{ marginTop: 2, marginBottom: 3, alignItems: 'center', }}>
                                                <Button variant="contained" onClick={showUpdateForum}>
                                                    Edit
                                                </Button>
                                                <br />
                                                <br />
                                                {!updating && (
                                                    <>
                                                        {task.user ? (
                                                            <Typography component="h3">
                                                                Member: {task.user}
                                                            </Typography>
                                                        ) : (
                                                            <div>
                                                                <Typography component="h3">
                                                                    <span id="set-a-member">Assign a member: </span><button onClick={() => setShowMembersDropdown(!showMembersDropdown)}>
                                                                        Set Member
                                                                    </button>
                                                                </Typography>
                                                                {showMembersDropdown && (
                                                                    <>
                                                                        <select onChange={(e) => setMember(e.target.value)}>

                                                                            <option value="">Select Member...</option>

                                                                            {members.map((user, index) => (
                                                                                <option key={index} value={user.userName}>{user.userName}</option>
                                                                            ))}

                                                                        </select>
                                                                        <button onClick={() => handleAssignMember(task.taskId)}>Assign Member</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* <Typography component="h3">
                                                            Status: {task.status}
                                                        </Typography> */}
                                                        <Typography component="h3">
                                                            Due date: {task.dueDate}
                                                        </Typography>
                                                        <br />
                                                        <Typography component="h3">
                                                            Mission: {task.taskDesc}
                                                        </Typography>
                                                    </>
                                                )}
                                                {updating && (
                                                    <>
                                                        {/* <Typography component="h3">
                                                            Task Name: <input type="text" size="15" onChange={(e) => setUpdateTaskName(e.target.value)} />
                                                        </Typography> */}
                                                        <Typography component="h3">
                                                            Status:
                                                            <select onChange={(e) => setUpdateTaskStatus(e.target.value)}>
                                                                <option value="">Select Status...</option>
                                                                <option value="TODO">TODO</option>
                                                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                                <option value="DONE">DONE</option>
                                                            </select>
                                                        </Typography>
                                                        {/* <Typography component="h3">
                                                            Due date:<input type="date" size="15" onChange={(e) => setUpdateTaskDue(e.target.value)} />
                                                        </Typography> */}
                                                        <br />
                                                        {/* <Typography component="h3">
                                                            Desc: <input type="text" size="25" onChange={(e) => setUpdateTaskDesc(e.target.value)} />
                                                        </Typography> */}

                                                        <Button variant="contained" onClick={() => handleUpdateTask(task)}>
                                                            Update Task
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>
                                        </Container>
                                    )}
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DONE */}
                <div className="column">
                    <h4>DONE</h4>
                    {filterTasks(tasksByStatus2).map((task, index) => (
                        <div key={index} style={{ paddingBottom: "20px" }}>
                            <div className="Task-Container" >
                                <Card>
                                    <CardActionArea onClick={() => showTaskDetail(task.taskId)}>
                                        <Typography variant="h6">
                                            &nbsp;&nbsp;{task.taskName}
                                        </Typography>
                                    </CardActionArea>
                                    {expandedTaskId === task.taskId && (
                                        <Container>
                                            <Box sx={{ marginTop: 2, marginBottom: 3, alignItems: 'center', }}>
                                                <Button variant="contained" onClick={showUpdateForum}>
                                                    Edit
                                                </Button>
                                                <br />
                                                <br />
                                                {!updating && (
                                                    <>
                                                        {task.user ? (
                                                            <Typography component="h3">
                                                                Member: {task.user}
                                                            </Typography>
                                                        ) : (
                                                            <div>
                                                                <Typography component="h3">
                                                                    <span id="set-a-member">Assign a member: </span><button onClick={() => setShowMembersDropdown(!showMembersDropdown)}>
                                                                        Set Member
                                                                    </button>
                                                                </Typography>
                                                                {showMembersDropdown && (
                                                                    <>
                                                                        <select onChange={(e) => setMember(e.target.value)}>

                                                                            <option value="">Select Member...</option>

                                                                            {members.map((user, index) => (
                                                                                <option key={index} value={user.userName}>{user.userName}</option>
                                                                            ))}

                                                                        </select>
                                                                        <button onClick={() => handleAssignMember(task.taskId)}>Assign Member</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* <Typography component="h3">
                                                            Status: {task.status}
                                                        </Typography> */}
                                                        <Typography component="h3">
                                                            Due date: {task.dueDate}
                                                        </Typography>
                                                        <br />
                                                        <Typography component="h3">
                                                            Mission: {task.taskDesc}
                                                        </Typography>
                                                    </>
                                                )}
                                                {updating && (
                                                    <>
                                                        {/* <Typography component="h3">
                                                            Task Name: <input type="text" size="15" onChange={(e) => setUpdateTaskName(e.target.value)} />
                                                        </Typography> */}
                                                        <Typography component="h3">
                                                            Status:
                                                            <select onChange={(e) => setUpdateTaskStatus(e.target.value)}>
                                                                <option value="">Select Status...</option>
                                                                <option value="TODO">TODO</option>
                                                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                                <option value="DONE">DONE</option>
                                                            </select>
                                                        </Typography>
                                                        {/* <Typography component="h3">
                                                            Due date:<input type="date" size="15" onChange={(e) => setUpdateTaskDue(e.target.value)} />
                                                        </Typography> */}
                                                        <br />
                                                        {/* <Typography component="h3">
                                                            Desc: <input type="text" size="25" onChange={(e) => setUpdateTaskDesc(e.target.value)} />
                                                        </Typography> */}

                                                        <Button variant="contained" onClick={() => handleUpdateTask(task)}>
                                                            Update Task
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>
                                        </Container>
                                    )}
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default TaskInfo;
