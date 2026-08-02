import './styles/App.css'
import { tipoUsuario, rotaPrincipal } from "./globals.js"
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import InterfacePrincipal from './pages/InterfacePrincipal';
import InterfaceProf from './pages/InterfacePrincipalProfessor';
import InterfaceRedacao from './pages/InterfaceRedacao';
import InterfaceCriarRedacao from './pages/InterfaceCriarRedacao';
import InterfaceCorrecao from './pages/InterfaceCorrecao';
import InterfaceAreaAluno from './pages/InterfaceAreaAluno';
import InterfaceAreaCorretor from './pages/InterfaceAreaCorretor';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to={rotaPrincipal} replace />}/>
          <Route path="/student" element={<InterfacePrincipal/>}/>
          <Route path="/professor" element={<InterfaceProf/>}/>
          <Route path="/proposta/:id" element={<InterfaceRedacao/>}/>
          <Route path="/criar_redacao" element={<InterfaceCriarRedacao/>}/>
          <Route path="/correcao/:id" element={<InterfaceCorrecao readOnly={true}/>}/>
          <Route path="/corrigir/:id" element={<InterfaceCorrecao readOnly={false}/>}/>
          <Route path="/area_aluno" element={<InterfaceAreaAluno/>}/>
          <Route path="/area_corretor" element={<InterfaceAreaCorretor/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
