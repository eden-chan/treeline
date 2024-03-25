'use client'
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/clerk-react";

export default function UserSettings() {
    const { isLoaded, user } = useUser();
    if (!isLoaded) {
        // Handle loading state however you like
        return null;
    }

    if (!user) return (<SignInButton><button className='text-black'>Sign in</button></SignInButton>);

    const updateUser = async () => {
        await user.update({
            firstName: "John",
            lastName: "Doe",
        });
    };
    return (
        <>
            <SignOutButton><button className='text-black'>Sign out</button></SignOutButton>
            <UserButton />
            <button onClick={updateUser} className="text-black">Click me to update your name</button>
            <p className="text-black">user.firstName: {user?.firstName}</p>
            <p className="text-black">user.lastName: {user?.lastName}</p>
            <p className="text-black">user.lastName: {JSON.stringify(user, null, 2)}</p>
        </>
    );
}