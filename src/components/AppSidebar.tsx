import { Home,User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useAuth } from "./auth/hooks/useAuth";
import { Button } from "./ui/button";

const menuItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: User, label: 'Profiles', to: '/profiles' },
];

export function AppSidebar() {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link to={item.to}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooter>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}

