import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { Home } from '@/pages/Home';
import { RolesPage } from '@/pages/RolesPage';
import { RoleEditor } from '@/pages/RoleEditor';
import { ScenariosPage } from '@/pages/ScenariosPage';
import { ScenarioEditor } from '@/pages/ScenarioEditor';
import { NewGame } from '@/pages/NewGame';
import { RoleDistribution } from '@/pages/RoleDistribution';
import { GamePlay } from '@/pages/GamePlay';
import { SettingsPage } from '@/pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-20 md:pb-0 md:pt-16">
        <NavBar />
        <main className="max-w-5xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/roles/new" element={<RoleEditor />} />
            <Route path="/roles/:id" element={<RoleEditor />} />
            <Route path="/scenarios" element={<ScenariosPage />} />
            <Route path="/scenarios/new" element={<ScenarioEditor />} />
            <Route path="/scenarios/:id" element={<ScenarioEditor />} />
            <Route path="/new-game" element={<NewGame />} />
            <Route path="/game/:id" element={<GamePlay />} />
            <Route path="/game/:id/distribution" element={<RoleDistribution />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
