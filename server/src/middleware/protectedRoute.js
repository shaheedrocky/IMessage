import { getAuth, clerkClient } from "@clerk/express";
import { User } from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      res.status(401).json({ message: "User unauthorized" });
      return;
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      try {
        console.log(`User ${userId} not found in database. Attempting to sync from Clerk...`);
        const clerkUser = await clerkClient.users.getUser(userId);

        if (clerkUser) {
          const email =
            clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
            clerkUser.emailAddresses?.[0]?.emailAddress;

          const fullName =
            [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
            clerkUser.username ||
            email?.split("@")[0] ||
            "User";

          user = await User.findOneAndUpdate(
            { clerkId: userId },
            { clerkId: userId, email, fullName, profilePic: clerkUser.imageUrl },
            { new: true, upsert: true, setDefaultsOnInsert: true }
          );
          console.log(`Successfully synced user ${userId} to database.`);
        }
      } catch (syncError) {
        console.error("Failed to auto-sync user from Clerk:", syncError);
      }
    }

    if (!user) {
      res.status(404).json({ message: "User profile is not synced yet" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware: ", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
