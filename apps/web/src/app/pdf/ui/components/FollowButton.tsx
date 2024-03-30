"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { followAction } from "@src/app/actions";
import { useState, useTransition } from "react";

export default function FollowButton({
  user1,
  user2,
}: {
  user1: User;
  user2: User;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  // Check if user1 is currently following user2 by looking for user2's email in user1's follows list.
  const [isFollowing, setIsFollowing] = useState(
    user1.follows.includes(user2.email),
  );

  const handleFollow = async () => {
    setError(null);
    try {
      startTransition(async () => {
        await followAction(user1, user2);
      });
    } catch (error) {
      setError(error.message);
    }

    setIsFollowing((isFollowing) => !isFollowing);
  };

  return (
    <>
      <Button onClick={handleFollow} disabled={isPending}>
        {isFollowing ? "Following" : "Follow"}
      </Button>
      {error && <p>{error}</p>}
    </>
  );
}

