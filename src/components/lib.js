/** @jsx jsx */
import { jsx } from "@emotion/react";
import { FaSpinner } from "react-icons/fa";
import { keyframes } from "@emotion/css";
import styled from "@emotion/styled";
import * as colors from "styles/colors";
import { Link as RouterLink } from "react-router-dom";

const Link = styled(RouterLink)({
  color: colors.indigo,
  ":hover": {
    color: colors.indigoDarken10,
    textDecoration: "underline",
  },
});

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`,
});
Spinner.defaultProps = {
  "aria-label": "loading",
};

const buttonVariants = {
  primary: {
    background: colors.indigo,
    color: colors.base,
  },
  secondary: {
    background: colors.gray,
    color: colors.text,
  },
};

const Button = styled.button(
  {
    padding: "10px 15px",
    border: "0",
    lineHeight: "1",
    borderRadius: "3px",
  },
  ({ variant = "primary" }) => buttonVariants[variant]
);

const CircleButton = styled.button({
  borderRadius: "30px",
  padding: "0",
  width: "40px",
  height: "40px",
  lineHeight: "1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: colors.base,
  color: colors.text,
  border: `1px solid ${colors.gray10}`,
  cursor: "pointer",
});

const BookListUL = styled.ul({
  listStyle: "none",
  padding: "0",
  display: "grid",
  gridTemplateRows: "repeat(auto-fill, minmax(100px, 1fr))",
  gridGap: "1em",
});

const inputStyles = {
  border: "1px solid #f1f1f4",
  background: "#f1f2f7",
  padding: "8px 12px",
};

const Textarea = styled.textarea(inputStyles);

const Input = styled.input({ borderRadius: "3px" }, inputStyles);

function FullPageSpinner() {
  return (
    <div
      css={{
        fontSize: "4em",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner />
    </div>
  );
}

const FormGroup = styled.div({
  display: "flex",
  flexDirection: "column",
});

const errorMessageVariants = {
  stacked: { display: "block" },
  inline: { display: "inline-block" },
};

function ErrorMessage({ error, variant = "stacked", ...props }) {
  return (
    <div
      role="alert"
      css={[{ color: colors.danger }, errorMessageVariants[variant]]}
      {...props}
    >
      <span>There was an error: </span>
      <pre
        css={[
          { whiteSpace: "break-spaces", marign: "0", marginBottom: -5 },
          errorMessageVariants[variant],
        ]}
      >
        {error.message}
      </pre>
    </div>
  );
}

function FullPageErrorFallback({ error }) {
  return (
    <div
      css={{
        color: colors.danger,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      role="alert"
    >
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </div>
  );
}

export {
  Textarea,
  Link,
  BookListUL,
  FullPageErrorFallback,
  Spinner,
  FullPageSpinner,
  Button,
  CircleButton,
  Input,
  FormGroup,
  ErrorMessage,
};
