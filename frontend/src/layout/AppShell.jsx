import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import TaskAssistant from '../components/TaskAssistant';

export default function AppShell() {
  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          title="Warehouse Master"
          subtitle="Centro de control logístico"
        />
        <main className="flex-1 px-8 py-8">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <TaskAssistant />
    </div>
  );
}
