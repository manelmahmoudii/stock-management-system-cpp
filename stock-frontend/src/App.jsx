import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // ← Ajoutez Navigate ici
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import Template from "./pages/Template";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ClientPage from "./pages/Client/ClientPage";
import ShopPage from './pages/Client/ShopPage';
import DeliveryManagement from "./pages/DeliveryManagement";
import ProductsAdmin from "./pages/ProductsAdmin";
import TransactionAdmin from "./pages/TransactionsAdmin";
import AddProducts from "./pages/AddProducts";
import EditProduct from "./pages/EditProduct";
import UserList from "./pages/AuthPages/UserList";

export default function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Redirection de la racine vers signin */}
          <Route path="/" element={<Navigate to="/signin" replace />} />

          {/* Routes Admin (protégées, nécessitent rôle admin) */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserProfiles />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/blank" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Blank />
              </ProtectedRoute>
            } />
            <Route path="/template" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Template />
              </ProtectedRoute>
            } />
            <Route path="/form-elements" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <FormElements />
              </ProtectedRoute>
            } />
            <Route path="/basic-tables" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BasicTables />
              </ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Alerts />
              </ProtectedRoute>
            } />
            <Route path="/avatars" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Avatars />
              </ProtectedRoute>
            } />
            <Route path="/badge" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Badges />
              </ProtectedRoute>
            } />
            <Route path="/buttons" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Buttons />
              </ProtectedRoute>
            } />
            <Route path="/images" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Images />
              </ProtectedRoute>
            } />
            <Route path="/videos" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Videos />
              </ProtectedRoute>
            } />
            <Route path="/line-chart" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <LineChart />
              </ProtectedRoute>
            } />
            <Route path="/bar-chart" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BarChart />
              </ProtectedRoute>
            } />
            
            {/* Routes Admin - Produits */}
            <Route path="/ProductsAdmin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProductsAdmin />
              </ProtectedRoute>
            } />
            <Route path="/ProductsAdmin/AddProducts" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddProducts />
              </ProtectedRoute>
            } />
            <Route path="/ProductsAdmin/EditProduct/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditProduct />
              </ProtectedRoute>
            } />
            
            {/* Routes Admin - Transactions et Livraisons */}
            <Route path="/transactionsAdmin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TransactionAdmin />
              </ProtectedRoute>
            } />
            <Route path="/delivery" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DeliveryManagement />
              </ProtectedRoute>
            } />
            
            {/* Routes Admin - Utilisateurs */}
            <Route path="/UserList" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserList />
              </ProtectedRoute>
            } />
          </Route>

          {/* Routes Client (protégées, nécessitent rôle client ou admin) */}
          <Route path="/client" element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientPage />
            </ProtectedRoute>
          } />
          <Route path="/shop" element={
            <ProtectedRoute allowedRoles={['client']}>
              <ShopPage />
            </ProtectedRoute>
          } />

          {/* Routes Auth (publiques) */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}