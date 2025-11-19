import AdminHeaderSection from "../app/pannels/admin/common/admin-header";
import AdminSidebarSection from "../app/pannels/admin/common/admin-sidebar";
import YesNoPopup from "../app/common/popups/popup-yes-no";
import AdminRoutes from "../routing/admin-routes";
import { popupType } from "../globals/constants";
import { useState } from "react";

function AdminLayout() {

    const [sidebarActive, setSidebarActive] = useState(true);

    const handleSidebarCollapse = () => {
        setSidebarActive(!sidebarActive);
    }

    return (
        <>
            <div className="page-wraper">

                <AdminHeaderSection onClick={handleSidebarCollapse} sidebarActive={sidebarActive} />
                <AdminSidebarSection sidebarActive={sidebarActive} />

                <div id="content" className={sidebarActive ? "" : "active"}>
                    <div className="content-admin-main">
                        <AdminRoutes />
                    </div>
                </div>

                <YesNoPopup id="delete-dash-profile" type={popupType.DELETE} msg={"Do you want to delete your profile?"} />
                <YesNoPopup id="logout-dash-profile" type={popupType.LOGOUT} msg={"Do you want to Logout your profile?"} />

            </div>
        </>
    )
}

export default AdminLayout;