import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeDocumentUpload() {
    const navigate = useNavigate();
    const { employeeId } = useParams();

    const [documentTypes, setDocumentTypes] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [loading, setLoading] = useState(true);

    const API = "http://127.0.0.1:8000/api";

    const api = axios.create({
        baseURL: API,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
    });

    useEffect(() => {
        loadDocumentTypes();
    }, []);

    const loadDocumentTypes = async () => {
        try {
            const res = await api.get("/document-types/");
            setDocumentTypes(res.data);
        } catch (err) {
            console.error("Document type load error:", err);
            alert("Failed to load document types");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (docTypeId, file) => {
        setSelectedFiles((prev) => ({
            ...prev,
            [docTypeId]: file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("employee", employeeId);

        Object.entries(selectedFiles).forEach(([docTypeId, file]) => {
            formData.append(docTypeId, file);
        });

        try {
            await api.post("/employee-documents/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Documents Uploaded Successfully!");
            navigate("/admin/list");

        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        }
    };

    return (
        <div className="panel panel-default p-a20">
            <h3>Upload Employee Documents</h3>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Document Name</th>
                                <th>Upload</th>
                            </tr>
                        </thead>

                        <tbody>
                            {documentTypes.map((doc) => (
                                <tr key={doc.id}>
                                    <td><strong>{doc.name}</strong></td>
                                    <td>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) =>
                                                handleFileChange(doc.id, e.target.files[0])
                                            }
                                            required
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button className="btn btn-primary me-2">Submit all Documents</button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                </form>
            )}
        </div>
    );
}

export default EmployeeDocumentUpload;
