"use client";

import { logout } from "@/actions/logout-action";
import { toast } from "./use-toast";
import { Button } from "./button";

function LogoutButton() {
  const handleLogout = async () => {
    await logout();
    toast({
      title: "Ви вийшли з акаунту",
    });
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Вийти з акаунту
    </Button>
  );
}

export default LogoutButton;
