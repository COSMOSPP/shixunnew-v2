import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserOverview from "./pages/UserOverview";
import UserDashboard from "./pages/UserDashboard";
import UserExperiments from "./pages/UserExperiments";
import UserExams from "./pages/UserExams";
import UserDatasets from "./pages/UserDatasets";
import UserAIAssistant from "./pages/UserAIAssistant";
import UserAIAssistantStudio from "./pages/UserAIAssistantStudio";
import UserAIAgents from "./pages/UserAIAgents";
import UserAIAgentsStudio from "./pages/UserAIAgentsStudio";
import UserProjects from "./pages/UserProjects";
import UserPractices from "./pages/UserPractices";
import SkillBuilder from "./pages/SkillBuilder";
import PracticeChat from "./pages/PracticeChat";
import AICompetition from "./pages/AICompetition";
import CloudCompetition from "./pages/CloudCompetition";
import UserCenterLayout from "./layouts/UserCenterLayout";
import UserCenterProfile from "./pages/user/UserCenterProfile";
import UserCenterQuota from "./pages/user/UserCenterQuota";
import UserCenterProjects from "./pages/user/UserCenterProjects";
import UserCenterFavorites from "./pages/user/UserCenterFavorites";
import UserCenterHistory from "./pages/user/UserCenterHistory";
import UserCenterSecurity from "./pages/user/UserCenterSecurity";
import UserCenterMessages from "./pages/user/UserCenterMessages";
import UserPersona from "./pages/user/UserPersona";
import MyLearning from "./pages/user/MyLearning";
import AdminAILayout from "./layouts/AdminAILayout";
import AdminAICourses from "./pages/admin/AdminAICourses";
import AdminAIExperiments from "./pages/admin/AdminAIExperiments";
import AdminAICompetitions from "./pages/admin/AdminAICompetitions";
import { 
  AdminAI, 
  AdminSecurity, 
  AdminPublicCloud, 
  AdminPrivateCloud, 
  AdminIT, 
  AdminIP, 
  AdminPermissions, 
  AdminSystem 
} from "./pages/admin/AdminPages";
import { 
  SecurityLayout, PublicCloudLayout, PrivateCloudLayout, 
  ITLayout, IPLayout, PermissionsLayout, SystemLayout 
} from "./layouts/AdminLayouts";
import {
  SecurityPolicies, SecurityVulnerabilities, SecurityLogs,
  PublicCloudInstances, PublicCloudStorage, PublicCloudBilling,
  PrivateCloudNodes, PrivateCloudVMs, PrivateCloudClusters,
  ITAssets, ITLicenses, ITTickets,
  IPSubnets, IPAllocations, IPConflicts,
  PermissionsUsers, PermissionsRoles, PermissionsPolicies,
  SystemConfig, SystemCron, SystemLogs
} from "./pages/admin/AdminSubPages";
import SystemTenants from "./pages/admin/SystemTenants";
import SystemBilling from "./pages/admin/SystemBilling";
import SystemResources from "./pages/admin/SystemResources";
import SystemSecurity from "./pages/admin/SystemSecurity";

import LoginUser from "./pages/LoginUser";
import LoginTeacher from "./pages/LoginTeacher";

import TeacherLayout from "./layouts/TeacherLayout";
import TeacherHome from "./pages/teacher/TeacherHome";
import TeacherQuestions from "./pages/teacher/TeacherQuestions";
import TeacherPapers from "./pages/teacher/TeacherPapers";
import TeacherResources from "./pages/teacher/TeacherResources";
import TeacherCourseManage from "./pages/teacher/TeacherCourseManage";
import TeacherExperimentIDE from "./pages/teacher/TeacherExperimentIDE";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherAssignmentPreview from "./pages/teacher/TeacherAssignmentPreview";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="competition/ai" element={<AICompetition />} />
          <Route path="competition/cloud" element={<CloudCompetition />} />
        </Route>
        
        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/user" element={<LoginUser />} />
        <Route path="/login/teacher" element={<LoginTeacher />} />

        {/* Skill Builder & Practice Chat (Full Screen) */}
        <Route path="/skill-builder" element={<SkillBuilder />} />
        <Route path="/practice-chat" element={<PracticeChat />} />

        {/* Teacher Dashboard */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherHome />} />
          <Route path="course/:id" element={<TeacherCourseManage />} />
          <Route path="course/:id/assignment-preview" element={<TeacherAssignmentPreview />} />
          <Route path="course/:id/experiment/:experimentId" element={<TeacherExperimentIDE />} />
          <Route path="questions" element={<TeacherQuestions />} />
          <Route path="papers" element={<TeacherPapers />} />
          <Route path="resources" element={<TeacherResources />} />
          <Route path="students" element={<TeacherStudents />} />
        </Route>

        {/* User Dashboard */}
        <Route path="/user" element={<DashboardLayout type="user" />}>
          <Route index element={<UserOverview />} />
          <Route path="center" element={<UserCenterLayout />}>
            <Route index element={<Navigate to="/user/center/profile" replace />} />
            <Route path="profile" element={<UserCenterProfile />} />
            <Route path="quota" element={<UserCenterQuota />} />
            <Route path="projects" element={<UserCenterProjects />} />
            <Route path="favorites" element={<UserCenterFavorites />} />
            <Route path="history" element={<UserCenterHistory />} />
            <Route path="security" element={<UserCenterSecurity />} />
            <Route path="messages" element={<UserCenterMessages />} />
          </Route>
          <Route path="projects" element={<UserProjects />} />
          <Route path="practices" element={<UserPractices />} />
          <Route path="datasets" element={<UserDatasets />} />
          <Route path="ai/assistant" element={<UserAIAssistant />} />
          <Route path="ai/assistant/studio" element={<UserAIAssistantStudio />} />
          <Route path="ai/agents" element={<UserAIAgents />} />
          <Route path="ai/agents/studio" element={<UserAIAgentsStudio />} />
          <Route path="courses" element={<UserDashboard />} />
          <Route path="experiments" element={<UserExperiments />} />
          <Route path="exams" element={<UserExams />} />
          <Route path="persona" element={<UserPersona />} />
          <Route path="mylearning" element={<MyLearning />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<DashboardLayout type="admin" />}>
          <Route index element={<Navigate to="/admin/ai" replace />} />
          <Route path="ai" element={<AdminAILayout />}>
            <Route index element={<AdminAI />} />
            <Route path="courses" element={<AdminAICourses />} />
            <Route path="experiments" element={<AdminAIExperiments />} />
            <Route path="competitions" element={<AdminAICompetitions />} />
          </Route>
          <Route path="security" element={<SecurityLayout />}>
            <Route index element={<AdminSecurity />} />
            <Route path="policies" element={<SecurityPolicies />} />
            <Route path="vulnerabilities" element={<SecurityVulnerabilities />} />
            <Route path="logs" element={<SecurityLogs />} />
          </Route>
          <Route path="public-cloud" element={<PublicCloudLayout />}>
            <Route index element={<AdminPublicCloud />} />
            <Route path="instances" element={<PublicCloudInstances />} />
            <Route path="storage" element={<PublicCloudStorage />} />
            <Route path="billing" element={<PublicCloudBilling />} />
          </Route>
          <Route path="private-cloud" element={<PrivateCloudLayout />}>
            <Route index element={<AdminPrivateCloud />} />
            <Route path="nodes" element={<PrivateCloudNodes />} />
            <Route path="vms" element={<PrivateCloudVMs />} />
            <Route path="clusters" element={<PrivateCloudClusters />} />
          </Route>
          <Route path="it" element={<ITLayout />}>
            <Route index element={<AdminIT />} />
            <Route path="assets" element={<ITAssets />} />
            <Route path="licenses" element={<ITLicenses />} />
            <Route path="tickets" element={<ITTickets />} />
          </Route>
          <Route path="ip" element={<IPLayout />}>
            <Route index element={<AdminIP />} />
            <Route path="subnets" element={<IPSubnets />} />
            <Route path="allocations" element={<IPAllocations />} />
            <Route path="conflicts" element={<IPConflicts />} />
          </Route>
          <Route path="permissions" element={<PermissionsLayout />}>
            <Route index element={<AdminPermissions />} />
            <Route path="users" element={<PermissionsUsers />} />
            <Route path="roles" element={<PermissionsRoles />} />
            <Route path="policies" element={<PermissionsPolicies />} />
          </Route>
          <Route path="system" element={<SystemLayout />}>
            <Route index element={<Navigate to="/admin/system/tenants" replace />} />
            <Route path="tenants" element={<SystemTenants />} />
            <Route path="billing" element={<SystemBilling />} />
            <Route path="resources" element={<SystemResources />} />
            <Route path="security" element={<SystemSecurity />} />
            <Route path="settings" element={<SystemConfig />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}
