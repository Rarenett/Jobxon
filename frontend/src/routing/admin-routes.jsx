import { Route, Routes } from "react-router-dom";
import { admin } from "../globals/route-names";
import AdminDashboardPage from "../app/pannels/admin/components/admin-dashboard";
import AdminCompanyProfilePage from "../app/pannels/admin/components/admin-company-profile";
import AdminPostAJobPage from "../app/pannels/admin/components/jobs/admin-post-a-job";
import AdminManageJobsPage from "../app/pannels/admin/components/jobs/admin-manage-jobs";
import AdminCandidatesPage from "../app/pannels/admin/components/admin-candidates";
import AdminBookmarksPage from "../app/pannels/admin/components/admin-bookmarks";
import JobBookmarksPage from "../app/pannels/admin/components/job-bookmarks";

import AdminPackagesPage from "../app/pannels/admin/components/admin-packages";
import AdminMessages1Page from "../app/pannels/admin/components/messages/admin-messages1";
import AdminMessages2Page from "../app/pannels/admin/components/messages/admin-messages2";
import AdminResumeAlertsPage from "../app/pannels/admin/components/admin-resume-alerts";
import Error404Page from "../app/pannels/public-user/components/pages/error404";

import AdminALLCANDIDATES from "../app/pannels/public-user/components/candidates/can-list";
import AdminAPPLIEDCANDIDATES from "../app/pannels/public-user/components/candidates/can-detail2";

import AdminCompaniesPage from "../app/pannels/admin/components/AdminCompaniesPage";

function AdminRoutes() {
    return (
        <Routes>
            <Route path={admin.DASHBOARD} element={<AdminDashboardPage />} />
            <Route path={admin.PROFILE} element={<AdminCompanyProfilePage />} />
            <Route path={admin.POST_A_JOB} element={<AdminPostAJobPage />} />
            <Route path={admin.MANAGE_JOBS} element={<AdminManageJobsPage />} />
            <Route path={admin.CANDIDATES} element={<AdminCandidatesPage />} />
            <Route path={admin.AllCANDIDATES} element={<AdminALLCANDIDATES />} />
            <Route path={admin.VIEW_APPLIED_CANDIDATES} element={<AdminAPPLIEDCANDIDATES />} />

            <Route path={admin.BOOKMARKS} element={<JobBookmarksPage />} />
                        <Route path={admin.CAND_BOOKMARKS} element={<AdminBookmarksPage />} />

            <Route path={admin.PACKAGES} element={<AdminPackagesPage />} />
            <Route path={admin.MESSAGES1} element={<AdminMessages1Page />} />
            <Route path={admin.MESSAGES2} element={<AdminMessages2Page />} />
            <Route path={admin.RESUME_ALERTS} element={<AdminResumeAlertsPage />} />
            <Route path={admin.COMPANY_LIST} element={<AdminCompaniesPage />} />

            <Route path="*" element={<Error404Page />} />
        </Routes>
    )
}

export default AdminRoutes;