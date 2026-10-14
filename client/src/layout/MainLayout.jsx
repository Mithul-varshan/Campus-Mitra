import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
export default function MainLayout() {
  return (
    <div
      style={{ display:"flex",height:"100vh",overflow:"hidden",backgroundColor:"var(--muted)",fontFamily:"var(--font-family-body)",color:"var(--foreground)",}}>
      <Sidebar />
      <div style={{flex:1,display:"flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "var(--muted)",
        }}
      >
        <Navbar />
        <main style={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
