import Header from './app/shell/Header';
import Main from './app/shell/Main';
import Sidebar from './app/shell/Sidebar';

function App() {
  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <Main />
    </div>
  );
}

export default App;
