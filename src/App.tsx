import { Route, Routes } from "react-router-dom";

import RacePage from "@/pages/race";
import CompetitorsPage from "@/pages/competitors";

function App() {
  return (
    <Routes>
      <Route element={<CompetitorsPage />} path="/" />
      <Route element={<CompetitorsPage />} path="/competitors" />
      <Route element={<RacePage />} path="/race" />
    </Routes>
  );
}

export default App;
