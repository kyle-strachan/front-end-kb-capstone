import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Paper from "@mui/material/Paper";
import DocTree from "../components/DocTree";
import RequestsOverview from '../components/RequestsOverview';
import DocSearch from '../components/DocSearchBox';
import { useLoading } from "../context/LoadingContext";
import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import PlaceholderMaintenanceRequest from '../components/PlaceholderMaintenanceRequest';
import PlaceholderPurchaseRequest from '../components/PlaceholderPurchaseRequistion';
import PlaceholderAmenityOrder from '../components/PlaceholderAmenityOrder';
import PlaceholderSalesInquiries from '../components/PlaceholderSalesInquiries';
import PlaceholderWebsiteRequest from '../components/PlaceholderWebsiteRequest';
import PlaceholderItRequest from '../components/PlaceholderItRequest';

export default function Dashboard() {
    const { loading, setLoading } = useLoading();
    return (
        <div style={{ maxWidth: "1280px", height: "vh", margin: "0 auto", padding: "1rem" }}>
            {/* <h2>Dashboard</h2> */}
            <div style={{ display: "flex", flexDirection: "row", gap: "1rem", width: "100%" }}>
                <div>
                    <Paper style={{ width: "300px" }}>
                        <DocSearch />
                    </Paper>
                    <Paper style={{ width: "300px", marginBottom: "1rem" }}>
                        <DocTree />
                    </Paper>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>

                    <div style={{ width: "100%" }}>
                        <RequestsOverview />
                    </div>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant='h2'>Future Development Modules</Typography>
                        <Alert sx={{ mb: 2 }} severity="info"><b>Capstone Submission Note</b><br />The following tiles are examples of future modules that will be added, utilising the project's existing user and permissions configuration. Maintenance Requests and Purchase Requests will follow a similar ticket and approval process as the project's Request System Access. These module are out of scope of this submission.</Alert>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "1rem"
                        }}>
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
