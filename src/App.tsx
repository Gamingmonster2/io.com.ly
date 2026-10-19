import React, { useState } from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Navbar } from './components/Navbar';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { LayersPanel } from './components/LayersPanel';
import { InspectorPanel } from './components/InspectorPanel';
import { HandoffPanel } from './components/HandoffPanel';
import { TokensPanel } from './components/TokensPanel';
import { BottomAIAgentBar } from './components/BottomAIAgentBar';
import { AnimationPreviewModal } from './components/AnimationPreviewModal';
import { DeepSeekSettingsModal } from './components/DeepSeekSettingsModal';

const StudioWorkspace: React.FC = () => {
  const { activeTab, isLeftSidebarOpen } = useStudio();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-studio-bg text-studio-text select-none">
      {/* Top Navbar */}
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Spacious Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Leftmost Vector Tools Toolbar */}
        <Toolbar />

        {/* Collapsible Left Panel (Only shown when toggled open) */}
        {isLeftSidebarOpen && (
          <>
            {activeTab === 'layers' && <LayersPanel />}
            {activeTab === 'tokens' && <TokensPanel />}
            {activeTab === 'inspect' && <HandoffPanel />}
          </>
        )}

        {/* Huge Full-Width Infinite Canvas */}
        <Canvas />

        {/* Collapsible Properties Inspector on the right */}
        <InspectorPanel />
      </div>

      {/* Sleek Bottom AI Agent Bar (Fixed Dock at Bottom) */}
      <BottomAIAgentBar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Modals */}
      <AnimationPreviewModal />
      <DeepSeekSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <StudioWorkspace />
    </StudioProvider>
  );
}
