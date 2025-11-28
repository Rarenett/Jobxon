import { useEffect, useState } from "react";

function MenuList() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editIcon, setEditIcon] = useState("");

    useEffect(() => {
        loadMenus();
    }, []);

    const loadMenus = async () => {
        const token = localStorage.getItem("access_token");

        const res = await fetch("http://127.0.0.1:8000/api/add-menu/?panel=admin", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setMenus(data);
    };

    const startEdit = (menu) => {
        setEditId(menu.id);
        setEditName(menu.name);
        setEditIcon(menu.icon || "");
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditName("");
        setEditIcon("");
    };

    const updateMenu = async () => {
        const token = localStorage.getItem("access_token");

        if (!editName.trim()) {
            alert("Menu name required");
            return;
        }

        const res = await fetch(`http://127.0.0.1:8000/api/add-menu/${editId}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: editName,
                icon: editIcon,
                panel_type: "admin"
            }),
        });

        if (res.ok) {
            alert("✅ Menu updated");
            cancelEdit();
            loadMenus();
        } else {
            const err = await res.text();
            alert("❌ Update failed: " + err);
        }
    };

    const deleteMenu = async (id) => {
        const token = localStorage.getItem("access_token");

        if (!window.confirm("Delete this menu?")) return;

        const res = await fetch(`http://127.0.0.1:8000/api/add-menu/${id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const err = await res.text();
            alert("Delete failed: " + err);
        }

        loadMenus();
    };

    return (
        <div className="panel-body">
            <h4>Menu List</h4>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Icon</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {menus.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center">
                                No menus found
                            </td>
                        </tr>
                    ) : (
                        menus.map((m) => (
                            <tr key={m.id}>

                                {/* Name Column */}
                                <td>
                                    {editId === m.id ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />
                                    ) : (
                                        m.name
                                    )}
                                </td>

                                {/* Icon Column */}
                                <td>
                                    {editId === m.id ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editIcon}
                                            onChange={(e) => setEditIcon(e.target.value)}
                                        />
                                    ) : (
                                        m.icon
                                    )}
                                </td>

                                {/* Action Column */}
                                <td>
                                    {editId === m.id ? (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={updateMenu}
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
                                                onClick={() => startEdit(m)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteMenu(m.id)}
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

export default MenuList;
