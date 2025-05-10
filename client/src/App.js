// komponenta je obyčejná funkce
// komponenta má stejný název jako je název souboru
// komponenta obsahuje return
// na konci souboru musí být řádek s exportem
// v return musí něco být
// return dokáže vrátit pouze jeden tag (musí se obalit-např.<div>....</div> nebo použít mrtvé závorky <>...</> vyhneme se pak vnořeným "divům")

import './App.css';
import Layout from './components/Layout';
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  return (
    <div>
      <Layout/>
    </div>
  )
}

export default App;
