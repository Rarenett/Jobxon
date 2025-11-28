import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../../../../../contexts/AuthContext"; // adjust path

function SectionApplyJob() {
  const { id } = useParams();
  const jobId = id;
  const { token } = useAuth();             // <-- get JWT from context

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    resume: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        resume: acceptedFiles[0],
      }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("jobId from URL:", jobId);

    const data = new FormData();
    data.append("job", jobId);
    data.append("cover_letter", formData.message);
    if (formData.resume) {
      data.append("resume", formData.resume);
    }

    console.log("ACCESS TOKEN FROM CONTEXT:", token);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/applications/", {
        method: "POST",
        body: data,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        setFormData({ name: "", email: "", message: "", resume: null });
      } else {
        const text = await response.text();
        console.error("Failed:", response.status, text);
        alert(`Failed to submit application (${response.status})`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting");
    }
  };
  return (
    <>
      <div className="twm-tabs-style-1">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="form-group">
                <label>Your Name</label>
                <div className="ls-inputicon-box">
                  <input
                    className="form-control"
                    name="name"
                    type="text"
                    placeholder="Devid Smith"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <i className="fs-input-icon fa fa-user" />
                </div>
              </div>
            </div>

            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="form-group">
                <label>Email Address</label>
                <div className="ls-inputicon-box">
                  <input
                    className="form-control"
                    name="email"
                    type="email"
                    placeholder="Devid@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <i className="fs-input-icon fas fa-at" />
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <label>Message</label>
                <textarea
                  className="form-control"
                  rows={3}
                  name="message"
                  placeholder="Message sent to the employer"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-lg-12 col-md-12">
              <div className="form-group">
                <label>Upload Resume</label>
                <div
                  {...getRootProps()}
                  className="dropzone"
                  style={{
                    border: "2px dashed #ccc",
                    borderRadius: "4px",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: isDragActive ? "#f0f0f0" : "#fff",
                  }}
                >
                  <input {...getInputProps()} />
                  {formData.resume ? (
                    <p>Selected: {formData.resume.name}</p>
                  ) : (
                    <p>
                      {isDragActive
                        ? "Drop the file here..."
                        : "Drag 'n' drop resume here, or click to select file"}
                    </p>
                  )}
                </div>
                <small>
                  If you do not have a resume document, you may write your brief
                  professional profile
                  <NavLink
                    to={publicUser.pages.CONTACT}
                    className="site-text-primary"
                  >
                    {" "}
                    here
                  </NavLink>
                </small>
              </div>
            </div>

            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="text-left">
                <button type="submit" className="site-button">
                  Send Application
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default SectionApplyJob;
