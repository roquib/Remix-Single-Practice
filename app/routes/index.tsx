import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.5",
      }}
    >
      <h1>Welcome to remix</h1>
      <Link to="people">People</Link>
    </main>
  );
}
