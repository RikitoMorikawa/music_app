// src / components / UserProfileUpdater.tsx;


import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export const UserProfileUpdater = () => {
  const { isLoaded, isSignedIn, user } = useUser();

useEffect(() => {
  const updateUserImageUrl = async () => {
    if (isLoaded && isSignedIn && user) {
      try {
        await fetch("/api/updateUserImageUrl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: user.id, 
            imageUrl: user.imageUrl 
          }),
        });
      } catch (error) {
        console.error("Failed to update user imageUrl in MongoDB:", error);
      }
    }
  };

  updateUserImageUrl();
}, [isLoaded, isSignedIn, user]);

  return null;
};
