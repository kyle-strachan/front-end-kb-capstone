import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Paper from "@mui/material/Paper";
import DocTree from "../components/DocTree";
import RequestsOverview from '../components/RequestsOverview';
import DocSearchBox from '../components/DocSearchBox';
import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import PlaceholderMaintenanceRequest from '../components/PlaceholderMaintenanceRequest';
import PlaceholderPurchaseRequest from '../components/PlaceholderPurchaseRequistion';
import PlaceholderAmenityOrder from '../components/PlaceholderAmenityOrder';
import PlaceholderSalesInquiries from '../components/PlaceholderSalesInquiries';
import PlaceholderWebsiteRequest from '../components/PlaceholderWebsiteRequest';
import PlaceholderItRequest from '../components/PlaceholderItRequest';
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div style={{ maxWidth: "1280px", height: "vh", margin: "0 auto", padding: "1rem" }}>
            <div className="dashboard-two-column">
                <div className="dashboard-left-column">
                    <Paper style={{ width: "100%" }}>
                        <DocSearchBox />
                    </Paper>
                    <Paper style={{ width: "100%", marginBottom: "1rem" }}>
                        <DocTree />
                    </Paper>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>

                    {user?.uiFlags?.enableAccessRequests && (<div style={{ width: "100%" }}>
                        <RequestsOverview />
                    </div>)}

                    <Paper sx={{ p: 3 }}>
                        <Typography variant='h2'>Future Development Modules</Typography>
                        <Alert sx={{ mb: 2 }} severity="info"><b>Capstone Submission Note</b><br />The following tiles are examples of future modules that will
                            be added, utilising the project's existing user and permissions configuration. Maintenance Requests and Purchase Requests will follow
                            a similar ticket and approval process as the project's Request System Access. These module are out of scope of this submission.</Alert>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "1rem"
                        }}>
                            {/* The core app isn't focused on basic users, therefore dashboard was looking empty. */}
                            {/* These indicate what the app is intended to look like. */}
                            <PlaceholderMaintenanceRequest />
                            <PlaceholderPurchaseRequest />
                            <PlaceholderAmenityOrder />
                            <PlaceholderSalesInquiries />
                            <PlaceholderWebsiteRequest />
                            <PlaceholderItRequest />
                        </div>
                    </Paper>
                </div>
            </div>
        </div>
    );
}
