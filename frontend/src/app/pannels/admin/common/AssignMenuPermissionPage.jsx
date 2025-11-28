import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AssignMenuPermissionPage() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [menus, setMenus] = useState([]);
    const [selectedSubmenus, setSelectedSubmenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("access_token");

    // ✅ Load menus & permissions
    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(
                    `http://127.0.0.1:8000/api/assign-menu-permissions-api/${userId}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Error ${res.status}: ${text}`);
                }

                const data = await res.json();

                setMenus(data.menus || []);
                setSelectedSubmenus(data.allowed_submenus || []);
            } catch (err) {
                console.error("Load error:", err);
                setError("Failed to load menu permissions");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    const toggleSubmenu = (id) => {
        if (selectedSubmenus.includes(id)) {
            setSelectedSubmenus(selectedSubmenus.filter((x) => x !== id));
        } else {
            setSelectedSubmenus([...selectedSubmenus, id]);
        }
    };

    const savePermissions = async () => {
        try {
            const res = await fetch(
                `http://127.0.0.1:8000/api/assign-menu-permissions-api/${userId}/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ submenus: selectedSubmenus }),
                }
            );

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt);
            }
            alert("✅ Permissions saved");
            navigate("/admin/users");
        } catch (err) {
            console.error("Save error:", err);
            alert("❌ Failed to save permissions");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow">
                <h3 className="mb-4">Assign Menu Permissions</h3>

                {loading && <p>Loading menus...</p>}
                {error && <p className="text-danger">{error}</p>}

                {!loading && menus.length === 0 && !error && (
                    <p>No menus found</p>
                )}

                {!loading &&
                    menus.map((menu) => (
                        <div
                            key={menu.id}
                            className="mb-3 border-bottom pb-2"
                        >
                            <h5>{menu.name}</h5>

                            {(menu.submenus || []).map((sub) => (
                                <div key={sub.id} className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedSubmenus.includes(
                                            sub.id
                                        )}
                                        onChange={() => toggleSubmenu(sub.id)}
                                        id={`submenu_${sub.id}`}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`submenu_${sub.id}`}
                                    >
                                        {sub.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}

                <div className="mt-3">
                    <button
                        className="btn btn-success"
                        onClick={savePermissions}
                        disabled={loading}
                    >
                        Save Permissions
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AssignMenuPermissionPage;
