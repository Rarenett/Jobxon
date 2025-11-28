import { useEffect, useState } from "react";

function AddSubMenu() {
    const [menus, setMenus] = useState([]);
    const [menuId, setMenuId] = useState("");
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        loadMenus();
    }, []);

    const loadMenus = async () => {
        const token = localStorage.getItem("access_token");

        const res = await fetch("http://127.0.0.1:8000/api/add-menu/", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setMenus(data);
    };

    const saveSubMenu = async () => {
        const token = localStorage.getItem("access_token");

        if (!menuId || !name || !url) {
            alert("All fields required");
            return;
        }

        await fetch("http://127.0.0.1:8000/api/add-submenu/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                menu: menuId,
                name,
                url,
            }),
        });

        alert("SubMenu added ✅");
        setName("");
        setUrl("");
    };

    return (
        <div className="panel-body">
            <h4>Add SubMenu</h4>

            <div className="form-group mb-2">
                <label>Select Menu</label>
                <select
                    className="form-control"
                    value={menuId}
                    onChange={(e) => setMenuId(e.target.value)}
                >
                    <option value="">-- Select Menu --</option>
                    {menus.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group mb-2">
                <label>SubMenu Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-group mb-3">
                <label>URL</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="/admin/example"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>

            <button className="btn btn-primary" onClick={saveSubMenu}>
                Save SubMenu
            </button>
        </div>
    );
}

export default AddSubMenu;
