import { useState } from "react";

function SectionCanAttachment() {
    const [file, setFile] = useState(null);
    const token = localStorage.getItem("access_token");

    const uploadResume = async () => {
        if (!file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/resume/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                alert("Resume uploaded successfully ✅");
                setFile(null);
            } else {
                const err = await res.json();
                alert(JSON.stringify(err));
            }
        } catch (error) {
            alert("Upload failed ❌");
        }
    };

    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Attach Resume</h4>
            </div>

            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    <p>
                        Resume is the most important document recruiters look for.
                        Recruiters generally do not look at profiles without resumes.
                    </p>

                    <div className="dashboard-cover-pic">
                        <input
                            type="file"
                            className="form-control mb-2"
                            onChange={(e) => setFile(e.target.files[0])}
                        />

                        <button className="site-button" onClick={uploadResume}>
                            Upload Resume
                        </button>

                        <p>Upload Resume File size is 3 MB</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SectionCanAttachment;
