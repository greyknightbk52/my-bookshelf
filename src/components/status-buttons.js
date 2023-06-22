/** @jsx jsx*/
import { jsx } from "@emotion/react";
import * as React from "react";
import * as colors from "styles/colors";
import { Tooltip } from "@mui/joy";
import {
  useListItem,
  useCreateListItem,
  useUpdateListItem,
  useRemoveListItem,
} from "utils/list-items";
import { useAsync } from "utils/hooks";
import { CircleButton, Spinner } from "components/lib";
import {
  FaTimesCircle,
  FaCheckCircle,
  FaBook,
  FaPlusCircle,
  FaMinusCircle,
} from "react-icons/fa";
function TooltipButton({ label, highlight, onClick, icon, ...rest }) {
  const { isLoading, isError, error, run, reset } = useAsync();

  function handleClick() {
    if (isError) {
      reset();
    } else {
      run(onClick());
    }
  }

  return (
    <Tooltip title={isError ? error : label}>
      <CircleButton
        css={{
          backgroundColor: "white",
          ":hover, :focus": {
            color: isLoading
              ? colors.gray80
              : isError
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  );
}

function StatusButtons({ book }) {
  const listItem = useListItem(book.id);
  const { mutateAsync: update } = useUpdateListItem();
  const { mutateAsync: handleRemoveClick } = useRemoveListItem();
  const { mutateAsync: handleAddClick } = useCreateListItem();

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Mark as unread"
            highlight={colors.yellow}
            onClick={() => update({ id: listItem.id, finishDate: null })}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={() => update({ id: listItem.id, finishDate: Date.now() })}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => handleRemoveClick({ id: listItem.id })}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => handleAddClick({ bookId: book.id })}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  );
}

export { StatusButtons };
