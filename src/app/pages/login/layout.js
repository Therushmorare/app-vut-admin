// This makes this page NOT use the root layout
export default function LoginLayout({ children }) {
  return <>{children}</>; // nothing else, no navbar
}