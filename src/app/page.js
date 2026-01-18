// app/page.js
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // send everyone to login
}