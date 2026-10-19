import React, { useState } from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Navbar } from './components/Navbar';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { LayersPanel } from './components/LayersPanel';
import { InspectorPanel } from './components/InspectorPanel';
import { HandoffPanel } from './components/HandoffPanel';
import { TokensPanel } from './components/TokensPanel';
import { AIAgentsPanel } from './components/AIAgentsPanel';
import { AnimationPreviewModal } from './components/AnimationPreviewModal';
import { DeepSeekSettingsModal } from './components/DeepSeekSettingsModal';

const StudioWorkspace: React.FC = () => {
  const { activeTab } = useStudio();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-studio-bg text-studio-text select-none">
      {/* Top Navbar */}
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Far-Left Vector Tools Toolbar */}
        <Toolbar />

        {/* Dynamic Context Panel (AI Agents, Layers, Tokens, or Handoff) */}
        {activeTab === 'ai' && <AIAgentsPanel onOpenSettings={() => setIsSettingsOpen(true)} />}
        {activeTab === 'layers' && <LayersPanel />}
        {activeTab === 'tokens' && <TokensPanel />}
        {activeTab === 'inspect' && <HandoffPanel />}

        {/* Center Infinite Vector Canvas */}
        <Canvas />

        {/* Right Properties Inspector */}
        <InspectorPanel />
      </div>

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
