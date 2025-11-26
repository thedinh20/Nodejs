import {create } from 'zustand';
import {toast} from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';
import { persist } from 'zustand/middleware';
import { useChatStore } from './useChatStroe';



export const useAuthStore = create<AuthState> ()(
    persist((set, get) => ({
    accessToken: null ,
    user: null ,
    loading: false,

    setAccessToken: (accessToken) => {
        set({ accessToken});
    },

    clearState: () => {
        set({ accessToken: null, user: null , loading: false });
        localStorage.clear();
        useChatStore.getState().reset();
    },

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });
            // goi api
            await authService.signUp(username, password, email, firstName, lastName);
            
            
            toast.success('Dang ky thanh cong! ban se duoc chuyen den trang dang nhap');
        } catch (error) {
            console.error(error);
            toast.error('Dang ky khong thanh cong');
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true }); 

            localStorage.clear();
            useChatStore.getState().reset();

            const accessToken = await authService.signIn(username, password);
            // set({ accessToken });
            get().setAccessToken(accessToken);
            
            await get().fetchMe();
            useChatStore.getState().fetchConversations();
            
            toast.success('Chao mung ban quay lai voi Moji!');
        } catch (error) {
            console.error(error);
            toast.error('Dang nhap khong thanh cong');
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            get().clearState();
            // set({ loading: true }); 
            await  authService.signOut();
            toast.success('Dang xuat thanh cong');
        } catch (error) {
            console.error(error);
            toast.error('Dang xuat khong thanh cong, hay thu lai');
        // } finally {
        //     set({ loading: false });
        }
    },

    fetchMe: async () => {
        try {
            set({ loading: true }); 
            const user = await authService.fetchMe();
            set({ user });
        } catch (error) {
            console.error(error);
            set({ user: null, accessToken: null });
            toast.error('Khong the lay thong tin nguoi dung');
        } finally {
            set({ loading: false });
        }
    },

    refresh: async () => {
        try {
            set({ loading: true });
            const {user, fetchMe, setAccessToken} = get();
            const accessToken = await authService.refresh();
            // set({ accessToken });
            setAccessToken(accessToken);
            if (!user) {
                await fetchMe();
            }
        } catch (error) {
            console.error(error);
            toast.error('Phien dang nhap da het han, vui long dang nhap lai');
            get().clearState();
        } finally {
            set({ loading: false });

        }
    },
}),
    {
        name: 'auth-storage',
        partialize: (state) => ({
            // accessToken: state.accessToken,
            user: state.user,
        }),
    })
);