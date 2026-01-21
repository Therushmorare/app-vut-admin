import "./styles/globals.css"
import Layout from "../../components/Layout"

export default function HostLayout({ children }) {
  return <Layout>{children}</Layout>;
}