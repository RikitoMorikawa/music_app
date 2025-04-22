// /Users/aelpp / music_app / music_app / src / app / sign - up / [[...(sign - up)]] / page.tsx;
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-primary/20 via-primary/5 to-background">
      <SignUp />
    </div>
  );
}
