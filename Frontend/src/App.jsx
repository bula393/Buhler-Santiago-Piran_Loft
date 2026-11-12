import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import RouteFocus from "./components/RouteFocus.jsx";
import NotificationList from "./components/NotificationList.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import UnidadDetallePage from "./pages/UnidadDetallePage.jsx";
import UnidadFormPage from "./pages/UnidadFormPage.jsx";
import UnidadesPage from "./pages/UnidadesPage.jsx";
import GestionPage from "./pages/GestionPage.jsx";
import { RUTAS } from "./utils/constants.js";

function App() {
  return (
    <>
      <Header />
      <main id="contenido-principal" className="contenedor" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Navigate to={RUTAS.inicio} replace />} />
          <Route path={RUTAS.unidades} element={<UnidadesPage />} />
          <Route path={RUTAS.nuevaUnidad} element={<UnidadFormPage />} />
          <Route path="/unidades/:id" element={<UnidadDetallePage />} />
          <Route path="/unidades/:id/editar" element={<UnidadFormPage />} />
          {["reservas", "huespedes", "pagos", "resenas"].map((recurso) => (
            <Route key={recurso} path={`/${recurso}`} element={<GestionPage key={recurso} recurso={recurso} />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <RouteFocus />
      <NotificationList />
    </>
  );
}

export default App;
