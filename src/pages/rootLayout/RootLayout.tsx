import { Outlet } from "react-router-dom";
import Navigation from "../../components/Navigation";

type UserRole = "ADMIN" | "EMPLOYEE" | "USER" | undefined;

type RootLayoutProps = {
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
};

export default function RootLayout({ userRole, userName, onLogout }: RootLayoutProps) {
  return (
    <>
      <Navigation
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
      />
      <Outlet />
    </>
  );
}
