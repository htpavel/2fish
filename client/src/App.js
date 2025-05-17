// komponenta je obyčejná funkce
// komponenta má stejný název jako je název souboru
// komponenta obsahuje return
// na konci souboru musí být řádek s exportem
// v return musí něco být
// return dokáže vrátit pouze jeden tag (musí se obalit-např.<div>....</div> nebo použít mrtvé závorky <>...</> vyhneme se pak vnořeným "divům")

import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorPage from "./components/ErrorPage";
import Layout from './components/Layout';
import Dashboard from "./components/Dashboard";
import Summary from "./components/Summary";
import Species from "./components/Species";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="/" element={<Dashboard />} />
          <Route path="/species" element={<Species />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
