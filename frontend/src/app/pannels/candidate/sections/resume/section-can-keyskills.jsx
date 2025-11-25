import { useEffect, useState } from "react";

function SectionCanKeySkills() {
    const [skills, setSkills] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Load Skills
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/key-skills/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            const skillArray = data.skills ? data.skills.split(",") : [];
            setSkills(skillArray.map(s => s.trim()));
            setInputValue(data.skills || "");
        })
        .catch(() => {});
    }, []);

    // ✅ Save Skills
    const saveSkills = async () => {
        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/key-skills/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                },
                body: JSON.stringify({ skills: inputValue })
            });

            if (res.ok) {
                const updatedSkills = inputValue.split(",").map(s => s.trim());
                setSkills(updatedSkills);

                const modal = document.getElementById("Key_Skills");
                const bootstrapModal = window.bootstrap?.Modal.getInstance(modal);
                bootstrapModal?.hide();
            } else {
                alert("Save failed ❌");
            }

        } catch {
            alert("Server error ❌");
        }

        setLoading(false);
    };

    return (
        <>
            {/* Header */}
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn">
                <h4 className="panel-tittle m-a0">Key Skills</h4>
                <button
                    className="site-text-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#Key_Skills"
                    style={{ border: "none", background: "transparent" }}
                >
                    <span className="fa fa-edit" />
                </button>
            </div>

            {/* Skill Pills */}
            <div className="panel-body wt-panel-body p-a20">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {skills.length > 0 ? (
                        skills.map((skill, index) => (
                            <span
                                key={index}
                                style={{
                                    background: "#eef5ff",
                                    color: "#1b62f9",
                                    padding: "8px 16px",
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <p>No skills added</p>
                    )}
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="Key_Skills" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Edit Key Skills</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>

                        <div className="modal-body">
                            <p>Enter skills separated by commas</p>
                            <input
                                className="form-control"
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Finance, Sales, Development..."
                            />
                        </div>

                        <div className="modal-footer">
                            <button
                                className="site-button"
                                onClick={saveSkills}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                className="site-button"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default SectionCanKeySkills;
