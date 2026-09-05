import AdminAuth from ".";

export const metadata = {
  title: "Admin Login",
  description: "Login to your admin account to manage the application.",
};

export default function page() {
  return <AdminAuth />;
}
