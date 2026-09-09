import './styles/App.css'
import { tipoUsuario, rotaPrincipal, rotaArea } from "./globals"
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import InterfacePrincipal from './pages/InterfacePrincipal.jsx';
import InterfaceProf from './pages/InterfacePrincipalProfessor.jsx';
import InterfaceRedacao from './pages/InterfaceRedacao.jsx';
import InterfaceCriarRedacao from './pages/InterfaceCriarRedacao.jsx';
import InterfaceCorrecao from './pages/InterfaceCorrecao.jsx';
import InterfaceAreaAluno from './pages/InterfaceAreaAluno.jsx';
import InterfaceAreaCorretor from './pages/InterfaceAreaCorretor.jsx';
import InterfaceMinhasPropostas from './pages/InterfaceMinhasPropostas.jsx';
import InterfaceEditarProposta from './pages/InterfaceEditarProposta.jsx';



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
          <Route path="/proposta/edit/:id" element={<InterfaceEditarProposta/>}/>
          <Route path="/correcao/:id" element={<InterfaceCorrecao readOnly={true}/>}/>
          <Route path="/corrigir/:id" element={<InterfaceCorrecao readOnly={false}/>}/>
          <Route path="/area" element={<Navigate to={rotaArea} replace />}/>
          <Route path="/area_aluno" element={<InterfaceAreaAluno/>}/>
          <Route path="/area_corretor" element={<InterfaceAreaCorretor/>}/>
          <Route path="/minhas_propostas" element={<InterfaceMinhasPropostas/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
