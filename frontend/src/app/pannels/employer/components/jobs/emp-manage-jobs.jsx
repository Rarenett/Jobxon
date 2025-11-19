import JobZImage from "../../../../common/jobz-img";

function EmpManageJobsPage() {
    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Manage Jobs</h2>
                <div className="breadcrumbs"><a href="#">Home</a><a href="#">Dasboard</a><span>My Job Listing</span></div>
            </div>
            {/*Basic Information*/}
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0"><i className="fa fa-suitcase" /> Job Details</h4>
                </div>
                <div className="panel-body wt-panel-body p-a20 m-b30 ">
                    <div className="twm-D_table p-a20 table-responsive">
                        <table id="jobs_bookmark_table" className="table table-bordered twm-bookmark-list-wrap">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Category</th>
                                    <th>Job Types</th>
                                    <th>Applications</th>
                                    <th>Created &amp; Expired</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*1*/}
                                <tr>
                                    <td>
                                        <div className="twm-bookmark-list">
                                            <div className="twm-media">
                                                <div className="twm-media-pic">
                                                    <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-mid-content">
                                                <a href="#" className="twm-job-title">
                                                    <h4>Senior Web Designer</h4>
                                                    <p className="twm-bookmark-address">
                                                        <i className="feather-map-pin" />1363-1385 Sunset Blvd Los Angeles, CA 90026, USA
                                                    </p>
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Web Designer</td>
                                    <td><div className="twm-jobs-category"><span className="twm-bg-green">Part Time</span></div></td>
                                    <td><a href="#" className="site-text-primary">03 Applied</a></td>
                                    <td>
                                        <div>08/06/2023</div>
                                        <div>28/06/2023</div>
                                    </td>
                                    <td>
                                        <div className="twm-table-controls">
                                            <ul className="twm-DT-controls-icon list-unstyled">
                                                <li>
                                                    <button title="View profile" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="fa fa-eye" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Edit" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-edit" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Delete" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-trash-alt" />
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                {/*2*/}
                                <tr>
                                    <td>
                                        <div className="twm-bookmark-list">
                                            <div className="twm-media">
                                                <div className="twm-media-pic">
                                                    <JobZImage src="images/jobs-company/pic2.jpg" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-mid-content">
                                                <a href="#" className="twm-job-title">
                                                    <h4>Sr. Rolling Stock Technician</h4>
                                                    <p className="twm-bookmark-address">
                                                        <i className="feather-map-pin" />1363-1385 Sunset Blvd Los Angeles, CA 90026, USA
                                                    </p>
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Product Manager</td>
                                    <td><div className="twm-jobs-category"><span className="twm-bg-brown">Intership</span></div></td>
                                    <td><a href="#" className="site-text-primary">05 Applied</a></td>
                                    <td>
                                        <div>08/06/2023</div>
                                        <div>28/06/2023</div>
                                    </td>
                                    <td>
                                        <div className="twm-table-controls">
                                            <ul className="twm-DT-controls-icon list-unstyled">
                                                <li>
                                                    <button title="View profile" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="fa fa-eye" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Edit" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-edit" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Delete" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-trash-alt" />
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                {/*3*/}
                                <tr>
                                    <td>
                                        <div className="twm-bookmark-list">
                                            <div className="twm-media">
                                                <div className="twm-media-pic">
                                                    <JobZImage src="images/jobs-company/pic3.jpg" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-mid-content">
                                                <a href="#" className="twm-job-title">
                                                    <h4>IT Department Manager</h4>
                                                    <p className="twm-bookmark-address">
                                                        <i className="feather-map-pin" />1363-1385 Sunset Blvd Los Angeles, CA 90026, USA
                                                    </p>
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td>PHP Developer</td>
                                    <td><div className="twm-jobs-category"><span className="twm-bg-purple">Fulltime</span></div></td>
                                    <td><a href="#" className="site-text-primary">06 Applied</a></td>
                                    <td>
                                        <div>08/06/2023</div>
                                        <div>28/06/2023</div>
                                    </td>
                                    <td>
                                        <div className="twm-table-controls">
                                            <ul className="twm-DT-controls-icon list-unstyled">
                                                <li>
                                                    <button title="View profile" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="fa fa-eye" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Edit" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-edit" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Delete" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-trash-alt" />
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                {/*4*/}
                                <tr>
                                    <td>
                                        <div className="twm-bookmark-list">
                                            <div className="twm-media">
                                                <div className="twm-media-pic">
                                                    <JobZImage src="images/jobs-company/pic4.jpg" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-mid-content">
                                                <a href="#" className="twm-job-title">
                                                    <h4>Art Production Specialist</h4>
                                                    <p className="twm-bookmark-address">
                                                        <i className="feather-map-pin" />1363-1385 Sunset Blvd Los Angeles, CA 90026, USA
                                                    </p>
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Product Designer</td>
                                    <td><div className="twm-jobs-category"><span className="twm-bg-sky">Freelancer</span></div></td>
                                    <td><a href="#" className="site-text-primary">13 Applied</a></td>
                                    <td>
                                        <div>08/06/2023</div>
                                        <div>28/06/2023</div>
                                    </td>
                                    <td>
                                        <div className="twm-table-controls">
                                            <ul className="twm-DT-controls-icon list-unstyled">
                                                <li>
                                                    <button title="View profile" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="fa fa-eye" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Edit" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-edit" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Delete" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-trash-alt" />
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                {/*5*/}
                                <tr>
                                    <td>
                                        <div className="twm-bookmark-list">
                                            <div className="twm-media">
                                                <div className="twm-media-pic">
                                                    <JobZImage src="images/jobs-company/pic5.jpg" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-mid-content">
                                                <a href="#" className="twm-job-title">
                                                    <h4>Recreation &amp; Fitness Worker</h4>
                                                    <p className="twm-bookmark-address">
                                                        <i className="feather-map-pin" />1363-1385 Sunset Blvd Los Angeles, CA 90026, USA
                                                    </p>
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Gym Trainer</td>
                                    <td><div className="twm-jobs-category"><span className="twm-bg-golden">Temporary</span></div></td>
                                    <td><a href="#" className="site-text-primary">08 Applied</a></td>
                                    <td>
                                        <div>08/06/2023</div>
                                        <div>28/06/2023</div>
                                    </td>
                                    <td>
                                        <div className="twm-table-controls">
                                            <ul className="twm-DT-controls-icon list-unstyled">
                                                <li>
                                                    <button title="View profile" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="fa fa-eye" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Edit" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-edit" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Delete" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-trash-alt" />
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                {/*6*/}
                                <tr>
                                    <td>
                                        <div className="twm-bookmark-list">
                                            <div className="twm-media">
                                                <div className="twm-media-pic">
                                                    <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-mid-content">
                                                <a href="#" className="twm-job-title">
                                                    <h4>Senior Web Designer</h4>
                                                    <p className="twm-bookmark-address">
                                                        <i className="feather-map-pin" />1363-1385 Sunset Blvd Los Angeles, CA 90026, USA
                                                    </p>
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Web Designer</td>
                                    <td><div className="twm-jobs-category"><span className="twm-bg-green">New</span></div></td>
                                    <td><a href="#" className="site-text-primary">14 Applied</a></td>
                                    <td>
                                        <div>08/06/2023</div>
                                        <div>28/06/2023</div>
                                    </td>
                                    <td>
                                        <div className="twm-table-controls">
                                            <ul className="twm-DT-controls-icon list-unstyled">
                                                <li>
                                                    <button title="View profile" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="fa fa-eye" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Edit" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-edit" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Delete" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-trash-alt" />
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                {/*7*/}
                                <tr>
                                    <td>
                                        <div className="twm-bookmark-list">
                                            <div className="twm-media">
                                                <div className="twm-media-pic">
                                                    <JobZImage src="images/jobs-company/pic2.jpg" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-mid-content">
                                                <a href="#" className="twm-job-title">
                                                    <h4>Sr. Rolling Stock Technician</h4>
                                                    <p className="twm-bookmark-address">
                                                        <i className="feather-map-pin" />1363-1385 Sunset Blvd Los Angeles, CA 90026, USA
                                                    </p>
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Product Manager</td>
                                    <td><div className="twm-jobs-category"><span className="twm-bg-green">New</span></div></td>
                                    <td><a href="#" className="site-text-primary">10 Applied</a></td>
                                    <td>
                                        <div>08/06/2023</div>
                                        <div>28/06/2023</div>
                                    </td>
                                    <td>
                                        <div className="twm-table-controls">
                                            <ul className="twm-DT-controls-icon list-unstyled">
                                                <li>
                                                    <button title="View profile" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="fa fa-eye" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Edit" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-edit" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button title="Delete" data-bs-toggle="tooltip" data-bs-placement="top">
                                                        <span className="far fa-trash-alt" />
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Category</th>
                                    <th>Job Types</th>
                                    <th>Applications</th>
                                    <th>Created &amp; Expired</th>
                                    <th>Action</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EmpManageJobsPage;