"use client"

import * as React from "react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Moon, Sun } from "lucide-react"
import { Switch } from "../ui/switch"
import CreateNewChat from "../chat/CreateNewChat"
import NewGroupChatModal from "../chat/NewGroupChatModal"
import GroupChatList from "../chat/GroupChatList"
import AddFriendModal from "../chat/AddFriendModal"
import DirecMessageList from "../chat/DirecMessageList"
import FriendRequestList from "../chat/FriendRequestList"
import { useThemeStore } from "@/stores/useThemeStore"
import { useAuthStore } from "@/stores/useAuthStore"
import { NavUser } from "./nav-user"
import { useState } from "react"




export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {isDark, toggleTheme} = useThemeStore();
  const {user} = useAuthStore();
  const [activeTab, setActiveTab] = useState<'group' | 'direct' | 'request'>('group');
  return (
    <Sidebar variant="inset" {...props}>

      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              asChild 
              className="bg-gradient-primary"
            >
              <a href="#">
                <div className="flex w-full items-center px-2 justify-between">
                  <h1 className="text-xl font-bold text-white">Moji</h1>
                  <div className="flex items-center gap-2">
                    <Sun className="size-4  text-white/80"/>
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-background/80"
                    />
                    <Moon className="size-4 text-white/80" />
                  </div>
                </div>
              </a> 
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Tabs */}
      <div className="flex justify-between px-2 pt-2 gap-2">
        <button className={`flex-1 py-2 rounded ${activeTab==='group' ? 'bg-primary text-white' : 'bg-muted'}`} onClick={()=>setActiveTab('group')}>Nhóm chat</button>
        <button className={`flex-1 py-2 rounded ${activeTab==='direct' ? 'bg-primary text-white' : 'bg-muted'}`} onClick={()=>setActiveTab('direct')}>Chat cá nhân</button>
        <button className={`flex-1 py-2 rounded ${activeTab==='request' ? 'bg-primary text-white' : 'bg-muted'}`} onClick={()=>setActiveTab('request')}>Yêu cầu kết bạn</button>
      </div>

      {/* Content */}
      <SidebarContent className="beatifull-scrollbar">
        {/* New chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat/>
          </SidebarGroupContent>

        </SidebarGroup>

        {/* Tab content */}
        {activeTab === 'group' && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase">
              Nhom chat
            </SidebarGroupLabel>
            <SidebarGroupAction title="Tao Nhom" className="cursor-pointer">
              <NewGroupChatModal/>
            </SidebarGroupAction>
            <SidebarGroupContent className="mt-3">
              <GroupChatList/>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {activeTab === 'direct' && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase">
              Ban be
            </SidebarGroupLabel>
            <SidebarGroupAction title="Ket Ban" className="cursor-pointer">
              <AddFriendModal/>
            </SidebarGroupAction>
            <SidebarGroupContent className="mt-3">
              <DirecMessageList/>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {activeTab === 'request' && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase">
              Yêu cầu kết bạn
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-3">
              <FriendRequestList/>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
       {user && < NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
