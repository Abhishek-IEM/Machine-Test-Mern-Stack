import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import UploadTasks from "./UploadTasks";
import styles from "../styles/Dashboard.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ITEMS_PER_PAGE = 6;

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState("tasks");
  const [agentForm, setAgentForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [taskPage, setTaskPage] = useState(1);
  const [agentPage, setAgentPage] = useState(1);
  const [taskSearch, setTaskSearch] = useState("");
  const [agentSearch, setAgentSearch] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  
  useEffect(() => {
    if (!token) navigate("/login");
    else fetchUser();
  }, []);

  //Fetch Logged In User
  const fetchUser = async () => {
    try {
      const { data } = await API.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);

      if (data.role === "admin") {
        fetchAgents();
      } else {
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  };

  //Fetch All Agents(Admin Only)
  const fetchAgents = async () => {
    try {
      const { data } = await API.get("/agent/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(data.agents || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch agents.");
    }
  };

  //Fetch Tasks (All for Admin, My Tasks for Agent)
  const fetchTasks = async (agentId = null) => {
    try {
      let endpoint = "/tasks/mytasks";
      if (agentId) endpoint = `/tasks/agent/${agentId}`;
      const { data } = await API.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(data);
      setCurrentView("tasks");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks.");
    }
  };

  //Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  //After Successful Task Upload
  const handleUploadSuccess = () => {
    fetchAgents();
    fetchTasks();
    setCurrentView("tasks");
    toast.success("Tasks uploaded successfully!");
  };

  //Handle Agent Form Change
  const handleAgentFormChange = (e) => {
    const { name, value } = e.target;
    setAgentForm({ ...agentForm, [name]: value });
  };

  //Add New Agent
  const handleAddAgent = async (e) => {
    e.preventDefault();
    const { name, email, mobile, password } = agentForm;
    if (!name || !email || !mobile || !password) {
      toast.warn("All fields are required.");
      return;
    }
    try {
      const { data } = await API.post(
        "/agent/create-agent",
        { name, email, mobile, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.message || "Agent added successfully.");
      setAgentForm({ name: "", email: "", mobile: "", password: "" });
      fetchAgents();
      setCurrentView("agents");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add agent.");
    }
  };

  //Update Task Status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(
        `/tasks/status/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Task status updated!");

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task status.");
    }
  };

  //Delete Agent
  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;

    try {
      const { data } = await API.delete(`/agent/delete/${agentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message || "Agent deleted successfully.");
      fetchAgents();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete agent.");
    }
  };

  // Pagination & Search
  const filteredTasks = tasks.filter(
    (t) =>
      t.firstName?.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.phone?.includes(taskSearch)
  );
  const displayedTasks = filteredTasks.slice(
    (taskPage - 1) * ITEMS_PER_PAGE,
    taskPage * ITEMS_PER_PAGE
  );

  const filteredAgents = agents.filter(
    (a) =>
      a.name?.toLowerCase().includes(agentSearch.toLowerCase()) ||
      a.email?.toLowerCase().includes(agentSearch.toLowerCase())
  );
  const displayedAgents = filteredAgents.slice(
    (agentPage - 1) * ITEMS_PER_PAGE,
    agentPage * ITEMS_PER_PAGE
  );

  const totalTaskPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const totalAgentPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Welcome, {user.name}</h2>
        <div className={styles.buttons}>
          {user.role !== "admin" && (
            <button
              className={styles.smallBtn}
              onClick={() => {
                setCurrentView("tasks");
                fetchTasks();
              }}
            >
              My Tasks
            </button>
          )}
          {user.role === "admin" && (
            <>
              <button
                className={styles.smallBtn}
                onClick={() => setCurrentView("agents")}
              >
                View All Agents
              </button>
              <button
                className={styles.smallBtn}
                onClick={() => setCurrentView("addAgent")}
              >
                Add New Agent
              </button>
              <button
                className={styles.smallBtn}
                onClick={() => setCurrentView("upload")}
              >
                Upload Tasks
              </button>
            </>
          )}
          <button className={styles.smallBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* TASKS SECTION */}
      {currentView === "tasks" && (
        <section className={styles.section}>
          <h3>
            {user.role === "admin" ? "Selected Agent's Tasks" : "My Tasks"}
          </h3>
          <input
            type="text"
            placeholder="Search tasks..."
            value={taskSearch}
            onChange={(e) => setTaskSearch(e.target.value)}
            className={styles.searchInput}
          />
          <table className={styles.table}>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Phone</th>
                <th>Task</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedTasks.length > 0 ? (
                displayedTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.firstName}</td>
                    <td>{task.phone}</td>
                    <td>{task.notes}</td>
                    <td>
                      {user.role === "admin" ? (
                        <select
                          value={task.status || "pending"}
                          onChange={(e) =>
                            handleStatusChange(task._id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="done">Done</option>
                        </select>
                      ) : task.status === "done" ? (
                        "Done"
                      ) : (
                        "Pending"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalTaskPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={taskPage === 1}
                onClick={() => setTaskPage((p) => p - 1)}
              >
                Prev
              </button>
              <button
                className={styles.pageBtn}
                disabled={taskPage === totalTaskPages}
                onClick={() => setTaskPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}

      {/* AGENTS SECTION */}
      {currentView === "agents" && user.role === "admin" && (
        <section className={styles.section}>
          <h3>All Agents</h3>
          <input
            type="text"
            placeholder="Search agents..."
            value={agentSearch}
            onChange={(e) => setAgentSearch(e.target.value)}
            className={styles.searchInput}
          />
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Tasks Assigned</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedAgents.length > 0 ? (
                displayedAgents.map((agent) => (
                  <tr key={agent._id}>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.taskCount || 0}</td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button
                          className={styles.smallBtn}
                          onClick={() => fetchTasks(agent._id)}
                        >
                          View Tasks
                        </button>
                        <button
                          className={`${styles.smallBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDeleteAgent(agent._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No agents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalAgentPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={agentPage === 1}
                onClick={() => setAgentPage((p) => p - 1)}
              >
                Prev
              </button>
              <button
                className={styles.pageBtn}
                disabled={agentPage === totalAgentPages}
                onClick={() => setAgentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}

      {/* ADD AGENT SECTION */}
      {currentView === "addAgent" && user.role === "admin" && (
        <section className={styles.section}>
          <h3>Add New Agent</h3>
          <form onSubmit={handleAddAgent} className={styles.agentForm}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={agentForm.name}
              onChange={handleAgentFormChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={agentForm.email}
              onChange={handleAgentFormChange}
              required
            />

            <PhoneInput
              country={"in"}
              value={agentForm.mobile}
              onChange={(phone) =>
                setAgentForm({ ...agentForm, mobile: phone })
              }
              inputStyle={{
                width: "100%",
                height: "42px",
                borderRadius: "8px",
              }}
              placeholder="Mobile Number"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={agentForm.password}
              onChange={handleAgentFormChange}
              style={{ marginTop: "12px" }}
              required
            />

            <button type="submit" className={styles.smallBtn}>
              Add Agent
            </button>
          </form>
        </section>
      )}

      {/* UPLOAD TASKS SECTION */}
      {currentView === "upload" && user.role === "admin" && (
        <section className={styles.section}>
          <h3>Upload Tasks</h3>
          <UploadTasks onUploadSuccess={handleUploadSuccess} />
        </section>
      )}
    </div>
  );
};

export default Dashboard;
