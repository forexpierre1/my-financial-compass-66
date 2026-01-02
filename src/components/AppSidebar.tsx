import { 
  LayoutDashboard, 
  Target, 
  Wallet, 
  PiggyBank, 
  TrendingUp,
  Settings,
  Crown,
  LogOut,
  Star,
  Search
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Objectifs", url: "/objectives", icon: Target },
  { title: "Budget", url: "/budget", icon: Wallet },
  { title: "Portefeuille", url: "/portfolio", icon: TrendingUp },
  { title: "Watchlist", url: "/watchlist", icon: Star },
  { title: "Analyseur", url: "/analyzer", icon: Search },
  { title: "Patrimoine", url: "/patrimony", icon: PiggyBank },
];

const bottomNavItems = [
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className={cn(
          "flex items-center gap-3 transition-all",
          collapsed && "justify-center"
        )}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-success flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-display font-bold text-lg">Riphus</h1>
              <p className="text-xs text-muted-foreground">Pilotez votre argent</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        {!collapsed && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium gradient-premium">Premium</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Débloquez toutes les fonctionnalités
            </p>
            <Button variant="premium" size="sm" className="w-full">
              Passer Premium
            </Button>
          </div>
        )}
        
        <SidebarMenu>
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to={item.url}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span className="font-medium">{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full"
              >
                <LogOut className="h-5 w-5" />
                {!collapsed && <span className="font-medium">Déconnexion</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
