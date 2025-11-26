// import React from "react";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

const Logout = () => { 
    const {signOut } = useAuthStore();
    const naivigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut();
            naivigate("/signin");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
    return <Button variant="completeGhost" onClick={handleLogout}>
        <LogOut className="text-destructive" /> 
        Log Out
    </Button>; 
}

export default Logout;