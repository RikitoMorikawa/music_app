// /Users/apple/music_app/music_app/src/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-primary/20 via-primary/5 to-background">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90",
            formFieldInput: "border-border focus:border-primary",
          },
        }}
      />
    </div>
  );
}
