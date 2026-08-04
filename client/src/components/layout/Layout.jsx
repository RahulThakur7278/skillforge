import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, title = 'SkillForge' }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <Header title={title} />
      <main className="main-content">
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
