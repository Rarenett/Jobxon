import { useEffect, useState } from "react";

function SectionCanAccomplishments() {
    const token = localStorage.getItem("access_token");

    // =========================
    // States
    // =========================

    // Online profile
    const [onlineProfile, setOnlineProfile] = useState({
        profile_name: "",
        url: "",
        description: ""
    });

    // Work Sample
    const [workSample, setWorkSample] = useState({
        title: "",
        url: "",
        from_date: "",
        to_date: "",
        working: false,
        description: ""
    });

    // Research Publication
    const [research, setResearch] = useState({
        title: "",
        url: "",
        published_on: "",
        description: ""
    });

    // Presentation
    const [presentation, setPresentation] = useState({
        title: "",
        url: "",
        description: ""
    });

    // Certification
    const [certification, setCertification] = useState({
        name: "",
        body: "",
        year: ""
    });

    // Patent
    const [patent, setPatent] = useState({
        title: "",
        url: "",
        office: "",
        application_no: "",
        status: "Pending",
        published_on: "",
        description: ""
    });

    // =========================
    // SAVE FUNCTIONS
    // =========================

    const saveOnlineProfile = async () => {
        await fetch("http://127.0.0.1:8000/api/online-profiles/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(onlineProfile)
        });
        alert("Saved ✅");
    };

    const saveWorkSample = async () => {
        await fetch("http://127.0.0.1:8000/api/work-samples/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(workSample)
        });
        alert("Saved ✅");
    };

    const saveResearch = async () => {
        await fetch("http://127.0.0.1:8000/api/research-publications/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(research)
        });
        alert("Saved ✅");
    };

    const savePresentation = async () => {
        await fetch("http://127.0.0.1:8000/api/presentations/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(presentation)
        });
        alert("Saved ✅");
    };

    const saveCertification = async () => {
        await fetch("http://127.0.0.1:8000/api/certifications/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(certification)
        });
        alert("Saved ✅");
    };

    const savePatent = async () => {
        await fetch("http://127.0.0.1:8000/api/patents/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(patent)
        });
        alert("Saved ✅");
    };

    // =========================
    // JSX
    // =========================

    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Accomplishments</h4>
            </div>

            <div className="panel-body wt-panel-body p-a20">
                <div className="twm-panel-inner">

                    {/* ===============================
                        ONLINE PROFILE
                    =============================== */}
                    <div className="twm-list-wrap">
                        <div className="twm-list-inner d-flex justify-content-between">
                            <b>Online Profile</b>
                            <a data-bs-toggle="modal" href="#Online_Profile" className="site-text-primary">
                                <span className="fa fa-edit"/>
                            </a>
                        </div>
                        <p>Add link to Online profiles</p>
                    </div>

                    <div className="modal fade" id="Online_Profile">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2>Online Profiles</h2>
                                </div>
                                <div className="modal-body">
                                    <input className="form-control mb-2" placeholder="Profile Name"
                                        onChange={e => setOnlineProfile({ ...onlineProfile, profile_name: e.target.value })}/>
                                    <input className="form-control mb-2" placeholder="URL"
                                        onChange={e => setOnlineProfile({ ...onlineProfile, url: e.target.value })}/>
                                    <textarea className="form-control" placeholder="Description"
                                        onChange={e => setOnlineProfile({ ...onlineProfile, description: e.target.value })}></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button className="site-button" onClick={saveOnlineProfile}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===============================
                        WORK SAMPLE
                    =============================== */}
                    <div className="twm-list-wrap">
                        <div className="twm-list-inner d-flex justify-content-between">
                            <b>Work Sample</b>
                            <a data-bs-toggle="modal" href="#Work_Sample" className="site-text-primary">
                                <span className="fa fa-edit"/>
                            </a>
                        </div>
                        <p>Add project links</p>
                    </div>

                    <div className="modal fade" id="Work_Sample">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header"><h2>Work Sample</h2></div>
                                <div className="modal-body">
                                    <input className="form-control mb-2" placeholder="Title"
                                        onChange={e => setWorkSample({ ...workSample, title: e.target.value })}/>
                                    <input className="form-control mb-2" placeholder="URL"
                                        onChange={e => setWorkSample({ ...workSample, url: e.target.value })}/>
                                    <textarea className="form-control" placeholder="Description"
                                        onChange={e => setWorkSample({ ...workSample, description: e.target.value })}></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button className="site-button" onClick={saveWorkSample}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===============================
                        RESEARCH
                    =============================== */}
                    <div className="twm-list-wrap">
                        <div className="twm-list-inner d-flex justify-content-between">
                            <b>Research Publication</b>
                            <a data-bs-toggle="modal" href="#Research_Publication" className="site-text-primary">
                                <span className="fa fa-edit"/>
                            </a>
                        </div>
                    </div>

                    <div className="modal fade" id="Research_Publication">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <input className="form-control mb-2" placeholder="Title"
                                        onChange={e => setResearch({ ...research, title: e.target.value })}/>
                                    <input className="form-control mb-2" placeholder="URL"
                                        onChange={e => setResearch({ ...research, url: e.target.value })}/>
                                    <textarea className="form-control"
                                        onChange={e => setResearch({ ...research, description: e.target.value })}></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button className="site-button" onClick={saveResearch}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===============================
                        PRESENTATION
                    =============================== */}
                    <div className="twm-list-wrap">
                        <div className="twm-list-inner d-flex justify-content-between">
                            <b>Presentation</b>
                            <a data-bs-toggle="modal" href="#Presentation_modal" className="site-text-primary">
                                <span className="fa fa-edit"></span>
                            </a>
                        </div>
                    </div>

                    <div className="modal fade" id="Presentation_modal">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <input className="form-control mb-2" placeholder="Title"
                                        onChange={e => setPresentation({ ...presentation, title: e.target.value })}/>
                                    <input className="form-control mb-2" placeholder="URL"
                                        onChange={e => setPresentation({ ...presentation, url: e.target.value })}/>
                                    <textarea className="form-control"
                                        onChange={e => setPresentation({ ...presentation, description: e.target.value })}></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button className="site-button" onClick={savePresentation}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===============================
                        CERTIFICATION
                    =============================== */}
                    <div className="twm-list-wrap">
                        <div className="twm-list-inner d-flex justify-content-between">
                            <b>Certification</b>
                            <a data-bs-toggle="modal" href="#Certification_modal" className="site-text-primary">
                                <span className="fa fa-edit"/>
                            </a>
                        </div>
                    </div>

                    <div className="modal fade" id="Certification_modal">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <input className="form-control mb-2" placeholder="Certification Name"
                                        onChange={e => setCertification({ ...certification, name: e.target.value })}/>
                                    <input className="form-control mb-2" placeholder="Body"
                                        onChange={e => setCertification({ ...certification, body: e.target.value })}/>
                                </div>
                                <div className="modal-footer">
                                    <button className="site-button" onClick={saveCertification}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===============================
                        PATENT
                    =============================== */}
                    <div className="twm-list-wrap">
                        <div className="twm-list-inner d-flex justify-content-between">
                            <b>Patent</b>
                            <a data-bs-toggle="modal" href="#Patent_modal" className="site-text-primary">
                                <span className="fa fa-edit"/>
                            </a>
                        </div>
                    </div>

                    <div className="modal fade" id="Patent_modal">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <input className="form-control mb-2" placeholder="Title"
                                        onChange={e => setPatent({ ...patent, title: e.target.value })}/>
                                    <input className="form-control mb-2" placeholder="Patent Office"
                                        onChange={e => setPatent({ ...patent, office: e.target.value })}/>
                                </div>
                                <div className="modal-footer">
                                    <button className="site-button" onClick={savePatent}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default SectionCanAccomplishments;
