import Sidebar from './Sidebar.jsx';

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>

    </div>
  );
}