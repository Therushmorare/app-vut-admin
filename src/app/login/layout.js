// app/login/layout.js
export const metadata = {
  title: "Login",
};

export default function LoginLayout({ children }) {
  return <>{children}</>; // render only the page, no parent layout
}
