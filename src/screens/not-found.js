/** @jsx jsx*/
import { jsx } from "@emotion/react";
import { Link } from "components/lib";

export function NotFoundScreen() {
  return (
    <div
      css={{
        height: "100%",
        display: "grid",
        alignItems: "center",
        justifyContents: "center",
      }}
    >
      <div>
        Sorry... nothing here. <Link to="/list">Go home</Link>
      </div>
    </div>
  );
}
