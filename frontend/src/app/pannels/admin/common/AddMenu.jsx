import { useState } from "react";

function AddMenu() {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("");
    const [loading, setLoading] = useState(false);

    const saveMenu = async () => {
        const token = localStorage.getItem("access_token");

        if (!name.trim()) {
            alert("Menu name required");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/add-menu/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    icon,
                    panel_type: "admin",
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("✅ Menu added successfully");
                setName("");
                setIcon("");
            } else {
                alert("❌ Error: " + JSON.stringify(data));
            }
        } catch (err) {
            alert("❌ Network error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel-body">
            <h4>Add Menu</h4>

            <div className="form-group mb-3">
                <label>Menu Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-group mb-3">
                <label>Icon Class</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="fa fa-home"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                />
            </div>

            <button
                className="btn btn-primary"
                onClick={saveMenu}
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Menu"}
            </button>
        </div>
    );
}

export default AddMenu;
