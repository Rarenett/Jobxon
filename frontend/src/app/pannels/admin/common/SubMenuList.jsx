import { useEffect, useState } from "react";

function SubMenuList() {
    const [subMenus, setSubMenus] = useState([]);
    const [loading, setLoading] = useState(false);

    // Edit state
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editUrl, setEditUrl] = useState("");

    useEffect(() => {
        loadSubMenus();
    }, []);

    const loadSubMenus = async () => {
        const token = localStorage.getItem("access_token");
        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/add-submenu/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setSubMenus(data);
        } catch (err) {
            console.error("Load error", err);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (subMenu) => {
        setEditId(subMenu.id);
        setEditName(subMenu.name);
        setEditUrl(subMenu.url);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditName("");
        setEditUrl("");
    };

    const updateSubMenu = async () => {
        const token = localStorage.getItem("access_token");

        if (!editName.trim() || !editUrl.trim()) {
            alert("All fields are required");
            return;
        }

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/add-submenu/${editId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editName,
                    url: editUrl,
                    // If you have other fields like menu, include them here
                }),
            });

            if (res.ok) {
                alert("✅ SubMenu updated");
                cancelEdit();
                loadSubMenus();
            } else {
                const errText = await res.text();
                alert("❌ Update failed: " + errText);
            }
        } catch (err) {
            console.error("Update error", err);
        }
    };

    const deleteSub = async (id) => {
        const token = localStorage.getItem("access_token");

        if (!window.confirm("Delete this submenu?")) return;

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/add-submenu/${id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const txt = await res.text();
                alert("Delete failed: " + txt);
            }
        } catch (err) {
            console.error("Delete error", err);
        }

        loadSubMenus();
    };

    return (
        <div className="panel-body">
            <h4>SubMenu List</h4>

            {loading && <p>Loading...</p>}

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Menu</th>
                        <th>SubMenu</th>
                        <th>URL</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subMenus.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No submenus found
                            </td>
                        </tr>
                    ) : (
                        subMenus.map((s) => (
                            <tr key={s.id}>
                                <td>{s.menu_name || s.menu?.name}</td>
                                <td>
                                    {editId === s.id ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />
                                    ) : (
                                        s.name
                                    )}
                                </td>
                                <td>
                                    {editId === s.id ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editUrl}
                                            onChange={(e) => setEditUrl(e.target.value)}
                                        />
                                    ) : (
                                        s.url
                                    )}
                                </td>
                                <td>
                                    {editId === s.id ? (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={updateSubMenu}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => startEdit(s)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteSub(s.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SubMenuList;
