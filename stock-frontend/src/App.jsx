import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

import ProductsAdmin from "./pages/ProductsAdmin";
import TransactionAdmin from "./pages/TransactionsAdmin";
import AddProducts from "./pages/AddProducts";
import EditProduct from "./pages/EditProduct";
export default function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,       // ✅ supprime warning 1
        v7_relativeSplatPath: true,     // ✅ supprime warning 2
      }}
    >
      <ScrollToTop />
      <Routes>

        {/* Dashboard Layout - Admin */}
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/template" element={<Template />} />
          <Route path="/error-404" element={<NotFound />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
          <Route path="/ProductsAdmin" element={<ProductsAdmin />} />
          <Route path="/transactionsAdmin" element={<TransactionAdmin />} />
          <Route path="/ProductsAdmin/AddProducts" element={<AddProducts />} />

          <Route path="/ProductsAdmin/EditProduct/:id" element={<EditProduct />} />

        </Route>

        {/* ✅ Interface Client - HORS AppLayout */}
        <Route path="/client" element={<ClientPage />} />
        <Route path="/shop" element={<ShopPage />} />

        

        {/* Auth */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}
