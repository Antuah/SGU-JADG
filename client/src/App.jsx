import TestController from "./modules/test/test.controller";
import UserList from "./modules/user/UserList";

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a href="/" className="navbar-brand">
            SGU-JADG-10A - Sistema de Gestión de Usuarios
          </a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="navbar-item">
                <button onClick={() => TestController.callToAPI()} className="btn btn-outline-light btn-sm">
                  Test API
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <UserList />
      </div>
    </>
  );
}

export default App;
