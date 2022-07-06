import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddForm from './addFrorm';
import Language from './common/language';
import Logout from './common/logout';
import ListData from './list';

function Dashboard() {

    const { t } = useTranslation();
    const [tab,setTab] = useState("Add");

    return (
        <>
            <div className = 'd-flex justify-content-between dashboard__container'>
                <Language/>
                <Logout />
            </div>
            <div className = 'd-flex flex-row mt-3 mb-3' >
                <div 
                    className = {` ${tab === "Add" ? "tab" : "tab-selected"} w-50 d-flex justify-content-center`} 
                    onClick = {() => setTab("Add")}
                >
                    {t("Add new +")}
                </div>
                <div 
                    className = {` ${tab === "View" ? "tab" : "tab-selected"} w-50 d-flex justify-content-center`} 
                    onClick = {() => setTab("View")}
                >
                    {t("Veiw Records")}
                </div>
            </div>
            {
                tab === "Add" 
                ? <AddForm />
                : tab === "View"
                ? <ListData />
                : null
            }
        </>
    );
}

export default Dashboard;