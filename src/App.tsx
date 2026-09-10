import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { RoleSwitcherModal } from './components/layout/RoleSwitcherModal';
import { AdminSystemeDashboard } from './components/dashboards/AdminSystemeDashboard';
import { DirecteurGeneralDashboard } from './components/dashboards/DirecteurGeneralDashboard';
import { DirecteurAdjointDashboard } from './components/dashboards/DirecteurAdjointDashboard';
import { ChefAgenceDashboard } from './components/dashboards/ChefAgenceDashboard';
import { AssistantAdministratifDashboard } from './components/dashboards/AssistantAdministratifDashboard';
import { AgentPolyvalentDashboard } from './components/dashboards/AgentPolyvalentDashboard';
import { AgentSpecializedDashboard } from './components/dashboards/AgentSpecializedDashboard';
import { MembreDashboard } from './components/dashboards/MembreDashboard';
import { RequerantMembreDashboard } from './components/dashboards/RequerantMembreDashboard';
import { ArchitectureAuditReport } from './components/architecture/ArchitectureAuditReport';
import { ChatView } from './components/chat/ChatView';

import { UserModal } from './components/modals/UserModal';
import { AgencyModal } from './components/modals/AgencyModal';
import { TransactionModal } from './components/modals/TransactionModal';
import { BroadcastModal } from './components/modals/BroadcastModal';
import { SmsRuleModal } from './components/modals/SmsRuleModal';
import { User, Agence } from './types';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modal States
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState<boolean>(false);
  const [agencyToEdit, setAgencyToEdit] = useState<Agence | undefined>(undefined);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState<boolean>(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [isSmsRuleModalOpen, setIsSmsRuleModalOpen] = useState<boolean>(false);

  // Set default active tab whenever user role changes
  useEffect(() => {
    switch (currentUser.role) {
      case 'administrateur_systeme':
        setActiveTab('admin_overview');
        break;
      case 'directeur_general':
        setActiveTab('dg_overview');
        break;
      case 'directeur_adjoint':
        setActiveTab('da_overview');
        break;
      case 'chef_agence':
        setActiveTab('ca_overview');
        break;
      case 'assistant_administratif':
        setActiveTab('aa_overview');
        break;
      case 'agent':
        setActiveTab(currentUser.agentCategory === 'agent_polyvalent' ? 'poly_unified' : 'agent_overview');
        break;
      case 'membre':
        setActiveTab('membre_overview');
        break;
      case 'requerant_membre':
        setActiveTab('req_overview');
        break;
      default:
        setActiveTab('admin_overview');
    }
  }, [currentUser.role, currentUser.agentCategory]);

  const handleOpenEditUser = (user: User) => {
    setUserToEdit(user);
    setIsUserModalOpen(true);
  };

  const handleOpenCreateUser = () => {
    setUserToEdit(undefined);
    setIsUserModalOpen(true);
  };

  const handleOpenCreateAgency = () => {
    setAgencyToEdit(undefined);
    setIsAgencyModalOpen(true);
  };

  const renderCurrentView = () => {
    // Internal Enterprise Chat Module
    if (activeTab === 'chat_internal') {
      return <ChatView />;
    }

    // If the audit report tab is clicked specifically
    if (activeTab === 'admin_audit_report') {
      return <ArchitectureAuditReport />;
    }

    switch (currentUser.role) {
      case 'administrateur_systeme':
        return (
          <AdminSystemeDashboard
            activeTab={activeTab}
            onOpenCreateUser={handleOpenCreateUser}
            onOpenEditUser={handleOpenEditUser}
            onOpenCreateAgency={handleOpenCreateAgency}
            onOpenAddSmsRule={() => setIsSmsRuleModalOpen(true)}
            onOpenAuditReport={() => setActiveTab('admin_audit_report')}
          />
        );

      case 'directeur_general':
        return (
          <DirecteurGeneralDashboard
            activeTab={activeTab}
            onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
          />
        );

      case 'directeur_adjoint':
        return <DirecteurAdjointDashboard activeTab={activeTab} />;

      case 'chef_agence':
        return <ChefAgenceDashboard onOpenNewOperation={() => setIsTransactionModalOpen(true)} />;

      case 'assistant_administratif':
        return <AssistantAdministratifDashboard activeTab={activeTab} />;

      case 'agent':
        if (currentUser.agentCategory === 'agent_polyvalent') {
          return (
            <AgentPolyvalentDashboard
              subModule={activeTab}
              onOpenNewOperation={() => setIsTransactionModalOpen(true)}
            />
          );
        }
        return (
          <AgentSpecializedDashboard
            onOpenNewOperation={() => setIsTransactionModalOpen(true)}
          />
        );

      case 'membre':
        return <MembreDashboard />;

      case 'requerant_membre':
        return <RequerantMembreDashboard />;

      default:
        return (
          <div className="p-8 text-center text-slate-400">
            Rôle non reconnu ou en cours de chargement.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Application Header */}
      <Header
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onOpenChat={() => setActiveTab('chat_internal')}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dynamic Sidebar according to the 8 official roles */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        />

        {/* Dynamic Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Modals */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userToEdit={userToEdit}
      />

      <AgencyModal
        isOpen={isAgencyModalOpen}
        onClose={() => setIsAgencyModalOpen(false)}
        agencyToEdit={agencyToEdit}
      />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />

      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
      />

      <SmsRuleModal
        isOpen={isSmsRuleModalOpen}
        onClose={() => setIsSmsRuleModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
