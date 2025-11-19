import { Routes, Route } from "react-router-dom";
import { publicUser } from "../globals/route-names";

import PublicUserLayout from "../layouts/public-user-layout";
import EmployerLayout from "../layouts/employer-layout";
import CandidateLayout from "../layouts/candidate-layout";
import { base } from "../globals/route-names";
import AdminLoginPage from "../app/pannels/public-user/components/pages/admin-login";
import AdminLayout from "../layouts/admin-layout";


function AppRoutes() {
    return (
        <Routes>
            <Route path={base.PUBLIC_PRE + "/*"} element={<PublicUserLayout />} />
            <Route path={base.EMPLOYER_PRE + "/*"} element={<EmployerLayout />} />
            <Route path={base.CANDIDATE_PRE + "/*"} element={<CandidateLayout />} />
            <Route path={base.ADMIN_PRE + "/*"} element={<AdminLayout />} />

            <Route path={publicUser.pages.ADMIN_LOGIN} element={<AdminLoginPage />} />

        </Routes>
    )
}

export default AppRoutes;